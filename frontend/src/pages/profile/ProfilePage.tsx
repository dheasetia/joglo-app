import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Plus, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Halaqah, Student, Teacher, UserRole } from '../../types';
import { useToast } from '../../components/common/toast/ToastProvider';

const ProfilePage: React.FC = () => {
  const toast = useToast();
  const jenjangOptions = ['SMP', 'SMA'] as const;
  const kelasOptionsByJenjang: Record<string, string[]> = {
    SMP: ['7', '8', '9'],
    SMA: ['10', '11', '12'],
  };

  const { user, logout, refreshUser } = useAuth();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [halaqah, setHalaqah] = useState<Halaqah | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    notes: '',
  });
  const [accountForm, setAccountForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');

  const [halaqahForm, setHalaqahForm] = useState({
    name: '',
    description: '',
  });

  const [studentForm, setStudentForm] = useState({
    fullName: '',
    nis: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
    jenjang: '',
    level: '',
  });
  const [studentPhoto, setStudentPhoto] = useState<File | null>(null);
  const [studentPhotoPreview, setStudentPhotoPreview] = useState('');
  const kelasOptions = kelasOptionsByJenjang[studentForm.jenjang] || [];

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const [halaqahsRes, studentsRes] = await Promise.all([
        api.get('/halaqahs'),
        api.get('/students'),
      ]);

      const halaqahList = Array.isArray(halaqahsRes.data) ? (halaqahsRes.data as Halaqah[]) : [];
      const studentList = Array.isArray(studentsRes.data) ? (studentsRes.data as Student[]) : [];
      const myHalaqah = halaqahList[0] || null;

      let myTeacher: Teacher | null = null;
      if (myHalaqah?.teacherId) {
        try {
          const teacherRes = await api.get(`/teachers/${myHalaqah.teacherId}`);
          myTeacher = teacherRes.data as Teacher;
        } catch (error) {
          console.error('Gagal memuat data muhaffizh', error);
        }
      }

      setTeacher(myTeacher);
      setHalaqah(myHalaqah);
      setStudents(studentList);

      if (myTeacher) {
        setProfileForm({
          fullName: myTeacher.fullName || '',
          phone: myTeacher.phone || '',
          notes: myTeacher.notes || '',
        });
      }

      setAccountForm((prev) => ({
        ...prev,
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setProfilePhoto(null);
      setProfilePhotoPreview(user?.photoUrl ? `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}${user.photoUrl}` : '');

      if (myHalaqah) {
        setHalaqahForm({
          name: myHalaqah.name || '',
          description: myHalaqah.description || '',
        });
      }
    } catch (error) {
      console.error('Gagal memuat profil', error);
      toast.error('Gagal memuat data profil.');
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  useEffect(() => {
    if (user?.role === UserRole.MUHAFFIZH) {
      fetchProfileData();
    } else {
      setLoading(false);
    }
  }, [fetchProfileData, user?.role]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacher || !user) return;

    try {
      setIsSubmitting(true);
      if (accountForm.newPassword && !accountForm.currentPassword) {
        toast.error('Silakan isi password saat ini untuk mengganti password.');
        return;
      }

      if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
        toast.error('Konfirmasi password baru tidak sesuai.');
        return;
      }

      const userPayload = new FormData();
      userPayload.append('name', accountForm.name);
      userPayload.append('email', accountForm.email);
      if (profilePhoto) {
        userPayload.append('photo', profilePhoto);
      }

      const updatedUserRes = await api.patch(`/users/${user.id}`, userPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updatedUser = updatedUserRes.data;

      await api.patch(`/teachers/${teacher.id}`, profileForm);

      if (accountForm.newPassword) {
        await api.patch('/users/me/password', {
          currentPassword: accountForm.currentPassword,
          newPassword: accountForm.newPassword,
        });
      }

      refreshUser({
        ...user,
        ...updatedUser,
      });

      toast.success('Data diri berhasil diperbarui.');
      fetchProfileData();
    } catch (error) {
      console.error('Gagal memperbarui data diri', error);
      toast.error('Gagal memperbarui data diri.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHalaqahSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!halaqah) return;

    try {
      setIsSubmitting(true);
      await api.patch(`/halaqahs/${halaqah.id}`, halaqahForm);
      toast.success('Data halaqah berhasil diperbarui.');
      fetchProfileData();
    } catch (error) {
      console.error('Gagal memperbarui halaqah', error);
      toast.error('Gagal memperbarui data halaqah.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!halaqah) return;

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append('fullName', studentForm.fullName);
      payload.append('nis', studentForm.nis);
      payload.append('gender', studentForm.gender);
      payload.append('halaqahId', halaqah.id);
      payload.append('level', studentForm.jenjang);
      payload.append('className', studentForm.level);
      if (studentPhoto) {
        payload.append('photo', studentPhoto);
      }

      await api.post('/students', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStudentForm({
        fullName: '',
        nis: '',
        gender: 'MALE',
        jenjang: '',
        level: '',
      });
      setStudentPhoto(null);
      setStudentPhotoPreview('');
      toast.success('Santri berhasil ditambahkan.');
      fetchProfileData();
    } catch (error) {
      console.error('Gagal menambah santri', error);
      toast.error('Gagal menambah santri.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Memuat profil...</div>;
  }

  if (user?.role !== UserRole.MUHAFFIZH) {
    return <div className="text-sm text-gray-600">Halaman ini khusus muhaffizh.</div>;
  }

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <h2 className="text-base font-semibold text-primary">Aksi Cepat</h2>
        <div className="flex items-center gap-3">
          {user?.photoUrl ? (
            <img
              src={`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}${user.photoUrl}`}
              alt={user.name}
              className="h-12 w-12 rounded-full object-cover border"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              {user?.name?.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            to="/reports"
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium"
          >
            Buka Laporan
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium inline-flex items-center gap-2"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </div>

      <form onSubmit={handleProfileSubmit} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <h2 className="text-base font-semibold text-primary">Data Diri</h2>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Nama akun"
          value={accountForm.name}
          onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
          required
        />
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Email"
          type="email"
          value={accountForm.email}
          onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
          required
        />
        <input
          type="file"
          accept="image/*"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setProfilePhoto(file);
            if (file) {
              setProfilePhotoPreview(URL.createObjectURL(file));
            }
          }}
        />
        {profilePhotoPreview && (
          <img src={profilePhotoPreview} alt="Preview profil" className="h-16 w-16 rounded-full object-cover border" />
        )}
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Nama lengkap"
          value={profileForm.fullName}
          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
          required
        />
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="No. telepon"
          value={profileForm.phone}
          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
        />
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Catatan"
          value={profileForm.notes}
          onChange={(e) => setProfileForm({ ...profileForm, notes: e.target.value })}
          rows={3}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Password saat ini"
            value={accountForm.currentPassword}
            onChange={(e) => setAccountForm({ ...accountForm, currentPassword: e.target.value })}
          />
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Password baru (opsional)"
            value={accountForm.newPassword}
            onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })}
          />
        </div>
        <input
          type="password"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Konfirmasi password baru"
          value={accountForm.confirmPassword}
          onChange={(e) => setAccountForm({ ...accountForm, confirmPassword: e.target.value })}
        />
        <button
          type="submit"
          disabled={!teacher || isSubmitting}
          className="px-4 py-2 rounded-lg bg-accent text-primary text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={16} />
          Simpan Data Diri
        </button>
      </form>

      <form onSubmit={handleHalaqahSubmit} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <h2 className="text-base font-semibold text-primary">Halaqah Saya</h2>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Nama halaqah"
          value={halaqahForm.name}
          onChange={(e) => setHalaqahForm({ ...halaqahForm, name: e.target.value })}
          required
        />
        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Deskripsi halaqah"
          value={halaqahForm.description}
          onChange={(e) => setHalaqahForm({ ...halaqahForm, description: e.target.value })}
          rows={3}
        />
        <button
          type="submit"
          disabled={!halaqah || isSubmitting}
          className="px-4 py-2 rounded-lg bg-accent text-primary text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={16} />
          Simpan Halaqah
        </button>
      </form>

      <form onSubmit={handleAddStudent} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <h2 className="text-base font-semibold text-primary">Tambah Santri ke Halaqah</h2>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Nama santri"
          value={studentForm.fullName}
          onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="NIS (opsional)"
            value={studentForm.nis}
            onChange={(e) => setStudentForm({ ...studentForm, nis: e.target.value })}
          />
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={studentForm.gender}
            onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value as 'MALE' | 'FEMALE' })}
          >
            <option value="MALE">Laki-laki</option>
            <option value="FEMALE">Perempuan</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={studentForm.jenjang}
            onChange={(e) => setStudentForm({ ...studentForm, jenjang: e.target.value, level: '' })}
          >
            <option value="">Pilih Jenjang</option>
            {jenjangOptions.map((jenjang) => (
              <option key={jenjang} value={jenjang}>{jenjang}</option>
            ))}
          </select>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={studentForm.level}
            onChange={(e) => setStudentForm({ ...studentForm, level: e.target.value })}
            disabled={!studentForm.jenjang}
          >
            <option value="">{studentForm.jenjang ? 'Pilih Level' : 'Pilih Jenjang dahulu'}</option>
            {kelasOptions.map((kelas) => (
              <option key={kelas} value={kelas}>{kelas}</option>
            ))}
          </select>
        </div>
        <input
          type="file"
          accept="image/*"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setStudentPhoto(file);
            if (file) {
              setStudentPhotoPreview(URL.createObjectURL(file));
            }
          }}
        />
        {studentPhotoPreview && (
          <img src={studentPhotoPreview} alt="Preview santri" className="h-16 w-16 rounded-full object-cover border" />
        )}
        <button
          type="submit"
          disabled={!halaqah || isSubmitting}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Plus size={16} />
          Tambah Santri
        </button>
      </form>

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
        <h2 className="text-base font-semibold text-primary">Santri di Halaqah</h2>
        {students.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada santri.</p>
        ) : (
          <ul className="space-y-2">
            {students.map((student) => (
              <li key={student.id} className="text-sm text-gray-700 border rounded-lg px-3 py-2">
                {student.fullName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;