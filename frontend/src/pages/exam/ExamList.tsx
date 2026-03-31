import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { ClipboardCheck, Search, Filter, Plus, Calendar, BookOpen, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/modals/Modal';
import { Student, ExamType, ExamResultStatus, MemorizationExam } from '../../types';
import { useToast } from '../../components/common/toast/ToastProvider';

const ExamList: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [exams, setExams] = useState<MemorizationExam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<MemorizationExam | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    examDate: new Date().toISOString().split('T')[0],
    examType: ExamType.WEEKLY,
    studentId: '',
    halaqahId: '',
    startPage: undefined as number | undefined,
    endPage: undefined as number | undefined,
    startJuz: undefined as number | undefined,
    endJuz: undefined as number | undefined,
    score: 80,
    notes: '',
    recommendation: 'CONTINUE',
    resultStatus: ExamResultStatus.PASSED,
  });

  const isEditing = !!selectedExam;

  useEffect(() => {
    fetchExams();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (formData.studentId) {
      const student = students.find(s => s.id === formData.studentId);
      if (student) {
        setFormData(prev => ({ ...prev, halaqahId: student.halaqahId }));
      }
    }
  }, [formData.studentId, students]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await api.get('/memorization-exams');
      setExams(response.data);
    } catch (error) {
      console.error('Failed to fetch exams', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const studentsRes = await api.get('/students');
      setStudents(studentsRes.data);
    } catch (error) {
      console.error('Failed to fetch support data', error);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedExam(null);
    setFormData({
      examDate: new Date().toISOString().split('T')[0],
      examType: ExamType.WEEKLY,
      studentId: '',
      halaqahId: '',
      startPage: undefined,
      endPage: undefined,
      startJuz: undefined,
      endJuz: undefined,
      score: 80,
      notes: '',
      recommendation: 'CONTINUE',
      resultStatus: ExamResultStatus.PASSED,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (exam: MemorizationExam) => {
    setSelectedExam(exam);
    setFormData({
      examDate: new Date(exam.examDate).toISOString().split('T')[0],
      examType: exam.examType,
      studentId: exam.studentId,
      halaqahId: exam.halaqahId,
      startPage: exam.startPage || undefined,
      endPage: exam.endPage || undefined,
      startJuz: exam.startJuz || undefined,
      endJuz: exam.endJuz || undefined,
      score: exam.score,
      notes: exam.notes || '',
      recommendation: exam.recommendation,
      resultStatus: exam.resultStatus,
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (exam: MemorizationExam) => {
    setSelectedExam(exam);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = {
        ...formData,
        startPage: formData.startPage ? Number(formData.startPage) : undefined,
        endPage: formData.endPage ? Number(formData.endPage) : undefined,
        startJuz: formData.startJuz ? Number(formData.startJuz) : undefined,
        endJuz: formData.endJuz ? Number(formData.endJuz) : undefined,
        score: Number(formData.score)
      };

      if (isEditing) {
        await api.patch(`/memorization-exams/${selectedExam.id}`, data);
      } else {
        await api.post('/memorization-exams', data);
      }
      setIsModalOpen(false);
      fetchExams();
      toast.success(isEditing ? 'Hasil ujian berhasil diperbarui.' : 'Hasil ujian berhasil ditambahkan.');
    } catch (error) {
      console.error('Operation failed', error);
      alert('Gagal menyimpan hasil ujian.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedExam) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/memorization-exams/${selectedExam.id}`);
      setIsDeleteModalOpen(false);
      fetchExams();
      toast.success('Data ujian berhasil dihapus.');
    } catch (error) {
      console.error('Delete failed', error);
      alert('Gagal menghapus data ujian.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.student?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exam.title && exam.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      exam.examType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? exam.examType === filterType : true;
    const matchesStatus = filterStatus ? exam.resultStatus === filterStatus : true;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="text-primary" />
            Ujian Hafalan
          </h1>
          <p className="text-gray-500">Daftar riwayat ujian dan evaluasi santri.</p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="btn btn-primary gap-2"
        >
          <Plus size={18} />
          Input Hasil Ujian
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Hasil Ujian' : 'Input Hasil Ujian'}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Ujian</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                value={formData.examType}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value as any })}
              >
                <option value={ExamType.WEEKLY}>Mingguan</option>
                <option value={ExamType.JUZ_IYYAH}>Juz'iyyah</option>
                <option value={ExamType.FIVE_JUZ}>5 Juz</option>
                <option value={ExamType.FINAL_30_JUZ}>30 Juz (Akhir)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Santri</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            >
              <option value="">Pilih Santri</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.fullName} ({s.halaqah?.name})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Juz Mulai</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                placeholder="Misal: 1"
                value={formData.startJuz || ''}
                onChange={(e) => setFormData({ ...formData, startJuz: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Juz Akhir</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                placeholder="Misal: 1"
                value={formData.endJuz || ''}
                onChange={(e) => setFormData({ ...formData, endJuz: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nilai</label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                value={formData.resultStatus}
                onChange={(e) => setFormData({ ...formData, resultStatus: e.target.value as any })}
              >
                <option value={ExamResultStatus.PASSED}>Lulus</option>
                <option value={ExamResultStatus.FAILED}>Mengulang</option>
              </select>
            </div>
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
              {isSubmitting ? 'Menyimpan...' : 'Simpan Hasil'}
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
            Apakah Anda yakin ingin menghapus data ujian santri <span className="font-bold">{selectedExam?.student?.fullName}</span>? 
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

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama santri atau tipe ujian..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select 
              className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Semua Tipe</option>
              <option value={ExamType.WEEKLY}>Mingguan</option>
              <option value={ExamType.JUZ_IYYAH}>Juz'iyyah</option>
              <option value={ExamType.FIVE_JUZ}>5 Juz</option>
              <option value={ExamType.FINAL_30_JUZ}>30 Juz</option>
            </select>
          </div>
          <select 
            className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value={ExamResultStatus.PASSED}>Lulus</option>
            <option value={ExamResultStatus.FAILED}>Mengulang</option>
          </select>
        </div>
      </div>

      <div className="card">

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal & Santri</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe Ujian</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasil</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{exam.student?.fullName}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar size={12} /> {new Date(exam.examDate).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                        {exam.examType?.replace('_', ' ') ?? '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <BookOpen size={14} className="text-gray-400" />
                        {exam.startJuz ? `Juz ${exam.startJuz} - ${exam.endJuz}` : 
                         exam.startPage ? `Hal ${exam.startPage} - ${exam.endPage}` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{exam.score}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        exam.resultStatus === 'PASSED' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {exam.resultStatus === 'PASSED' ? 'Lulus' : 'Mengulang'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {(user?.role === 'ADMIN' || user?.id === exam.teacher?.userId) && (
                          <>
                            <button 
                              onClick={() => handleOpenEditModal(exam)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            {user?.role === 'ADMIN' && (
                              <button 
                                onClick={() => handleOpenDeleteModal(exam)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Hapus"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredExams.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">
                      Tidak ada riwayat ujian yang ditemukan.
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

export default ExamList;
