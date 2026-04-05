import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Plus } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/modals/Modal';
import { useToast } from '../../components/common/toast/ToastProvider';
import { MemorizationSession, Recommendation, SessionNoteType } from '../../types';
import { formatPageRangeWithJuz, getJuzFromMadinahPage } from '../../utils/quranPage';

const SessionDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<MemorizationSession | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    score: 80,
    recommendation: Recommendation.CONTINUE as Recommendation,
  });
  const [noteForm, setNoteForm] = useState({
    page: 1,
    noteType: SessionNoteType.KESALAHAN,
    line: 1,
    description: '',
  });

  const fetchSession = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await api.get(`/memorization-sessions/${id}`);
      setSession(response.data);
      setSessionForm({
        score: response.data.score,
        recommendation: response.data.recommendation,
      });
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : (message || "Gagal memuat detail Tasmi'."));
      navigate('/session');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, toast]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const noteSummary = useMemo(() => {
    return session?.noteSummary || {
      KESALAHAN: 0,
      TEGURAN: 0,
      PERHATIAN: 0,
    };
  }, [session]);

  const openNoteModal = () => {
    if (!session) return;
    setNoteForm({
      page: session.startPage || 1,
      noteType: SessionNoteType.KESALAHAN,
      line: 1,
      description: '',
    });
    setIsNoteModalOpen(true);
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsSubmitting(true);
      const response = await api.post(`/memorization-sessions/${id}/notes`, noteForm);
      setSession(response.data);
      setIsNoteModalOpen(false);
      toast.success("Catatan Tasmi' berhasil ditambahkan.");
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : (message || "Gagal menyimpan catatan Tasmi'."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSession = async () => {
    if (!id) return;

    try {
      setIsSavingSession(true);
      const response = await api.patch(`/memorization-sessions/${id}`, {
        score: Number(sessionForm.score),
        recommendation: sessionForm.recommendation,
      });
      setSession(response.data);
      setSessionForm({
        score: response.data.score,
        recommendation: response.data.recommendation,
      });
      toast.success('Nilai dan rekomendasi berhasil disimpan.');
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : (message || "Gagal menyimpan perubahan Tasmi'."));
    } finally {
      setIsSavingSession(false);
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
    return <div className="text-sm text-gray-500">Memuat detail Tasmi'...</div>;
  }

  if (!session) {
    return <div className="text-sm text-gray-500">Detail Tasmi' tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/session')}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Kembali ke daftar Tasmi'
        </button>
        <button onClick={openNoteModal} className="btn btn-primary gap-2">
          <Plus size={16} />
          Catatan
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4">
        <h1 className="text-xl font-bold text-gray-900">Detail Tasmi'</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="text-gray-500">Tanggal:</span> <span className="font-semibold">{format(new Date(session.sessionDate), 'dd MMMM yyyy')}</span></div>
          <div><span className="text-gray-500">Santri:</span> <span className="font-semibold">{session.student?.fullName || '-'}</span></div>
          <div><span className="text-gray-500">Muhaffizh:</span> <span className="font-semibold">{session.teacher?.fullName || '-'}</span></div>
          <div><span className="text-gray-500">Materi:</span> <span className="font-semibold">{formatPageRangeWithJuz(session.startPage, session.endPage)}</span></div>
          <div>
            <label className="block text-gray-500 mb-1">Nilai:</label>
            <input
              type="number"
              min={0}
              max={100}
              value={sessionForm.score}
              onChange={(e) => setSessionForm((prev) => ({ ...prev, score: Number(e.target.value) }))}
              className="w-full md:max-w-[220px] px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Rekomendasi:</label>
            <select
              value={sessionForm.recommendation}
              onChange={(e) => setSessionForm((prev) => ({ ...prev, recommendation: e.target.value as Recommendation }))}
              className="w-full md:max-w-[220px] px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm font-semibold"
            >
              <option value={Recommendation.CONTINUE}>Lanjut</option>
              <option value={Recommendation.REPEAT}>Ulang</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button onClick={handleSaveSession} disabled={isSavingSession} className="btn btn-primary text-sm">
            {isSavingSession ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Ringkasan Catatan Tasmi'</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm">Kesalahan: <span className="font-bold">{noteSummary.KESALAHAN}</span></div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm">Teguran: <span className="font-bold">{noteSummary.TEGURAN}</span></div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm">Perhatian: <span className="font-bold">{noteSummary.PERHATIAN}</span></div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Item Catatan Tasmi'</h2>
        {(session.noteItems || []).length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-500">
            Belum ada item catatan pada Tasmi' ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {session.noteItems?.map((item) => (
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

      <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title="Tambah Catatan Tasmi'">
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
              <option value={SessionNoteType.PERHATIAN}>Perhatian</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Baris</label>
            <input
              type="number"
              required
              min={1}
              max={15}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              value={noteForm.line}
              onChange={(e) => setNoteForm({ ...noteForm, line: Number(e.target.value) })}
            />
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
              Cancel
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

export default SessionDetail;