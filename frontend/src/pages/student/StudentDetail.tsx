import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  BookOpen, 
  Award, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Clock,
  Map,
  Hash
} from 'lucide-react';
import api from '../../services/api';
import { Student, MemorizationSession, MemorizationExam, SessionType } from '../../types';
import { resolvePhotoUrl } from '../../utils/resolvePhotoUrl';
import { getJuzFromMadinahPage } from '../../utils/quranPage';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'sessions' | 'exams'>('info');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/students/${id}`);
        setStudent(response.data);
      } catch (err) {
        console.error('Failed to fetch student details', err);
        setError('Gagal memuat detail santri.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        {error || 'Santri tidak ditemukan.'}
        <div className="mt-4">
          <Link to="/student" className="text-red-700 font-medium hover:underline flex items-center gap-1">
            <ArrowLeft size={16} /> Kembali ke Daftar Santri
          </Link>
        </div>
      </div>
    );
  }

  const lastZiyadahPage = student.sessions
    ?.filter(s => s.sessionType === SessionType.ZIYADAH)
    ?.sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())[0]?.endPage;

  const juzFromPage = getJuzFromMadinahPage(lastZiyadahPage);

  const renderInfoTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
          <User size={20} className="text-primary" /> Informasi Pribadi
        </h3>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <div className="text-gray-500">Nama Lengkap</div>
          <div className="font-medium">{student.fullName}</div>
          
          <div className="text-gray-500">NIS</div>
          <div className="font-medium">{student.nis || '-'}</div>
          
          <div className="text-gray-500">Jenis Kelamin</div>
          <div className="font-medium">{student.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}</div>
          
          <div className="text-gray-500">Kelas & Jenjang</div>
          <div className="font-medium">
            {student.level && student.className ? `${student.level} - Kelas ${student.className}` : (student.level || student.className || '-')}
          </div>
          
          <div className="text-gray-500">Status</div>
          <div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {student.isActive ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
          <TrendingUp size={20} className="text-primary" /> Ringkasan Progress
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-primary/5 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Capaian Saat Ini</p>
                <p className="text-xl font-bold text-primary">
                  {juzFromPage ? `Juz ${juzFromPage}` : `Juz ${student.currentJuz}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Halaman Terakhir</p>
              <p className="text-lg font-semibold">{lastZiyadahPage || student.lastMemorizedPage || '-'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xs text-blue-600 uppercase font-bold tracking-wider">Total Halaman</p>
              <p className="text-2xl font-bold text-blue-800">{student.totalMemorizedPages}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-600 uppercase font-bold tracking-wider">Total Sesi</p>
                <p className="text-2xl font-bold text-amber-800">{student._count?.sessions || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-amber-600 uppercase font-bold tracking-wider">Database Juz</p>
                <p className="text-sm font-bold text-amber-800">{student.currentJuz}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">Halaqah: </span>
              <span className="text-sm font-semibold">{student.halaqah?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">Muhaffizh: </span>
              <span className="text-sm font-semibold">{student.halaqah?.teacher?.fullName || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSessionsTab = () => (
    <div className="card p-0 overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock size={18} className="text-primary" /> Riwayat Sesi Terakhir
        </h3>
        <span className="text-xs text-gray-500">Menampilkan 10 sesi terbaru</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Tanggal</th>
              <th className="px-6 py-3">Jenis</th>
              <th className="px-6 py-3">Materi</th>
              <th className="px-6 py-3">Skor</th>
              <th className="px-6 py-3">Rekomendasi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {student.sessions && student.sessions.length > 0 ? (
              student.sessions.map((session: MemorizationSession) => (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(session.sessionDate), 'dd MMM yyyy', { locale: localeId })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize">{session.sessionType.replace('_', ' ').toLowerCase()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    Hal. {session.startPage || '-'} - {session.endPage || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {session.score}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-medium">
                    <span className={`px-2 py-0.5 rounded-full ${session.recommendation === 'CONTINUE' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {session.recommendation === 'CONTINUE' ? 'Lanjut' : 'Ulang'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">Belum ada riwayat sesi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderExamsTab = () => (
    <div className="card p-0 overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Award size={18} className="text-primary" /> Riwayat Ujian Terakhir
        </h3>
        <span className="text-xs text-gray-500">Menampilkan 5 ujian terbaru</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Tanggal</th>
              <th className="px-6 py-3">Ujian</th>
              <th className="px-6 py-3">Skor</th>
              <th className="px-6 py-3">Hasil</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {student.exams && student.exams.length > 0 ? (
              student.exams.map((exam: MemorizationExam) => (
                <tr key={exam.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(exam.examDate), 'dd MMM yyyy', { locale: localeId })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {exam.title || exam.examType.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {exam.score}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 font-medium ${exam.resultStatus === 'PASSED' ? 'text-green-600' : 'text-red-600'}`}>
                      {exam.resultStatus === 'PASSED' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {exam.resultStatus === 'PASSED' ? 'Lulus' : 'Gagal'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">Belum ada riwayat ujian.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header & Profil Ringkas */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="relative group">
          {student.photoUrl ? (
            <img 
              src={resolvePhotoUrl(student.photoUrl)} 
              alt={student.fullName} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-5xl font-bold shadow-lg border-4 border-white">
              {student.fullName.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-2">
          <Link to="/student" className="text-sm font-medium text-gray-500 hover:text-primary flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Kembali ke Daftar
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{student.fullName}</h1>
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-1 text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
              <span className="bg-primary/20 text-primary px-2 rounded-full text-xs">
                {student.level && student.className ? `${student.level} - Kelas ${student.className}` : (student.level || student.className || '-')}
              </span>
              <span className="text-gray-400 ml-1">NIS: {student.nis || '-'}</span>
            </span>
            <span className="flex items-center gap-1 text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              <BookOpen size={14} /> {juzFromPage ? `Juz ${juzFromPage}` : `Juz ${student.currentJuz}`}
            </span>
            <span className="flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
              <MapPin size={14} /> {student.halaqah?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'info' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Informasi & Progress
          {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'sessions' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Riwayat Sesi
          {activeTab === 'sessions' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
        </button>
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'exams' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Riwayat Ujian
          {activeTab === 'exams' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'info' && renderInfoTab()}
        {activeTab === 'sessions' && renderSessionsTab()}
        {activeTab === 'exams' && renderExamsTab()}
      </div>
    </div>
  );
};

export default StudentDetail;
