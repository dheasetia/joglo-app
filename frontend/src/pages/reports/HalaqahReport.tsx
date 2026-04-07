import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Halaqah, Student } from '../../types';
import { resolvePhotoUrl } from '../../utils/resolvePhotoUrl';
import { 
  ArrowLeft, 
  Users, 
  User as UserIcon,
  BarChart2, 
  CheckCircle,
  Clock,
  ChevronRight
} from 'lucide-react';

const HalaqahReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [halaqah, setHalaqah] = useState<(Halaqah & { 
    teacher: any,
    students: (Student & { _count: { sessions: number } })[] 
  }) | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHalaqahReport = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reports/halaqah/${id}`);
      setHalaqah(response.data);
    } catch (error) {
      console.error('Failed to fetch halaqah report', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHalaqahReport();
  }, [fetchHalaqahReport]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat laporan halaqah...</div>;
  }

  if (!halaqah) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Halaqah tidak ditemukan.</p>
        <Link to="/reports" className="text-primary mt-4 inline-block hover:underline">
          Kembali ke daftar laporan
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/reports" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Halaqah</h1>
          <p className="text-gray-500">Ringkasan performa dan aktivitas grup {halaqah.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center overflow-hidden border border-gray-50">
            {halaqah.teacher?.user?.photoUrl && resolvePhotoUrl(halaqah.teacher.user.photoUrl) ? (
              <img 
                src={resolvePhotoUrl(halaqah.teacher.user.photoUrl)} 
                alt={halaqah.teacher?.fullName || 'Muhaffizh'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Users size={24} />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Santri</p>
            <p className="text-2xl font-bold text-gray-900">{halaqah.students.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/20 text-primary rounded-lg flex items-center justify-center overflow-hidden">
            {halaqah.teacher?.user?.photoUrl && resolvePhotoUrl(halaqah.teacher.user.photoUrl) ? (
              <img 
                src={resolvePhotoUrl(halaqah.teacher.user.photoUrl)} 
                alt={halaqah.teacher?.fullName || 'Muhaffizh'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon size={24} />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Pengajar</p>
            <p className="text-lg font-bold text-gray-900 truncate max-w-[150px]">
              {halaqah.teacher?.fullName || '-'}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
            <BarChart2 size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Rata-rata Juz</p>
            <p className="text-2xl font-bold text-gray-900">
              {halaqah.students.length > 0 
                ? (halaqah.students.reduce((acc, s) => acc + s.currentJuz, 0) / halaqah.students.length).toFixed(1)
                : '0'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Daftar Santri & Aktivitas</h3>
        </div>
        <div className="overflow-x-auto touch-pan-x">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Nama Santri</th>
                <th className="px-6 py-4">Capaian</th>
                <th className="px-6 py-4 text-center">Total Tasmi'</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {halaqah.students.length > 0 ? (
                halaqah.students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                          {student.photoUrl && resolvePhotoUrl(student.photoUrl) ? (
                            <img 
                              src={resolvePhotoUrl(student.photoUrl)} 
                              alt={student.fullName} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon size={18} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                            {student.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {student.level && student.className ? `${student.level} - Kelas ${student.className}` : (student.level || student.className || '-')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        Juz {student.currentJuz}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-gray-600">
                        <Clock size={14} className="text-gray-400" />
                        <span className="font-medium">{student._count?.sessions || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/reports/student/${student.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Detail Progres
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Belum ada santri di halaqah ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
        <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
          <CheckCircle size={20} />
          Catatan Pengajar
        </h4>
        <p className="text-gray-700 leading-relaxed italic">
          "{halaqah.description || 'Tidak ada deskripsi atau catatan khusus untuk halaqah ini.'}"
        </p>
      </div>
    </div>
  );
};

export default HalaqahReport;
