import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Student, Halaqah, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/modals/Modal';
import { useToast } from '../../components/common/toast/ToastProvider';
import { 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash2,
  BookOpen
} from 'lucide-react';

const resolvePhotoUrl = (url: string) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;

  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  const baseUrl = api.defaults.baseURL || process.env.REACT_APP_API_URL || window.location.origin;

  return new URL(normalizedPath, baseUrl).toString();
};

const StudentList: React.FC = () => {
  const levelOptions = ['SMP', 'SMA'] as const;

  const classOptionsByLevel: Record<string, string[]> = {
    SMP: ['7', '8', '9'],
    SMA: ['10', '11', '12']
  };

  const { user } = useAuth();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const halaqahIdParam = searchParams.get('halaqah');

  const [students, setStudents] = useState<Student[]>([]);
  const [halaqahs, setHalaqahs] = useState<Halaqah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHalaqah, setSelectedHalaqah] = useState(halaqahIdParam || '');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    nis: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
    halaqahId: halaqahIdParam || '',
    level: '',
    className: '',
    isActive: true
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const isEditing = !!selectedStudent;
  const classOptions = classOptionsByLevel[formData.level] || [];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [studentsRes, halaqahsRes] = await Promise.all([
        api.get('/students', { params: { halaqahId: selectedHalaqah || undefined } }),
        api.get('/halaqahs')
      ]);
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
      setHalaqahs(Array.isArray(halaqahsRes.data) ? halaqahsRes.data : []);
    } catch (error) {
      console.error('Failed to fetch students', error);
      setStudents([]);
      setHalaqahs([]);
    } finally {
      setLoading(false);
    }
  }, [selectedHalaqah]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreateModal = () => {
    setSelectedStudent(null);
    setFormData({
      fullName: '',
      nis: '',
      gender: 'MALE',
      halaqahId: selectedHalaqah || '',
      level: '',
      className: '',
      isActive: true
    });
    setPhotoFile(null);
    setPhotoPreview('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      fullName: student.fullName,
      nis: student.nis || '',
      gender: student.gender as any,
      halaqahId: student.halaqahId,
      level: student.level || '',
      className: student.className || '',
      isActive: student.isActive
    });
    setPhotoFile(null);
    setPhotoPreview(student.photoUrl || '');
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append('fullName', formData.fullName);
      payload.append('nis', formData.nis);
      payload.append('gender', formData.gender);
      payload.append('halaqahId', formData.halaqahId);
      payload.append('level', formData.level);
      payload.append('className', formData.className);
      payload.append('isActive', String(formData.isActive));
      if (photoFile) {
        payload.append('photo', photoFile);
      }

      if (isEditing) {
        await api.patch(`/students/${selectedStudent.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/students', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setIsModalOpen(false);
      fetchData();
      toast.success(isEditing ? 'Data santri berhasil diperbarui.' : 'Santri baru berhasil ditambahkan.');
    } catch (error) {
      console.error('Operation failed', error);
      alert('Gagal menyimpan data santri.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/students/${selectedStudent.id}`);
      setIsDeleteModalOpen(false);
      fetchData();
      toast.success('Santri berhasil dihapus.');
    } catch (error) {
      console.error('Delete failed', error);
      alert('Gagal menghapus santri. Pastikan santri tidak memiliki riwayat hafalan/ujian.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel ? (s.level || '').toUpperCase() === filterLevel : true;
    const matchesClass = filterClass ? (s.className || '') === filterClass : true;
    return matchesSearch && matchesLevel && matchesClass;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / rowsPerPage));
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterLevel, filterClass, selectedHalaqah]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Santri</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isAdmin ? 'Kelola semua santri yang terdaftar di pesantren.' : 'Daftar santri di halaqah yang Anda ampu.'}
          </p>
        </div>
        {isAdmin && (
          <button 
            onClick={handleOpenCreateModal}
            className="btn btn-primary gap-2"
          >
            <Plus size={18} />
            Santri Baru
          </button>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditing ? 'Edit Data Santri' : 'Tambah Santri Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              placeholder="Masukkan nama lengkap"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIS (Opsional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                placeholder="Nomor Induk"
                value={formData.nis}
                onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              >
                <option value="MALE">Laki-laki</option>
                <option value="FEMALE">Perempuan</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto Santri</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setPhotoFile(file);
                if (file) {
                  setPhotoPreview(URL.createObjectURL(file));
                }
              }}
            />
            {photoPreview && (
              <img
                src={photoPreview.startsWith('/uploads') ? resolvePhotoUrl(photoPreview) : photoPreview}
                alt="Preview santri"
                className="mt-2 h-16 w-16 rounded-full object-cover border"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Halaqah</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              value={formData.halaqahId}
              onChange={(e) => setFormData({ ...formData, halaqahId: e.target.value })}
            >
              <option value="">Pilih Halaqah</option>
              {halaqahs.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenjang/Level</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value, className: '' })}
              >
                <option value="">Pilih Jenjang</option>
                {levelOptions.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                disabled={!formData.level}
              >
                <option value="">{formData.level ? 'Pilih Kelas' : 'Pilih Jenjang dahulu'}</option>
                {classOptions.map((classOption) => (
                  <option key={classOption} value={classOption}>{classOption}</option>
                ))}
              </select>
            </div>
          </div>
          {isEditing && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Santri Aktif</label>
            </div>
          )}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn btn-primary text-sm"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Santri'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus santri <span className="font-bold">{selectedStudent?.fullName}</span>? 
            Tindakan ini tidak dapat dibatalkan dan akan menghapus riwayat hafalan terkait jika ada.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </Modal>

      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama atau NIS santri..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select 
              className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm min-w-[140px]"
              value={selectedHalaqah}
              onChange={(e) => setSelectedHalaqah(e.target.value)}
            >
              <option value="">Semua Halaqah</option>
              {halaqahs.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
          <select
            className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            value={filterLevel}
            onChange={(e) => {
              setFilterLevel(e.target.value);
              setFilterClass('');
            }}
          >
            <option value="">Semua Jenjang</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
          </select>
          <select
            className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">Semua Kelas</option>
            {['7', '8', '9', '10', '11', '12']
              .filter((classOption) => {
                if (!filterLevel) return true;
                if (filterLevel === 'SMP') return ['7', '8', '9'].includes(classOption);
                if (filterLevel === 'SMA') return ['10', '11', '12'].includes(classOption);
                return true;
              })
              .map((classOption) => (
                <option key={classOption} value={classOption}>{classOption}</option>
              ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="card overflow-hidden">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-100 rounded w-full"></div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-50 rounded w-full"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto touch-pan-x">
            <table className="min-w-[900px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Santri</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Halaqah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress Terakhir</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length > 0 ? (
                  paginatedStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {student.photoUrl ? (
                            <img
                              src={resolvePhotoUrl(student.photoUrl)}
                              alt={student.fullName}
                              className="flex-shrink-0 h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {student.fullName.charAt(0)}
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                            <div className="text-sm text-gray-500">NIS: {student.nis || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student.halaqah?.name || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Juz {student.currentJuz}</div>
                        <div className="text-xs text-gray-500">Halaman {student.lastMemorizedPage || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {student.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                           <Link 
                            to={`/session?student=${student.id}`}
                            className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors"
                            title="Catat Hafalan"
                           >
                             <BookOpen size={18} />
                           </Link>
                           {isAdmin && (
                             <>
                               <button 
                                 onClick={() => handleOpenEditModal(student)}
                                 className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                 title="Edit"
                               >
                                 <Edit size={18} />
                               </button>
                               <button 
                                 onClick={() => handleOpenDeleteModal(student)}
                                 className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                 title="Hapus"
                               >
                                 <Trash2 size={18} />
                               </button>
                             </>
                           )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                       Tidak ada santri yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredStudents.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Menampilkan {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, filteredStudents.length)} dari {filteredStudents.length} santri
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
                >
                  Sebelumnya
                </button>
                <span className="text-sm text-gray-600">
                  Halaman {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentList;
