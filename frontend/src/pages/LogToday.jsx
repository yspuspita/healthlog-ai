import { useState } from 'react';
import { saveLogs } from '../api/client';
import { Save } from 'lucide-react';

const MOOD_OPTIONS = [
  { value: 2, emoji: '😢', label: 'Sedih', color: 'mood-sad' },
  { value: 4, emoji: '😕', label: 'Kurang Baik', color: 'mood-low' },
  { value: 6, emoji: '😐', label: 'Biasa Saja', color: 'mood-neutral' },
  { value: 8, emoji: '🙂', label: 'Baik', color: 'mood-good' },
  { value: 10, emoji: '😄', label: 'Sangat Baik', color: 'mood-great' },
];

export default function LogToday() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: 6,
    energy: 5,
    stress_level: 5,
    sleep_hours: 7,
    sleep_quality: 5,
    water_ml: 2000,
    exercise_type: '',
    exercise_mins: 0,
    diet_notes: '',
    medications: '',
    symptoms: '',
    symptom_severity: 1,
    weight_kg: '',
    height_cm: '',
    heart_rate: '',
    notes: ''
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['sleep_hours', 'water_ml', 'weight_kg', 'height_cm'].includes(name)
        ? (value === '' ? '' : parseFloat(value))
        : ['energy', 'stress_level', 'sleep_quality', 'exercise_mins', 'symptom_severity', 'heart_rate'].includes(name)
          ? (value === '' ? '' : parseInt(value))
          : value
    }));
  };

  const handleMoodSelect = (value) => {
    setFormData(prev => ({ ...prev, mood: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    // Clean up empty string fields to null for backend
    const payload = { ...formData };
    for (const key of ['weight_kg', 'height_cm', 'heart_rate', 'exercise_mins']) {
      if (payload[key] === '' || payload[key] === 0) payload[key] = null;
    }
    for (const key of ['exercise_type', 'diet_notes', 'medications', 'symptoms', 'notes']) {
      if (payload[key] === '') payload[key] = null;
    }

    try {
      await saveLogs(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving log:', error);
      alert('Gagal menyimpan data. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-text-primary mb-2">
          📝 Catat Kesehatanmu
        </h1>
        <p className="text-text-secondary">Isi data kesehatanmu hari ini</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date */}
        <div className="bg-white border border-[#F5CBCB] rounded-card p-6 shadow-card">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            📅 Tanggal
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full bg-white border-[1.5px] border-[#F5CBCB] rounded-input px-4 py-3 text-text-secondary focus:border-accent focus:shadow-input focus:outline-none transition-all"
            required
          />
        </div>

        {/* Mood Emoji Picker */}
        <div className="bg-white border border-[#F5CBCB] rounded-card p-6 shadow-card">
          <label className="block text-sm font-medium text-text-secondary mb-4">
            😊 Suasana Hati
          </label>
          <div className="grid grid-cols-5 gap-3">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() => handleMoodSelect(mood.value)}
                className={`mood-card ${mood.color} ${formData.mood === mood.value ? 'selected' : ''}`}
              >
                <span className="text-3xl mb-1">{mood.emoji}</span>
                <span className="text-xs font-medium">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Energy & Stress */}
        <div className="bg-white border border-[#F5CBCB] rounded-card p-6 shadow-card space-y-6">
          <EmojiSliderField
            label="⚡ Energi"
            name="energy"
            value={formData.energy}
            onChange={handleChange}
            emojiLow="😴"
            emojiHigh="⚡"
            labelLow="Lesu"
            labelHigh="Energik"
          />
          <EmojiSliderField
            label="😰 Tingkat Stres"
            name="stress_level"
            value={formData.stress_level}
            onChange={handleChange}
            emojiLow="😌"
            emojiHigh="🤯"
            labelLow="Tenang"
            labelHigh="Stres"
          />
        </div>

        {/* Sleep */}
        <div className="bg-white border border-[#F5CBCB] rounded-card p-6 shadow-card space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              😴 Jam Tidur
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              name="sleep_hours"
              value={formData.sleep_hours}
              onChange={handleChange}
              className="w-full bg-white border-[1.5px] border-[#F5CBCB] rounded-input px-4 py-3 text-text-secondary focus:border-accent focus:shadow-input focus:outline-none"
            />
          </div>
          <EmojiSliderField
            label="💤 Kualitas Tidur"
            name="sleep_quality"
            value={formData.sleep_quality}
            onChange={handleChange}
            emojiLow="😫"
            emojiHigh="😴"
            labelLow="Buruk"
            labelHigh="Nyenyak"
          />
        </div>

        {/* Exercise */}
        <div className="bg-white border border-[#F5CBCB] rounded-card p-6 shadow-card space-y-4">
          <label className="block text-sm font-medium text-text-secondary">
            🏃 Aktivitas Fisik
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-muted mb-1">Jenis Olahraga</label>
              <input
                type="text"
                name="exercise_type"
                value={formData.exercise_type}
                onChange={handleChange}
                placeholder="Lari, Yoga, Gym..."
                className="w-full bg-white border-[1.5px] border-[#F5CBCB] rounded-input px-4 py-3 text-text-secondary focus:border-accent focus:shadow-input focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Durasi (menit)</label>
              <input
                type="number"
                name="exercise_mins"
                min="0"
                value={formData.exercise_mins}
                onChange={handleChange}
                placeholder="30"
                className="w-full bg-white border-[1.5px] border-[#F5CBCB] rounded-input px-4 py-3 text-text-secondary focus:border-accent focus:shadow-input focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Diet Notes */}
        <div className="bg-white border border-[#F5CBCB] rounded-card p-6 shadow-card">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            🍽️ Catatan Makanan
          </label>
          <textarea
            name="diet_notes"
            value={formData.diet_notes}
            onChange={handleChange}
            rows="3"
            className="w-full bg-white border-[1.5px] border-[#F5CBCB] rounded-input px-4 py-3 text-text-secondary focus:border-accent focus:shadow-input focus:outline-none resize-none"
            placeholder="Sarapan: nasi goreng, Makan siang: salad ayam..."
          />
        </div>

        {/* Medications */}
        <div className="bg-white border border-[#F5CBCB] rounded-card p-6 shadow-card">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            💊 Obat / Suplemen
          </label>
          <textarea
            name="medications"
            value={formData.medications}
            onChange={handleChange}
            rows="2"
            className="w-full bg-white border-[1.5px] border-[#F5CBCB] rounded-input px-4 py-3 text-text-secondary focus:border-accent focus:shadow-input focus:outline-none resize-none"
            placeholder="Vitamin C, Paracetamol 500mg..."
          />
        </div>

        {/* Hydration */}
        <div className="bg-white border border-[#F5CBCB] rounded-card p-6 shadow-card">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            💧 Hidrasi (ml)
          </label>
          <input
            type="number"
            step="100"
            min="0"
            name="water_ml"
            value={formData.water_ml}
            onChange={handleChange}
            className="w-full bg-white border-[1.5px] border-[#F5CBCB] rounded-input px-4 py-3 text-text-secondary focus:border-accent focus:shadow-input focus:outline-none"
          />
        </div>

        {/* Weight, Height, Heart Rate */}
        <div className="bg-white border border-[#F5CBCB] rounded-card p-6 shadow-card space-y-4">
          <label className="block text-sm font-medium text-text-secondary">
            ⚖️ Fisik & Vital
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-text-muted mb-1">Berat Badan (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleChange}
                placeholder="65.5"
                className="w-full bg-white border-[1.5px] border-[#F5CBCB] rounded-input px-4 py-3 text-text-secondary focus:border-accent focus:shadow-input focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Tinggi Badan (cm)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="height_cm"
                value={formData.height_cm}
                onChange={handleChange}
                placeholder="170"
                className="w-full bg-white border-[1.5px] border-[#F5CBCB] rounded-input px-4 py-3 text-text-secondary focus:border-accent focus:shadow-input focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">❤️ Detak Jantung (BPM)</label>
              <input
                type="number"
                min="0"
                max="300"
                name="heart_rate"
                value={formData.heart_rate}
                onChange={handleChange}
                placeholder="72"
                className="w-full bg-white border-[1.5px] border-[#F5CBCB] rounded-input px-4 py-3 text-text-secondary focus:border-accent focus:shadow-input focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div className="bg-white border border-[#F5CBCB] rounded-card p-6 shadow-card space-y-4">
          <label className="block text-sm font-medium text-text-secondary">
            🤒 Gejala
          </label>
          <input
            type="text"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Sakit kepala, pegal-pegal, batuk..."
            className="w-full bg-white border-[1.5px] border-[#F5CBCB] rounded-input px-4 py-3 text-text-secondary focus:border-accent focus:shadow-input focus:outline-none"
          />
          {formData.symptoms && (
            <EmojiSliderField
              label="📊 Tingkat Keparahan"
              name="symptom_severity"
              value={formData.symptom_severity}
              onChange={handleChange}
              emojiLow="🟢"
              emojiHigh="🔴"
              labelLow="Ringan"
              labelHigh="Parah"
            />
          )}
        </div>

        {/* Notes */}
        <div className="bg-white border border-[#F5CBCB] rounded-card p-6 shadow-card">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            📌 Catatan Bebas
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="w-full bg-white border-[1.5px] border-[#F5CBCB] rounded-input px-4 py-3 text-text-secondary focus:border-accent focus:shadow-input focus:outline-none resize-none"
            placeholder="Tuliskan catatan tambahanmu di sini..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-accent hover:bg-accent-dark active:scale-[0.97] text-white font-medium px-6 py-4 rounded-btn shadow-btn transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 flex items-center justify-center gap-2"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {saved ? '✓ Tersimpan!' : 'Simpan Catatan'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function EmojiSliderField({ label, name, value, onChange, emojiLow, emojiHigh, labelLow, labelHigh }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-text-secondary">{label}</label>
        <span className="inline-flex items-center bg-accent-light text-text-secondary text-sm font-medium px-3 py-1 rounded-tag">
          {value}/10
        </span>
      </div>
      <input
        type="range"
        name={name}
        min="1"
        max="10"
        value={value}
        onChange={onChange}
        className="w-full"
      />
      <div className="flex justify-between items-center mt-1 px-1">
        <span className="text-xs text-text-muted">{emojiLow} {labelLow}</span>
        <span className="text-xs text-text-muted">{emojiHigh} {labelHigh}</span>
      </div>
    </div>
  );
}
