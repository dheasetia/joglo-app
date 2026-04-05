import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Student, MemorizationSession, MemorizationExam } from '../../types';
import { getExamTypeLabel } from '../../utils/examTypeLabel';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  BookOpen, 
  Award, 
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';

const StudentReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<(Student & { sessions: MemorizationSession[], exams: MemorizationExam[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStudentReport = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reports/student/${id}`);
      setStudent(response.data);
    } catch (error) {
      console.error('Failed to fetch student report', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudentReport();
  }, [fetchStudentReport]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat data laporan santri...</div>;
  }

  if (!student) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Santri tidak ditemukan.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Detail Progres Santri</h1>
          <p className="text-gray-500">Laporan perkembangan hafalan {student.fullName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center text-primary">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{student.fullName}</h2>
              <p className="text-gray-500 text-sm">NIS: {student.nis || '-'}</p>
            </div>
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              Juz {student.currentJuz}
            </span>
          </div>
          
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Halaqah</span>
              <span className="font-medium text-gray-900">{student.halaqah?.name || '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pengajar</span>
              <span className="font-medium text-gray-900">{student.halaqah?.teacher?.fullName || '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Hafalan</span>
              <span className="font-medium text-gray-900">{student.totalMemorizedPages} Halaman</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Halaman Terakhir</span>
              <span className="font-medium text-gray-900">{student.lastMemorizedPage || '-'}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 text-blue-600 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-semibold">Performa Hafalan</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Target 30 Juz</span>
                  <span className="font-medium">{(student.currentJuz / 30 * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(student.currentJuz / 30 * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Tasmi' Terdaftar</p>
                  <p className="text-xl font-bold text-gray-900">{student.sessions.length}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Ujian Lulus</p>
                  <p className="text-xl font-bold text-gray-900">
                    {student.exams.filter(e => e.resultStatus === 'PASSED').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Award size={20} />
              </div>
              <h3 className="font-semibold">Capaian Terakhir</h3>
            </div>
            <div className="space-y-3">
              {student.exams.length > 0 ? (
                student.exams.slice(0, 3).map(exam => (
                  <div key={exam.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {exam.resultStatus === 'PASSED' ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <XCircle size={16} className="text-red-500" />
                      )}
                      <span className="font-medium truncate max-w-[120px]">{getExamTypeLabel(exam.examType)}</span>
                    </div>
                    <span className="font-bold">{exam.score}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic text-center py-4">Belum ada data ujian</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              <h3 className="font-bold text-gray-900">10 Tasmi' Terakhir</h3>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {student.sessions.length > 0 ? (
              student.sessions.map((session) => (
                <div key={session.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      session.recommendation === 'CONTINUE' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{session.sessionType}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.sessionDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold block">Skor: {session.score}</span>
                    <span className={`text-[10px] uppercase font-bold ${
                      session.recommendation === 'CONTINUE' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {session.recommendation === 'CONTINUE' ? 'Lanjut' : 'Ulang'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">Belum ada catatan Tasmi'</div>
            )}
          </div>
        </div>

        {/* History of Exams */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              <h3 className="font-bold text-gray-900">Riwayat Ujian</h3>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {student.exams.length > 0 ? (
              student.exams.map((exam) => (
                <div key={exam.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{getExamTypeLabel(exam.examType)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(exam.examDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-bold block">Skor: {exam.score}</span>
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        exam.resultStatus === 'PASSED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {exam.resultStatus === 'PASSED' ? 'Lulus' : 'Gagal'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">Belum ada riwayat ujian</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReport;
