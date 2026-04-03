import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import { User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Users, Plus, Search, Edit2, Trash2, Shield, Mail, Check, X } from 'lucide-react';
import Modal from '../../components/common/modals/Modal';
import { useToast } from '../../components/common/toast/ToastProvider';
import { resolvePhotoUrl } from '../../utils/resolvePhotoUrl';

const emptyForm = {
  id: undefined as string | undefined,
  name: '',
  email: '',
  password: '',
  photo: null as File | null,
  role: UserRole.MUHAFFIZH as UserRole,
  isActive: true,
};

const UsersList: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState<(User & { isActive: boolean; createdAt?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');

  const isEditing = !!formData.id;

  useEffect(() => {
    if (user?.role === UserRole.ADMIN) {
      fetchUsers();
    }
  }, [user]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return users.filter(u =>
      !q || (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)
    );
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Failed to fetch users', e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({ ...emptyForm });
    setPhotoPreview('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: any) => {
    setFormData({
      id: u.id,
      name: u.name,
      email: u.email,
      password: '',
      photo: null,
      role: u.role,
      isActive: u.isActive,
    });
    setPhotoPreview(u.photoUrl || '');
    setIsModalOpen(true);
  };

  const handleOpenDelete = (u: any) => {
    setFormData({
      id: u.id,
      name: u.name,
      email: u.email,
      password: '',
      photo: null,
      role: u.role,
      isActive: u.isActive,
    });
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('role', formData.role);
      payload.append('isActive', String(formData.isActive));
      if (formData.photo) {
        payload.append('photo', formData.photo);
      }

      if (isEditing && formData.id) {
        await api.patch(`/users/${formData.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (formData.password) {
          await api.patch(`/users/${formData.id}/password`, { password: formData.password });
        }
      } else {
        payload.append('password', formData.password);
        await api.post('/users', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setIsModalOpen(false);
      fetchUsers();
      toast.success(isEditing ? 'Data pengguna berhasil diperbarui.' : 'Pengguna baru berhasil ditambahkan.');
    } catch (error: any) {
      console.error('Save user failed', error);
      alert(error.response?.data?.message || 'Gagal menyimpan pengguna');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/users/${formData.id}`);
      setIsDeleteModalOpen(false);
      fetchUsers();
      toast.success('Pengguna berhasil dihapus.');
    } catch (error: any) {
      console.error('Delete user failed', error);
      alert(error.response?.data?.message || 'Gagal menghapus pengguna');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role !== UserRole.ADMIN) {
    return <div className="text-gray-500">Hanya Admin yang dapat mengakses halaman ini.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
            <p className="text-gray-500">Kelola Admin dan Muhaffizh</p>
          </div>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary flex items-center gap-2">
          <Plus size={16} />
          Tambah Pengguna
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
        <Search size={18} className="text-gray-400" />
        <input
          placeholder="Cari nama atau email..."
          className="w-full outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider font-semibold">
              <th className="px-6 py-4 text-left">Nama</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Peran</th>
              <th className="px-6 py-4 text-center">Aktif</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Memuat...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Tidak ada data</td></tr>
            ) : (
              filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {u.photoUrl ? (
                        <img
                          src={resolvePhotoUrl(u.photoUrl)}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {u.name.charAt(0)}
                        </div>
                      )}
                      <div className="font-semibold text-gray-900">{u.name}</div>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(u.createdAt || '').toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700"><Mail size={14} /> {u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                      <Shield size={12} /> {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {u.isActive ? (
                      <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs"><Check size={14} /> Aktif</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-xs"><X size={14} /> Nonaktif</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleOpenEdit(u)} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => handleOpenDelete(u)} className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline">
                      <Trash2 size={14} /> Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Edit Pengguna' : 'Tambah Pengguna'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Nama</label>
            <input
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Foto</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFormData({ ...formData, photo: file });
                if (file) {
                  setPhotoPreview(URL.createObjectURL(file));
                }
              }}
            />
            {photoPreview && (
              <img src={photoPreview} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover border" />
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Peran</label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                <option value={UserRole.ADMIN}>ADMIN</option>
                <option value={UserRole.MUHAFFIZH}>MUHAFFIZH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Status</label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.isActive ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password {isEditing && <span className="text-gray-400">(kosongkan jika tidak diubah)</span>}</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!isEditing}
              minLength={6}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn">Batal</button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Hapus Pengguna">
        <div className="space-y-4">
          <p>Anda yakin ingin menghapus pengguna <span className="font-semibold">{formData.name}</span>?</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsDeleteModalOpen(false)} className="btn">Batal</button>
            <button onClick={handleDelete} disabled={isSubmitting} className="btn bg-red-600 text-white hover:bg-red-700">{isSubmitting ? 'Menghapus...' : 'Hapus'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersList;
