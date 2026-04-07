import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { UserRole } from '../../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { getExamTypeLabel } from '../../utils/examTypeLabel';
import { resolvePhotoUrl } from '../../utils/resolvePhotoUrl';
import { Link } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  ClipboardCheck,
  TrendingUp,
  Clock,
  ChevronRight,
  User as UserIcon
} from 'lucide-react';

interface Stats {
  totalStudents?: number;
  totalTeachers?: number;
  totalHalaqahs?: number;
  recentSessionsCount?: number;
  averageJuz?: number;
  myStudentCount?: number;
  sessionsToday?: number;
  myHalaqahCount?: number;
  recentSessions?: any[];
  upcomingExams?: any[];
}

const formatEnumLabel = (value: string | null | undefined) => {
  if (!value) return '-';
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const formatUstadzName = (name: string | null | undefined) => {
  if (!name || name === '-') return 'Ustadz -';
  return `Ustadz ${name}`;
};

const formatDateSafe = (value: unknown, pattern: string, fallback = '-') => {
  if (!value) return fallback;
  const date = new Date(value as string | number | Date);
  if (Number.isNaN(date.getTime())) return fallback;
  return format(date, pattern, { locale: id });
};

const getSessionTypeBadgeClass = (sessionType: string | null | undefined) => {
  switch (sessionType) {
    case 'TAS_HIH':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    case 'ZIYADAH':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'MURAJAAH_SHUGHRA':
      return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'MURAJAAH_KUBRO':
      return 'bg-purple-100 text-purple-800 border border-purple-200';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

const getExamTypeBadgeClass = (examType: string | null | undefined) => {
  switch (examType) {
    case 'WEEKLY':
      return 'bg-sky-100 text-sky-800 border border-sky-200';
    case 'JUZ_IYYAH':
      return 'bg-violet-100 text-violet-800 border border-violet-200';
    case 'FIVE_JUZ':
      return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'FINAL_30_JUZ':
      return 'bg-rose-100 text-rose-800 border border-rose-200';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-200 rounded-lg w-full"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    </div>;
  }

  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Assalamu'alaikum, {user?.name}</h1>
        <p className="text-gray-500">Selamat datang di Tahmis, Tahfizh Monitoring System Joglo Qur&apos;an</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin ? (
          <>
            <StatCard 
              title="Total Santri" 
              value={stats?.totalStudents || 0} 
              icon={GraduationCap} 
              color="bg-blue-500" 
            />
            <StatCard 
              title="Total Halaqah" 
              value={stats?.totalHalaqahs || 0} 
              icon={Users} 
              color="bg-green-500" 
            />
            <StatCard 
              title="Tasmi' (7 Hari Terakhir)" 
              value={stats?.recentSessionsCount || 0} 
              icon={TrendingUp} 
              color="bg-purple-500" 
            />
            <StatCard 
              title="Rata-rata Juz" 
              value={Number(stats?.averageJuz || 0).toFixed(1)} 
              icon={BookOpen} 
              color="bg-accent text-primary" 
            />
          </>
        ) : (
          <>
            <StatCard 
              title="Santri Saya" 
              value={stats?.myStudentCount || 0} 
              icon={GraduationCap} 
              color="bg-blue-500" 
            />
            <StatCard 
              title="Halaqah Saya" 
              value={stats?.myHalaqahCount || 0} 
              icon={BookOpen} 
              color="bg-purple-500" 
            />
            <StatCard 
              title="Tasmi' Hari Ini" 
              value={stats?.sessionsToday || 0} 
              icon={Clock} 
              color="bg-accent text-primary" 
            />
            <StatCard 
              title="Target Tercapai" 
              value="85%" 
              icon={TrendingUp} 
              color="bg-green-500" 
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="text-primary" size={20} />
            Aktivitas Terkini
          </h2>
          <div className="space-y-4">
            {stats?.recentSessions && stats.recentSessions.length > 0 ? (
              stats.recentSessions.map((session, idx) => (
                <Link key={idx} to={`/session/${session.id}`} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                      {resolvePhotoUrl(session.student?.photoUrl) ? (
                        <img 
                          src={resolvePhotoUrl(session.student?.photoUrl)!} 
                          alt={session.student?.fullName || 'Santri'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon size={18} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{session.student?.fullName}</p>
                      <p className="text-[10px] text-gray-500 font-semibold mb-0.5">
                        {session.student?.level || '-'} - Kelas {session.student?.className || '-'}
                      </p>
                      <p className="text-[10px] text-gray-500 flex items-center gap-1">
                        {formatUstadzName(session.teacher?.fullName)}
                      </p>
                      <p className={`inline-flex mt-1 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full tracking-wide ${getSessionTypeBadgeClass(session.sessionType)}`}>
                        {formatEnumLabel(session.sessionType)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{session.score}</p>
                      <p className="text-[10px] text-gray-400">{formatDateSafe(session.sessionDate ?? session.createdAt, 'HH:mm')}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-8 italic">Belum ada aktivitas terbaru hari ini.</p>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ClipboardCheck className="text-primary" size={20} />
            Riwayat Ujian Terakhir
          </h2>
          <div className="space-y-4">
            {stats?.upcomingExams && stats.upcomingExams.length > 0 ? (
              stats.upcomingExams.map((exam, idx) => (
                <Link key={idx} to={`/exam/${exam.id}`} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                      {resolvePhotoUrl(exam.student?.photoUrl) ? (
                        <img 
                          src={resolvePhotoUrl(exam.student?.photoUrl)!} 
                          alt={exam.student?.fullName || 'Santri'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon size={18} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{exam.student?.fullName}</p>
                      <p className="text-[10px] text-gray-500 font-semibold mb-0.5">
                        {exam.student?.level || '-'} - Kelas {exam.student?.className || '-'}
                      </p>
                      <p className="text-[10px] text-gray-500 flex items-center gap-1">
                        {formatUstadzName(exam.teacher?.fullName)}
                      </p>
                      <p className={`inline-flex mt-1 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full tracking-wide ${getExamTypeBadgeClass(exam.examType)}`}>
                        {getExamTypeLabel(exam.examType)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-xs font-bold px-2 py-0.5 rounded-full ${exam.resultStatus === 'PASSED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {exam.resultStatus === 'PASSED' ? 'Lulus' : 'Gagal'}
                      </p>
                      <p className="text-xs font-semibold text-gray-700 mt-1">Nilai: {exam.score ?? '-'}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{formatDateSafe(exam.examDate, 'dd/MM/yyyy')}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-8 italic">Tidak ada data ujian terbaru.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
  <div className="card flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-xl ${color.includes('text-primary') ? color : `${color} text-white`} shadow-sm`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default Dashboard;
