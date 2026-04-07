import React, { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';
import { Halaqah, Student, MemorizationExam, ExamResultStatus } from '../../types';
import { getExamTypeLabel } from '../../utils/examTypeLabel';
import { resolvePhotoUrl } from '../../utils/resolvePhotoUrl';
import { 
  FileText, 
  Search, 
  Users, 
  User as UserIcon,
  ChevronRight,
  BarChart2,
  Calendar,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ReportList: React.FC = () => {
  const [halaqahs, setHalaqahs] = useState<Halaqah[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<MemorizationExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'halaqah' | 'student' | 'exam'>('halaqah');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (activeTab === 'halaqah') {
        const response = await api.get('/halaqahs');
        setHalaqahs(response.data);
      } else if (activeTab === 'student') {
        const response = await api.get('/students');
        setStudents(response.data);
      } else {
        const response = await api.get('/memorization-exams');
        setExams(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch report data', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredHalaqahs = halaqahs.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.teacher?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.halaqah?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExams = exams.filter(e => 
    e.student?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getExamTypeLabel(e.examType).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan & Progres</h1>
          <p className="text-gray-500">Lihat laporan detail halaqah dan perkembangan hafalan santri.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => { setActiveTab('halaqah'); setSearchTerm(''); }}
            className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'halaqah' 
                ? 'text-primary border-b-2 border-primary bg-primary/5' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users size={20} />
            Laporan Halaqah
          </button>
          <button
            onClick={() => { setActiveTab('student'); setSearchTerm(''); }}
            className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'student' 
                ? 'text-primary border-b-2 border-primary bg-primary/5' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <UserIcon size={20} />
            Progres Santri
          </button>
          <button
            onClick={() => { setActiveTab('exam'); setSearchTerm(''); }}
            className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'exam' 
                ? 'text-primary border-b-2 border-primary bg-primary/5' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BookOpen size={20} />
            Hasil Ujian
          </button>
        </div>

        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Cari ${activeTab === 'halaqah' ? 'halaqah atau pengajar' : activeTab === 'student' ? 'nama, jenjang atau kelas' : 'nama santri atau tipe ujian'}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Memuat data...</div>
          ) : activeTab === 'halaqah' ? (
            filteredHalaqahs.length > 0 ? (
              filteredHalaqahs.map((halaqah) => (
                <Link
                  key={halaqah.id}
                  to={`/reports/halaqah/${halaqah.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 flex items-center justify-center bg-gray-50 text-primary">
                      {resolvePhotoUrl(halaqah.teacher?.user?.photoUrl) ? (
                        <img 
                          src={resolvePhotoUrl(halaqah.teacher?.user?.photoUrl)!} 
                          alt={halaqah.teacher?.fullName || 'Muhaffizh'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="p-2 bg-primary/10 w-full h-full flex items-center justify-center">
                          <UserIcon size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {halaqah.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Pengajar: {halaqah.teacher?.fullName || 'Belum ditentukan'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <BarChart2 size={14} />
                        Lihat Statistik
                      </span>
                    </div>
                    <ChevronRight className="text-gray-300 group-hover:text-primary" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">Tidak ada halaqah ditemukan.</div>
            )
          ) : activeTab === 'student' ? (
            filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <Link
                  key={student.id}
                  to={`/reports/student/${student.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    {resolvePhotoUrl(student.photoUrl) ? (
                      <img 
                        src={resolvePhotoUrl(student.photoUrl)!} 
                        alt={student.fullName}
                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-primary">
                        <UserIcon size={24} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {student.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {student.level || '-'} - Kelas {student.className || '-'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Halaqah: {student.halaqah?.name || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end text-sm text-gray-500">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                        Juz {student.currentJuz}
                      </span>
                    </div>
                    <ChevronRight className="text-gray-300 group-hover:text-primary" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">Tidak ada santri ditemukan.</div>
            )
          ) : (
            filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group border-b last:border-0"
                >
                  <div className="flex items-center gap-4">
                    {resolvePhotoUrl(exam.student?.photoUrl) ? (
                      <img 
                        src={resolvePhotoUrl(exam.student?.photoUrl)!} 
                        alt={exam.student?.fullName || 'Santri'}
                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <BookOpen size={24} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {exam.student?.fullName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {exam.student?.level || '-'} - Kelas {exam.student?.className || '-'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {getExamTypeLabel(exam.examType)} • {new Date(exam.examDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-bold text-gray-900">{exam.score}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        exam.resultStatus === ExamResultStatus.PASSED 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {exam.resultStatus === ExamResultStatus.PASSED ? 'Lulus' : 'Gagal'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">Tidak ada data ujian ditemukan.</div>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Laporan Bulanan</h4>
            <p className="text-sm text-gray-500 mt-1">Ringkasan aktivitas seluruh halaqah setiap bulan.</p>
            <button className="mt-3 text-sm font-medium text-primary hover:underline" disabled>
              Segera Hadir
            </button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Statistik Ujian</h4>
            <p className="text-sm text-gray-500 mt-1">Analisis hasil ujian mingguan dan juz'iyyah.</p>
            <button className="mt-3 text-sm font-medium text-primary hover:underline" disabled>
              Segera Hadir
            </button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Cetak Sertifikat</h4>
            <p className="text-sm text-gray-500 mt-1">Generasi sertifikat otomatis untuk capaian juz.</p>
            <button className="mt-3 text-sm font-medium text-primary hover:underline" disabled>
              Segera Hadir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportList;
