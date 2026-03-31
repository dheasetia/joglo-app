import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Halaqah, UserRole } from '../../types';
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../../components/common/modals/Modal';
import { Teacher } from '../../types';
import { useToast } from '../../components/common/toast/ToastProvider';

const HalaqahList: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [halaqahs, setHalaqahs] = useState<Halaqah[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHalaqah, setSelectedHalaqah] = useState<Halaqah | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacherId: ''
  });

  const isEditing = !!selectedHalaqah;

  useEffect(() => {
    fetchHalaqahs();
    if (user?.role === UserRole.ADMIN) {
      fetchTeachers();
    }
  }, []);

  const fetchHalaqahs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/halaqahs');
      setHalaqahs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch halaqahs', error);
      setHalaqahs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/teachers');
      setTeachers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch teachers', error);
      setTeachers([]);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedHalaqah(null);
    setFormData({ name: '', description: '', teacherId: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (halaqah: Halaqah) => {
    setSelectedHalaqah(halaqah);
    setFormData({ 
      name: halaqah.name, 
      description: halaqah.description || '', 
      teacherId: halaqah.teacherId 
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (halaqah: Halaqah) => {
    setSelectedHalaqah(halaqah);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (isEditing) {
        await api.patch(`/halaqahs/${selectedHalaqah.id}`, formData);
      } else {
        await api.post('/halaqahs', formData);
      }
      setIsModalOpen(false);
      fetchHalaqahs();
      toast.success(isEditing ? 'Data halaqah berhasil diperbarui.' : 'Halaqah baru berhasil ditambahkan.');
    } catch (error) {
      console.error('Operation failed', error);
      alert('Gagal menyimpan data halaqah.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedHalaqah) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/halaqahs/${selectedHalaqah.id}`);
      setIsDeleteModalOpen(false);
      fetchHalaqahs();
      toast.success('Halaqah berhasil dihapus.');
    } catch (error) {
      console.error('Delete failed', error);
      alert('Gagal menghapus halaqah. Pastikan halaqah tidak memiliki santri.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredHalaqahs = halaqahs.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.teacher?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Halaqah</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isAdmin ? 'Kelola semua kelompok halaqah yang terdaftar.' : 'Daftar kelompok halaqah yang Anda ampu.'}
          </p>
        </div>
        {isAdmin && (
          <button 
            onClick={handleOpenCreateModal}
            className="btn btn-primary gap-2"
          >
            <Plus size={18} />
            Halaqah Baru
          </button>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditing ? 'Edit Halaqah' : 'Tambah Halaqah Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Halaqah</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Contoh: Halaqah Abu Bakar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Muhaffizh (Guru)</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            >
              <option value="">Pilih Muhaffizh</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              rows={3}
              placeholder="Keterangan tambahan..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn btn-primary"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Halaqah'}
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
            Apakah Anda yakin ingin menghapus halaqah <span className="font-bold">{selectedHalaqah?.name}</span>? 
            Tindakan ini tidak dapat dibatalkan dan hanya bisa dilakukan jika halaqah sudah kosong (tidak ada santri).
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

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama halaqah atau muhaffizh..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-white rounded-lg animate-pulse border border-gray-200"></div>
          ))}
        </div>
      ) : filteredHalaqahs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHalaqahs.map((halaqah) => (
            <div key={halaqah.id} className="card hover:shadow-md transition-shadow flex flex-col group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Users size={24} />
                    </div>
                    {isAdmin && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleOpenEditModal(halaqah)}
                              className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"
                              title="Edit"
                            >
                                <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleOpenDeleteModal(halaqah)}
                              className="p-1.5 hover:bg-red-50 rounded-md text-red-600"
                              title="Hapus"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{halaqah.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-4 flex-grow">
                    {halaqah.description || 'Tidak ada deskripsi.'}
                </p>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Muhaffizh:</span>
                        <span className="font-medium text-gray-900">{halaqah.teacher?.fullName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Santri:</span>
                        <span className="font-medium text-gray-900">{halaqah._count?.students || 0} Santri</span>
                    </div>
                </div>

                <div className="mt-6 flex gap-2">
                    <Link 
                        to={`/student?halaqah=${halaqah.id}`}
                        className="flex-1 btn btn-primary text-xs py-1.5 gap-1.5"
                    >
                        Santri <ExternalLink size={14} />
                    </Link>
                    <button className="flex-1 btn bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs py-1.5 gap-1.5">
                        Detail <ChevronRight size={14} />
                    </button>
                </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card py-12 flex flex-col items-center justify-center text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Users size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Halaqah tidak ditemukan</h3>
          <p className="text-gray-500 max-w-xs mt-2">
            Tidak ada halaqah yang sesuai dengan kriteria pencarian Anda.
          </p>
          {isAdmin && (
            <button
              onClick={handleOpenCreateModal}
              className="mt-6 btn btn-primary gap-2"
            >
              <Plus size={18} />
              Buat Halaqah Pertama
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HalaqahList;
