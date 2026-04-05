import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User, UserRole } from '../../types';
import { UserSquare2, Plus, Search, Mail, Edit2, Trash2 } from 'lucide-react';
import Modal from '../../components/common/modals/Modal';
import { useToast } from '../../components/common/toast/ToastProvider';
import { resolvePhotoUrl } from '../../utils/resolvePhotoUrl';

type MuhaffizhUser = User & {
  isActive: boolean;
  createdAt?: string;
};

const emptyForm = {
  id: undefined as string | undefined,
  name: '',
  email: '',
  password: '',
  photo: null as File | null,
  isActive: true,
};

const TeacherList: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [muhaffizhs, setMuhaffizhs] = useState<MuhaffizhUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMuhaffizh, setSelectedMuhaffizh] = useState<MuhaffizhUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [photoPreview, setPhotoPreview] = useState('');

  const isEditing = !!formData.id;

  const fetchMuhaffizhs = useCallback(async () => {
    if (user?.role !== UserRole.ADMIN) return;
    try {
      setLoading(true);
      const response = await api.get('/users');
      const users = Array.isArray(response.data) ? response.data : [];
      setMuhaffizhs(users.filter((item) => item.role === UserRole.MUHAFFIZH));
    } catch (error) {
      console.error('Failed to fetch muhaffizhs', error);
      setMuhaffizhs([]);
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    fetchMuhaffizhs();
  }, [fetchMuhaffizhs]);

  const handleOpenCreateModal = () => {
    setSelectedMuhaffizh(null);
    setFormData({ ...emptyForm });
    setPhotoPreview('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (muhaffizh: MuhaffizhUser) => {
    setSelectedMuhaffizh(muhaffizh);
    setFormData({
      id: muhaffizh.id,
      name: muhaffizh.name,
      email: muhaffizh.email,
      password: '',
      photo: null,
      isActive: muhaffizh.isActive,
    });
    setPhotoPreview(muhaffizh.photoUrl || '');
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (muhaffizh: MuhaffizhUser) => {
    setSelectedMuhaffizh(muhaffizh);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('role', UserRole.MUHAFFIZH);
      payload.append('isActive', String(formData.isActive));

      if (formData.photo) {
        payload.append('photo', formData.photo);
      }

      if (isEditing) {
        await api.patch(`/users/${formData.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (formData.password) {
          await api.patch(`/users/${formData.id}/password`, {
            password: formData.password,
          });
        }
      } else {
        payload.append('password', formData.password);
        await api.post('/users', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setIsModalOpen(false);
      fetchMuhaffizhs();
      toast.success(isEditing ? 'Data muhaffizh berhasil diperbarui.' : 'Muhaffizh baru berhasil ditambahkan.');
    } catch (error: any) {
      console.error('Operation failed', error);
      alert(error.response?.data?.message || 'Gagal menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMuhaffizh) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/users/${selectedMuhaffizh.id}`);
      setIsDeleteModalOpen(false);
      fetchMuhaffizhs();
      toast.success('Data muhaffizh berhasil dihapus.');
    } catch (error: any) {
      console.error('Delete failed', error);
      alert(error.response?.data?.message || 'Gagal menghapus data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMuhaffizhs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return muhaffizhs.filter((item) => {
      if (!query) return true;

      return (
        (item.name || '').toLowerCase().includes(query) ||
        (item.email || '').toLowerCase().includes(query)
      );
    });
  }, [muhaffizhs, searchTerm]);

  if (user?.role !== UserRole.ADMIN) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-xl font-bold text-red-600">Akses Ditolak</h2>
        <p className="text-gray-500 mt-2">Hanya Admin yang dapat mengakses halaman ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserSquare2 className="text-primary" />
            Manajemen Muhaffizh
          </h1>
          <p className="text-gray-500">Kelola data akun muhaffizh.</p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="btn btn-primary gap-2"
        >
          <Plus size={18} />
          Tambah Muhaffizh
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Data Muhaffizh' : 'Tambah Muhaffizh Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required={!isEditing}
              disabled={isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="email@tahfizh.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {isEditing && <p className="text-[10px] text-gray-500 mt-1">Email tidak dapat diubah.</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto Profil</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFormData({ ...formData, photo: file });
                if (file) {
                  setPhotoPreview(URL.createObjectURL(file));
                }
              }}
            />
            {photoPreview && (
              <img src={resolvePhotoUrl(photoPreview)} alt="Preview" className="mt-2 h-14 w-14 rounded-full object-cover border" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {isEditing && <span className="text-gray-400">(Kosongkan jika tidak diubah)</span>}
            </label>
            <input
              type="password"
              required={!isEditing}
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Akun Aktif</label>
          </div>
          <div className="pt-2 flex gap-3">
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
              {isSubmitting ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Muhaffizh')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus muhaffizh <span className="font-bold">{selectedMuhaffizh?.name}</span>?
            Tindakan ini tidak dapat dibatalkan.
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

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto touch-pan-x">
            <table className="w-full min-w-[820px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMuhaffizhs.map((muhaffizh) => (
                  <tr key={muhaffizh.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {resolvePhotoUrl(muhaffizh.photoUrl) ? (
                          <img
                            src={resolvePhotoUrl(muhaffizh.photoUrl)}
                            alt={muhaffizh.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {muhaffizh.name.charAt(0)}
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{muhaffizh.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Mail size={14} className="text-gray-400" />
                        {muhaffizh.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        muhaffizh.isActive
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {muhaffizh.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(muhaffizh)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(muhaffizh)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMuhaffizhs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">
                      Tidak ada data muhaffizh yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherList;
