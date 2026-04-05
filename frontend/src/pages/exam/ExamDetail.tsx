import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Plus } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/modals/Modal';
import { useToast } from '../../components/common/toast/ToastProvider';
import { MemorizationExam, ExamResultStatus, SessionNoteType, Recommendation, Gender } from '../../types';
import { formatPageRangeWithJuz, getJuzFromMadinahPage } from '../../utils/quranPage';
import { getExamTypeLabel } from '../../utils/examTypeLabel';

const ExamDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<MemorizationExam | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingExam, setIsSavingExam] = useState(false);
  
  const [examForm, setExamForm] = useState({
    score: 80,
    resultStatus: ExamResultStatus.PASSED,
    notes: '',
  });
  
  const [noteForm, setNoteForm] = useState({
    page: 1,
    noteType: SessionNoteType.KESALAHAN,
    line: 1,
    description: '',
  });

  const fetchExam = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await api.get(`/memorization-exams/${id}`);
      setExam(response.data);
      setExamForm({
        score: response.data.score,
        resultStatus: response.data.resultStatus,
        notes: response.data.notes || '',
      });
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : (message || "Gagal memuat detail ujian."));
      navigate('/exam');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, toast]);

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  const noteSummary = useMemo(() => {
    return exam?.noteSummary || {
      KESALAHAN: 0,
      TEGURAN: 0,
      PERHATIAN: 0,
    };
  }, [exam]);

  const openNoteModal = () => {
    if (!exam) return;
    
    // Default page: exam startPage if no notes, otherwise last note page
    let defaultPage = exam.startPage || 1;
    if (exam.noteItems && exam.noteItems.length > 0) {
      const lastNote = exam.noteItems[exam.noteItems.length - 1];
      defaultPage = lastNote.page;
    }

    setNoteForm({
      page: defaultPage,
      noteType: SessionNoteType.KESALAHAN,
      line: 1,
      description: '',
    });
    setIsNoteModalOpen(true);
  };

  const handleCreateNote = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsSubmitting(true);
      const response = await api.post(`/memorization-exams/${id}/notes`, {
        ...noteForm,
        page: Number(noteForm.page),
        line: Number(noteForm.line),
      });
      setExam(response.data);
      setIsNoteModalOpen(false);
      toast.success("Catatan ujian berhasil ditambahkan.");
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : (message || "Gagal menyimpan catatan ujian."));
    } finally {
      setIsSubmitting(false);
    }
  }, [id, noteForm, toast]);

  const handleSaveExam = async () => {
    if (!id) return;

    try {
      setIsSavingExam(true);
      // Backend handles recommendation based on resultStatus or we pass it
      const response = await api.patch(`/memorization-exams/${id}`, {
        score: Number(examForm.score),
        resultStatus: examForm.resultStatus,
        notes: examForm.notes?.trim() || null,
        recommendation: examForm.resultStatus === ExamResultStatus.PASSED ? Recommendation.CONTINUE : Recommendation.REPEAT
      });
      setExam(response.data);
      toast.success('Nilai, status, dan catatan berhasil disimpan.');
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : (message || "Gagal menyimpan perubahan ujian."));
    } finally {
      setIsSavingExam(false);
    }
  };

  const getNoteTypeLabel = (noteType: SessionNoteType) => {
    if (noteType === SessionNoteType.KESALAHAN) return 'Kesalahan';
    if (noteType === SessionNoteType.TEGURAN) return 'Teguran';
    return 'Perhatian';
  };

  const getNoteTypeClass = (noteType: SessionNoteType) => {
    if (noteType === SessionNoteType.KESALAHAN) return 'bg-red-100 text-red-800 border-red-200';
    if (noteType === SessionNoteType.TEGURAN) return 'bg-amber-100 text-amber-900 border-amber-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Memuat detail ujian...</div>;
  }

  if (!exam) {
    return <div className="text-sm text-gray-500">Detail ujian tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/exam')}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Kembali ke daftar ujian
        </button>
        <button onClick={openNoteModal} className="btn btn-primary gap-2">
          <Plus size={16} />
          Tambah Catatan
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4">
        <h1 className="text-xl font-bold text-gray-900">Info Ujian</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="text-gray-500">Tanggal:</span> <span className="font-semibold">{format(new Date(exam.examDate), 'dd MMMM yyyy')}</span></div>
          <div><span className="text-gray-500">Santri:</span> <span className="font-semibold">{exam.student?.fullName || '-'} <span className="text-xs font-normal text-gray-400">({exam.student?.gender === Gender.MALE ? 'L' : 'P'})</span></span></div>
          <div><span className="text-gray-500">Tipe Ujian:</span> <span className="font-semibold">{getExamTypeLabel(exam.examType)}</span></div>
          <div><span className="text-gray-500">Materi:</span> <span className="font-semibold">{formatPageRangeWithJuz(exam.startPage, exam.endPage)}</span></div>
          <div><span className="text-gray-500">Halaqah:</span> <span className="font-semibold">{exam.halaqah?.name || '-'}</span></div>
          <div><span className="text-gray-500">Muhaffizh:</span> <span className="font-semibold">{exam.teacher?.fullName || '-'}</span></div>
          <div className="md:col-span-2 border-t border-gray-100 pt-3 mt-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 mb-1">Nilai:</label>
              <input
                type="number"
                min={0}
                max={100}
                value={examForm.score}
                onChange={(e) => setExamForm((prev) => ({ ...prev, score: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Status Ujian:</label>
              <select
                value={examForm.resultStatus}
                onChange={(e) => setExamForm((prev) => ({ ...prev, resultStatus: e.target.value as ExamResultStatus }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm font-semibold"
              >
                <option value={ExamResultStatus.PASSED}>Lulus</option>
                <option value={ExamResultStatus.FAILED}>Mengulang</option>
              </select>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-500 mb-1">Catatan Umum:</label>
            <textarea
              value={examForm.notes}
              onChange={(e) => setExamForm((prev) => ({ ...prev, notes: e.target.value }))}
              rows={4}
              placeholder="Isi catatan umum untuk ujian ini..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
            />
          </div>
        </div>

        <div className="pt-2">
          <button onClick={handleSaveExam} disabled={isSavingExam} className="btn btn-primary text-sm">
            {isSavingExam ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Ringkasan Evaluasi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm">Total Kesalahan: <span className="font-bold">{noteSummary.KESALAHAN}</span></div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm">Total Teguran: <span className="font-bold">{noteSummary.TEGURAN}</span></div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm">Total Peringatan: <span className="font-bold">{noteSummary.PERHATIAN}</span></div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Catatan Ujian</h2>
        {(exam.noteItems || []).length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-500">
            Belum ada catatan untuk ujian ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exam.noteItems?.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getNoteTypeClass(item.noteType)}`}>
                    {getNoteTypeLabel(item.noteType)}
                  </span>
                  <span className="text-xs text-gray-500">Hal. {item.page} • Baris {item.line} • Juz {getJuzFromMadinahPage(item.page)}</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title="Tambah Catatan Ujian">
        <form onSubmit={handleCreateNote} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Halaman</label>
            <input
              type="number"
              required
              min={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              value={noteForm.page}
              onChange={(e) => setNoteForm({ ...noteForm, page: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Catatan</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              value={noteForm.noteType}
              onChange={(e) => setNoteForm({ ...noteForm, noteType: e.target.value as SessionNoteType })}
            >
              <option value={SessionNoteType.KESALAHAN}>Kesalahan</option>
              <option value={SessionNoteType.TEGURAN}>Teguran</option>
              <option value={SessionNoteType.PERHATIAN}>Peringatan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Baris</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              value={noteForm.line}
              onChange={(e) => setNoteForm({ ...noteForm, line: Number(e.target.value) })}
            >
              {[...Array(15)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
            <textarea
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              value={noteForm.description}
              onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
            />
          </div>
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setIsNoteModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
            >
              Batal
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 btn btn-primary text-sm">
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExamDetail;
