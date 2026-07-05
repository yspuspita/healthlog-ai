import { useState, useEffect } from 'react';
import { getLogs, deleteLog } from '../api/client';
import { Calendar, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function History() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await getLogs(90); // Get last 90 days
      setLogs(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Gagal mengambil data riwayat. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (date) => {
    if (confirm(`Apakah Anda yakin ingin menghapus catatan untuk tanggal ${date}?`)) {
      try {
        await deleteLog(date);
        setLogs(logs.filter(log => log.date !== date));
      } catch (err) {
        console.error('Error deleting log:', err);
        alert('Gagal menghapus catatan.');
      }
    }
  };

  const getMoodEmoji = (moodValue) => {
    if (!moodValue) return '➖';
    if (moodValue >= 9) return '😄';
    if (moodValue >= 7) return '🙂';
    if (moodValue >= 5) return '😐';
    if (moodValue >= 3) return '😕';
    return '😢';
  };

  const formatDate = (dateStr) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary mb-2 flex items-center gap-2">
            <Calendar className="w-8 h-8" />
            Riwayat Kesehatan
          </h1>
          <p className="text-text-secondary">Lihat semua catatan harianmu</p>
        </div>
        <Link
          to="/log"
          className="bg-accent hover:bg-accent-dark text-white px-5 py-2.5 rounded-btn shadow-btn transition-all duration-150 font-medium"
        >
          + Catat Hari Ini
        </Link>
      </div>

      {error && (
        <div className="bg-[#FFF0F0] border border-[#FFB3B3] text-[#9B4D4D] px-4 py-3 rounded-card mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {logs.length === 0 && !error ? (
        <div className="bg-white border border-[#F5CBCB] rounded-card p-12 text-center shadow-card">
          <div className="text-5xl mb-4">📓</div>
          <h3 className="text-xl font-medium text-text-primary mb-2">Belum Ada Catatan</h3>
          <p className="text-text-secondary mb-6">
            Mulai catat kondisi kesehatanmu setiap hari untuk melihat riwayatnya di sini.
          </p>
          <Link
            to="/log"
            className="inline-block bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-btn shadow-btn transition-all font-medium"
          >
            Mulai Mencatat
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#F5CBCB] rounded-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-base text-text-secondary text-sm border-b border-[#F5CBCB]">
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Tanggal</th>
                  <th className="px-6 py-4 font-medium">Mood</th>
                  <th className="px-6 py-4 font-medium">Energi</th>
                  <th className="px-6 py-4 font-medium">Stres</th>
                  <th className="px-6 py-4 font-medium">Tidur</th>
                  <th className="px-6 py-4 font-medium">Olahraga</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5CBCB]/50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FBEFEF]/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary">
                        {formatDate(log.date).split(',')[1]}
                      </div>
                      <div className="text-xs text-text-muted">
                        {formatDate(log.date).split(',')[0]}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xl" title={`Mood: ${log.mood}/10`}>
                      {getMoodEmoji(log.mood)}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {log.energy ? `${log.energy}/10` : '-'}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {log.stress_level ? `${log.stress_level}/10` : '-'}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {log.sleep_hours ? `${log.sleep_hours}j` : '-'}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {log.exercise_mins ? `${log.exercise_mins}m` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(log.date)}
                        className="text-text-muted hover:text-danger hover:bg-danger/10 p-2 rounded-lg transition-colors"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}