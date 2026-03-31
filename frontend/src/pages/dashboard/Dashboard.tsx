import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { UserRole } from '../../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  ClipboardCheck,
  TrendingUp,
  Clock
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

const formatDateSafe = (value: unknown, pattern: string, fallback = '-') => {
  if (!value) return fallback;
  const date = new Date(value as string | number | Date);
  if (Number.isNaN(date.getTime())) return fallback;
  return format(date, pattern, { locale: id });
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
              title="Sesi (7 Hari Terakhir)" 
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
              title="Setoran Hari Ini" 
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
                <div key={idx} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{session.student?.fullName}</p>
                    <p className="text-xs text-gray-500">{session.sessionType} - {isAdmin ? session.teacher?.fullName : 'Setoran Baru'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{session.score}</p>
                    <p className="text-[10px] text-gray-400">{formatDateSafe(session.sessionDate ?? session.createdAt, 'HH:mm')}</p>
                  </div>
                </div>
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
                <div key={idx} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{exam.student?.fullName}</p>
                    <p className="text-xs text-gray-500">{exam.examType?.replace('_', ' ') ?? '-'}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold px-2 py-0.5 rounded-full ${exam.resultStatus === 'PASSED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {exam.resultStatus === 'PASSED' ? 'Lulus' : 'Gagal'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">{formatDateSafe(exam.examDate, 'dd/MM/yyyy')}</p>
                  </div>
                </div>
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
