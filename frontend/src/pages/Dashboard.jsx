import { useState, useEffect } from 'react';
import { getStats, getQuickInsight, getLogs } from '../api/client';
import { Smile, Zap, Moon, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [insight, setInsight] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, insightRes, logsRes] = await Promise.all([
        getStats(7),
        getQuickInsight(),
        getLogs(7) // Ambil data 7 hari terakhir untuk grafik
      ]);
      setStats(statsRes.data);
      setInsight(insightRes.data.insight);

      // Balik urutan log dari terlama -> terbaru untuk grafik
      const reversedLogs = [...logsRes.data].reverse().map(log => ({
        ...log,
        // Ambil 'DD/MM' dari 'YYYY-MM-DD'
        day: log.date.substring(5).replace('-', '/')
      }));
      setLogs(reversedLogs);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-text-primary mb-2">
          Selamat datang! 🌸
        </h1>
        <p className="text-text-secondary">
          {new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Smile className="w-5 h-5 text-accent-dark" />}
          label="Mood"
          value={stats?.avg_mood || '-'}
          subtitle="rata-rata 7 hari"
        />
        <StatCard
          icon={<Zap className="w-5 h-5 text-accent-dark" />}
          label="Energi"
          value={stats?.avg_energy || '-'}
          subtitle="rata-rata 7 hari"
        />
        <StatCard
          icon={<Moon className="w-5 h-5 text-accent-dark" />}
          label="Tidur"
          value={stats?.avg_sleep ? `${stats.avg_sleep}h` : '-'}
          subtitle="rata-rata 7 hari"
        />
        <StatCard
          icon={<Activity className="w-5 h-5 text-accent-dark" />}
          label="Stres"
          value={stats?.avg_stress || '-'}
          subtitle="rata-rata 7 hari"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="bg-white border border-[#F5CBCB] rounded-card p-6 shadow-card lg:col-span-2">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            📈 Tren 7 Hari Terakhir
          </h2>
          {logs.length > 1 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={logs} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FBEFEF" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9B8FA0', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9B8FA0', fontSize: 12}} domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(197, 179, 211, 0.4)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                  <Line type="monotone" name="Mood" dataKey="mood" stroke="#C5B3D3" strokeWidth={3} dot={{r: 4, fill: '#C5B3D3'}} activeDot={{r: 6}} />
                  <Line type="monotone" name="Energi" dataKey="energy" stroke="#FFB74D" strokeWidth={3} dot={{r: 4, fill: '#FFB74D'}} activeDot={{r: 6}} />
                  <Line type="monotone" name="Stres" dataKey="stress_level" stroke="#E57373" strokeWidth={3} dot={{r: 4, fill: '#E57373'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-text-muted text-center">
              <p>Belum cukup data untuk membuat grafik tren.</p>
              <p className="text-sm mt-1">Isi catatan hari ini dan besok ya!</p>
            </div>
          )}
        </div>

        {/* AI Insight Card */}
        <div className="bg-white border border-[#F5CBCB] rounded-card p-6 shadow-card lg:col-span-1 flex flex-col">
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            💡 AI Quick Insight
          </h2>
          <div className="flex-1 overflow-y-auto">
            {insight ? (
              <p className="text-text-secondary leading-relaxed">{insight}</p>
            ) : (
              <p className="text-text-muted italic">Menganalisis data kesehatanmu...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtitle }) {
  return (
    <div className="bg-white border border-[#F5CBCB] rounded-card p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-muted font-medium uppercase tracking-wide">
          {label}
        </span>
        <div className="w-9 h-9 rounded-full bg-accent-light flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-4xl font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-muted mt-1">{subtitle}</p>
    </div>
  );
}
