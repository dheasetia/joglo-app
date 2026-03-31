import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { MemorizationSession, Student, SessionType, Recommendation } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  User, 
  CheckCircle2, 
  XCircle,
  Filter,
  Edit2,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Modal from '../../components/common/modals/Modal';
import { useToast } from '../../components/common/toast/ToastProvider';

const SessionList: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const studentIdParam = searchParams.get('student');

  const [sessions, setSessions] = useState<MemorizationSession[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(studentIdParam || '');
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<MemorizationSession | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startPageEditedManuallyRef = useRef(false);
  const [formData, setFormData] = useState({
    sessionDate: format(new Date(), 'yyyy-MM-dd'),
    sessionType: SessionType.ZIYADAH,
    studentId: studentIdParam || '',
    halaqahId: '',
    startPage: undefined as number | undefined,
    endPage: undefined as number | undefined,
    score: 80,
    notes: '',
    recommendation: Recommendation.CONTINUE
  });

  const isEditing = !!selectedSession;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [sessionsRes, studentsRes] = await Promise.all([
        api.get('/memorization-sessions', { params: { studentId: selectedStudent || undefined } }),
        api.get('/students')
      ]);
      setSessions(sessionsRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error('Failed to fetch sessions', error);
    } finally {
      setLoading(false);
    }
  }, [selectedStudent]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!formData.studentId) return;

    const student = students.find(s => s.id === formData.studentId);
    if (student && student.halaqahId !== formData.halaqahId) {
      setFormData(prev => ({ ...prev, halaqahId: student.halaqahId }));
    }
  }, [formData.studentId, formData.halaqahId, students]);

  useEffect(() => {
    if (!isModalOpen || isEditing || startPageEditedManuallyRef.current) return;
    if (!formData.studentId || !formData.sessionType) return;

    const relevantSessions = sessions.filter(
      (session) =>
        session.studentId === formData.studentId &&
        session.sessionType === formData.sessionType &&
        typeof session.endPage === 'number'
    );

    if (!relevantSessions.length) {
      setFormData((prev) => ({ ...prev, startPage: undefined }));
      return;
    }

    const latestSession = relevantSessions.reduce((latest, current) => {
      const latestDate = new Date(latest.sessionDate).getTime();
      const currentDate = new Date(current.sessionDate).getTime();
      return currentDate > latestDate ? current : latest;
    });

    const suggestedStartPage = typeof latestSession.endPage === 'number'
      ? latestSession.endPage + 1
      : undefined;

    setFormData((prev) => ({ ...prev, startPage: suggestedStartPage }));
  }, [isModalOpen, isEditing, formData.studentId, formData.sessionType, sessions]);


  const handleOpenCreateModal = () => {
    setSelectedSession(null);
    startPageEditedManuallyRef.current = false;
    setFormData({
      sessionDate: format(new Date(), 'yyyy-MM-dd'),
      sessionType: SessionType.ZIYADAH,
      studentId: studentIdParam || '',
      halaqahId: '',
      startPage: undefined,
      endPage: undefined,
      score: 80,
      notes: '',
      recommendation: Recommendation.CONTINUE
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (session: MemorizationSession) => {
    setSelectedSession(session);
    startPageEditedManuallyRef.current = true;
    setFormData({
      sessionDate: format(new Date(session.sessionDate), 'yyyy-MM-dd'),
      sessionType: session.sessionType,
      studentId: session.studentId,
      halaqahId: session.halaqahId,
      startPage: session.startPage || undefined,
      endPage: session.endPage || undefined,
      score: session.score,
      notes: session.notes || '',
      recommendation: session.recommendation
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (session: MemorizationSession) => {
    setSelectedSession(session);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (formData.startPage && formData.endPage && Number(formData.startPage) > Number(formData.endPage)) {
      alert('Halaman mulai tidak boleh lebih besar dari halaman selesai.');
      return;
    }

    try {
      setIsSubmitting(true);
      const selectedStudentData = students.find(s => s.id === formData.studentId);
      const resolvedHalaqahId = selectedStudentData?.halaqahId || formData.halaqahId;

      if (!resolvedHalaqahId) {
        alert('Halaqah santri belum tersedia. Silakan pilih santri yang valid.');
        return;
      }

      const data = {
        ...formData,
        halaqahId: resolvedHalaqahId,
        startPage: formData.startPage ? Number(formData.startPage) : undefined,
        endPage: formData.endPage ? Number(formData.endPage) : undefined,
        score: Number(formData.score)
      };

      if (isEditing) {
        await api.patch(`/memorization-sessions/${selectedSession.id}`, data);
      } else {
        await api.post('/memorization-sessions', data);
      }
      setIsModalOpen(false);
      fetchData();
      toast.success(isEditing ? 'Catatan setoran berhasil diperbarui.' : 'Catatan setoran berhasil ditambahkan.');
    } catch (error) {
      console.error('Operation failed', error);
      const apiMessage = (error as any)?.response?.data?.message;
      const message = Array.isArray(apiMessage) ? apiMessage.join(', ') : apiMessage;
      alert(message || 'Gagal menyimpan catatan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSession) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/memorization-sessions/${selectedSession.id}`);
      setIsDeleteModalOpen(false);
      fetchData();
      toast.success('Catatan setoran berhasil dihapus.');
    } catch (error) {
      console.error('Delete failed', error);
      alert('Gagal menghapus catatan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSessionTypeBadge = (type: SessionType) => {
    const labels: Record<SessionType, { text: string, color: string }> = {
      [SessionType.TAS_HIH]: { text: 'Tas-hih', color: 'bg-blue-100 text-blue-800' },
      [SessionType.ZIYADAH]: { text: 'Ziyadah', color: 'bg-green-100 text-green-800' },
      [SessionType.MURAJAAH_SHUGHRA]: { text: 'Murajaah Shughra', color: 'bg-purple-100 text-purple-800' },
      [SessionType.MURAJAAH_KUBRO]: { text: 'Murajaah Kubro', color: 'bg-orange-100 text-orange-800' },
    };
    const { text, color } = labels[type] || { text: type, color: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{text}</span>;
  };

  const filteredSessions = sessions.filter(s => {
    const matchesType = filterType ? s.sessionType === filterType : true;
    const matchesDate = filterDate ? format(new Date(s.sessionDate), 'yyyy-MM-dd') === filterDate : true;
    return matchesType && matchesDate;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sesi Hafalan</h1>
          <p className="text-gray-500 text-sm mt-1">Riwayat setoran hafalan santri harian.</p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="btn btn-primary gap-2"
        >
          <Plus size={18} />
          Catat Setoran
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Catatan Setoran' : 'Catat Setoran Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                value={formData.sessionDate}
                onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Sesi</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                value={formData.sessionType}
                onChange={(e) => {
                  if (!isEditing) {
                    startPageEditedManuallyRef.current = false;
                  }
                  setFormData({ ...formData, sessionType: e.target.value as any });
                }}
              >
                <option value={SessionType.ZIYADAH}>Ziyadah (Baru)</option>
                <option value={SessionType.MURAJAAH_SHUGHRA}>Murajaah Shughra</option>
                <option value={SessionType.MURAJAAH_KUBRO}>Murajaah Kubro</option>
                <option value={SessionType.TAS_HIH}>Tas-hih (Bacaan)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Santri</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              value={formData.studentId}
              onChange={(e) => {
                const studentId = e.target.value;
                const selected = students.find(s => s.id === studentId);
                if (!isEditing) {
                  startPageEditedManuallyRef.current = false;
                }
                setFormData({
                  ...formData,
                  studentId,
                  halaqahId: selected?.halaqahId || ''
                });
              }}
            >
              <option value="">Pilih Santri</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.fullName} ({s.halaqah?.name})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hal. Mulai</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                placeholder="Mulai"
                value={formData.startPage || ''}
                onChange={(e) => {
                  startPageEditedManuallyRef.current = true;
                  setFormData({ ...formData, startPage: e.target.value ? Number(e.target.value) : undefined });
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hal. Akhir</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                placeholder="Akhir"
                value={formData.endPage || ''}
                onChange={(e) => setFormData({ ...formData, endPage: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nilai (0-100)</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rekomendasi</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                value={formData.recommendation}
                onChange={(e) => setFormData({ ...formData, recommendation: e.target.value as any })}
              >
                <option value={Recommendation.CONTINUE}>Lanjut</option>
                <option value={Recommendation.REPEAT}>Ulang</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
              rows={2}
              placeholder="Catatan perkembangan..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
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
              {isSubmitting ? 'Menyimpan...' : 'Simpan Catatan'}
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
            Apakah Anda yakin ingin menghapus catatan setoran santri <span className="font-bold">{selectedSession?.student?.fullName}</span> pada tanggal {selectedSession && format(new Date(selectedSession.sessionDate), 'dd/MM/yyyy')}? 
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

      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Filter size={18} className="text-gray-400" />
          <select 
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Semua Santri</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.halaqah?.name})</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select 
            className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Semua Tipe Sesi</option>
            <option value={SessionType.ZIYADAH}>Ziyadah</option>
            <option value={SessionType.MURAJAAH_SHUGHRA}>Murajaah Shughra</option>
            <option value={SessionType.MURAJAAH_KUBRO}>Murajaah Kubro</option>
            <option value={SessionType.TAS_HIH}>Tas-hih</option>
          </select>
          <input 
            type="date"
            className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white rounded-lg animate-pulse border border-gray-200"></div>
          ))}
        </div>
      ) : filteredSessions.length > 0 ? (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <div key={session.id} className="card hover:shadow-md transition-shadow p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="hidden sm:flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg min-w-[80px]">
                    <span className="text-xs text-gray-500 uppercase font-bold">{format(new Date(session.sessionDate), 'MMM', { locale: id })}</span>
                    <span className="text-xl font-bold text-primary">{format(new Date(session.sessionDate), 'dd')}</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{session.student?.fullName}</h3>
                      {getSessionTypeBadge(session.sessionType)}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {format(new Date(session.sessionDate), 'EEEE, dd MMMM yyyy', { locale: id })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {session.teacher?.fullName}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <div className="flex flex-col sm:items-end">
                      <span className="text-xs text-gray-500">Nilai</span>
                      <span className="text-xl font-black text-primary">{session.score}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      session.recommendation === Recommendation.CONTINUE 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {session.recommendation === Recommendation.CONTINUE ? (
                        <><CheckCircle2 size={14} /> Lanjut</>
                      ) : (
                        <><XCircle size={14} /> Ulang</>
                      )}
                    </div>
                  </div>

                  {(user?.role === 'ADMIN' || user?.id === session.teacher?.userId) && (
                    <div className="flex flex-col gap-1 border-l pl-4 border-gray-100">
                      <button 
                        onClick={() => handleOpenEditModal(session)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleOpenDeleteModal(session)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {(session.startPage || session.endPage || session.notes) && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(session.startPage || session.endPage) && (
                    <div className="text-sm">
                      <span className="text-gray-500 block mb-1">Materi:</span>
                      <div className="p-2 bg-gray-50 rounded border border-gray-100 font-medium">
                         Halaman {session.startPage} s/d {session.endPage} ({session.totalPages} Halaman)
                      </div>
                    </div>
                  )}
                  {session.notes && (
                    <div className="text-sm">
                      <span className="text-gray-500 block mb-1">Catatan Muhaffizh:</span>
                      <div className="p-2 bg-gray-50 rounded border border-gray-100 italic">
                        "{session.notes}"
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card py-12 flex flex-col items-center justify-center text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <BookOpen size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Tidak ada riwayat setoran</h3>
          <p className="text-gray-500 max-w-xs mt-2">
            Belum ada catatan setoran hafalan untuk kriteria yang dipilih.
          </p>
          <button onClick={handleOpenCreateModal} className="mt-6 btn btn-primary gap-2">
            <Plus size={18} />
            Catat Setoran Pertama
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionList;
