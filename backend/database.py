import sqlite3
from typing import List, Dict, Any

DB_PATH = "healthlog.db"

def init_db():
    """Initialize database with required tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create health_logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS health_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL UNIQUE,
            mood INTEGER,
            energy INTEGER,
            sleep_hours REAL,
            sleep_quality INTEGER,
            symptoms TEXT,
            symptom_severity INTEGER,
            medications TEXT,
            exercise_type TEXT,
            exercise_mins INTEGER,
            water_ml INTEGER,
            stress_level INTEGER,
            diet_notes TEXT,
            notes TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )
    ''')

    # Create reports table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            generated_at TEXT DEFAULT (datetime('now')),
            period_start TEXT,
            period_end TEXT,
            report_content TEXT
        )
    ''')

    # Create chat_sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            thread_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        )
    ''')

    # Migrate: add new columns if they don't exist
    existing_cols = {row[1] for row in cursor.execute("PRAGMA table_info(health_logs)").fetchall()}
    migrations = [
        ("weight_kg", "REAL"),
        ("height_cm", "REAL"),
        ("heart_rate", "INTEGER"),
    ]
    for col_name, col_type in migrations:
        if col_name not in existing_cols:
            cursor.execute(f"ALTER TABLE health_logs ADD COLUMN {col_name} {col_type}")
            print(f"  ✓ Added column {col_name}")

    conn.commit()
    conn.close()
    print(f"✓ Database initialized at {DB_PATH}")

def save_log(data: dict) -> bool:
    """Save or update health log entry"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Prepare data with defaults
        log_data = {
            'date': data.get('date'),
            'mood': data.get('mood'),
            'energy': data.get('energy'),
            'sleep_hours': data.get('sleep_hours'),
            'sleep_quality': data.get('sleep_quality'),
            'symptoms': data.get('symptoms'),
            'symptom_severity': data.get('symptom_severity'),
            'medications': data.get('medications'),
            'exercise_type': data.get('exercise_type'),
            'exercise_mins': data.get('exercise_mins'),
            'water_ml': data.get('water_ml'),
            'stress_level': data.get('stress_level'),
            'diet_notes': data.get('diet_notes'),
            'notes': data.get('notes'),
            'weight_kg': data.get('weight_kg'),
            'height_cm': data.get('height_cm'),
            'heart_rate': data.get('heart_rate'),
        }

        # INSERT OR REPLACE for upsert functionality
        cursor.execute('''
            INSERT OR REPLACE INTO health_logs
            (date, mood, energy, sleep_hours, sleep_quality, symptoms, symptom_severity,
             medications, exercise_type, exercise_mins, water_ml, stress_level, diet_notes, notes,
             weight_kg, height_cm, heart_rate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            log_data['date'], log_data['mood'], log_data['energy'],
            log_data['sleep_hours'], log_data['sleep_quality'],
            log_data['symptoms'], log_data['symptom_severity'],
            log_data['medications'], log_data['exercise_type'],
            log_data['exercise_mins'], log_data['water_ml'],
            log_data['stress_level'], log_data['diet_notes'], log_data['notes'],
            log_data['weight_kg'], log_data['height_cm'], log_data['heart_rate']
        ))

        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error saving log: {e}")
        return False

def get_logs(days: int = 30) -> List[Dict[str, Any]]:
    """Get health logs for the last N days"""
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute('''
            SELECT * FROM health_logs
            ORDER BY date DESC
            LIMIT ?
        ''', (days,))

        rows = cursor.fetchall()
        logs = [dict(row) for row in rows]

        conn.close()
        return logs
    except Exception as e:
        print(f"Error fetching logs: {e}")
        return []

def delete_log(date_str: str) -> bool:
    """Delete a health log entry by date"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute('DELETE FROM health_logs WHERE date = ?', (date_str,))

        affected_rows = cursor.rowcount
        conn.commit()
        conn.close()
        return affected_rows > 0
    except Exception as e:
        print(f"Error deleting log: {e}")
        return False

def get_logs_for_ai(days: int = 30) -> str:
    """Format health data as a rich string for AI context"""
    logs = get_logs(days)

    if not logs:
        return "Tidak ada data kesehatan yang tercatat."

    # Format each log entry
    formatted_logs = []
    for log in logs:
        entry = f"\n📅 {log['date']}:"

        if log['mood']:
            entry += f"\n  Mood: {log['mood']}/10"
        if log['energy']:
            entry += f"\n  Energi: {log['energy']}/10"
        if log['stress_level']:
            entry += f"\n  Stres: {log['stress_level']}/10"
        if log['sleep_hours']:
            entry += f"\n  Tidur: {log['sleep_hours']} jam"
            if log['sleep_quality']:
                entry += f" (kualitas: {log['sleep_quality']}/10)"
        if log['water_ml']:
            entry += f"\n  Hidrasi: {log['water_ml']} ml"
        if log['exercise_type']:
            entry += f"\n  Olahraga: {log['exercise_type']}"
            if log['exercise_mins']:
                entry += f" ({log['exercise_mins']} menit)"
        if log['symptoms']:
            entry += f"\n  Gejala: {log['symptoms']}"
            if log['symptom_severity']:
                entry += f" (severity: {log['symptom_severity']}/10)"
        if log['medications']:
            entry += f"\n  Obat/Suplemen: {log['medications']}"
        if log['diet_notes']:
            entry += f"\n  Makanan: {log['diet_notes']}"
        if log.get('weight_kg'):
            entry += f"\n  Berat Badan: {log['weight_kg']} kg"
        if log.get('height_cm'):
            entry += f"\n  Tinggi Badan: {log['height_cm']} cm"
        if log.get('heart_rate'):
            entry += f"\n  Detak Jantung: {log['heart_rate']} BPM"
        if log['notes']:
            entry += f"\n  Catatan: {log['notes']}"

        formatted_logs.append(entry)

    # Calculate averages
    moods = [l['mood'] for l in logs if l['mood']]
    energies = [l['energy'] for l in logs if l['energy']]
    sleep_hours = [l['sleep_hours'] for l in logs if l['sleep_hours']]
    stress_levels = [l['stress_level'] for l in logs if l['stress_level']]

    summary = "\n\n📊 Statistik:"
    if moods:
        summary += f"\n  Rata-rata mood: {sum(moods)/len(moods):.1f}/10"
    if energies:
        summary += f"\n  Rata-rata energi: {sum(energies)/len(energies):.1f}/10"
    if sleep_hours:
        summary += f"\n  Rata-rata tidur: {sum(sleep_hours)/len(sleep_hours):.1f} jam/hari"
    if stress_levels:
        summary += f"\n  Rata-rata stres: {sum(stress_levels)/len(stress_levels):.1f}/10"

    return "".join(formatted_logs) + summary

def get_stats(days: int = 7) -> Dict[str, Any]:
    """Calculate statistics for the last N days"""
    logs = get_logs(days)

    if not logs:
        return {
            'avg_mood': None,
            'avg_energy': None,
            'avg_sleep': None,
            'avg_stress': None,
            'total_exercise_mins': 0,
            'symptom_days': 0,
            'total_days': 0
        }

    moods = [l['mood'] for l in logs if l['mood']]
    energies = [l['energy'] for l in logs if l['energy']]
    sleep_hours = [l['sleep_hours'] for l in logs if l['sleep_hours']]
    stress_levels = [l['stress_level'] for l in logs if l['stress_level']]
    exercise_mins = [l['exercise_mins'] for l in logs if l['exercise_mins']]
    symptom_days = len([l for l in logs if l['symptoms']])

    return {
        'avg_mood': round(sum(moods) / len(moods), 1) if moods else None,
        'avg_energy': round(sum(energies) / len(energies), 1) if energies else None,
        'avg_sleep': round(sum(sleep_hours) / len(sleep_hours), 1) if sleep_hours else None,
        'avg_stress': round(sum(stress_levels) / len(stress_levels), 1) if stress_levels else None,
        'total_exercise_mins': sum(exercise_mins),
        'symptom_days': symptom_days,
        'total_days': len(logs)
    }

def save_report(content: str, period_start: str, period_end: str) -> int:
    """Save a doctor report"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO reports (period_start, period_end, report_content)
            VALUES (?, ?, ?)
        ''', (period_start, period_end, content))

        report_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return report_id
    except Exception as e:
        print(f"Error saving report: {e}")
        return 0

def get_reports(limit: int = 10) -> List[Dict[str, Any]]:
    """Get recent reports"""
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute('''
            SELECT * FROM reports
            ORDER BY generated_at DESC
            LIMIT ?
        ''', (limit,))

        rows = cursor.fetchall()
        reports = [dict(row) for row in rows]

        conn.close()
        return reports
    except Exception as e:
        print(f"Error fetching reports: {e}")
        return []

def save_chat_message(thread_id: str, role: str, content: str):
    """Save a chat message to history"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO chat_sessions (thread_id, role, content)
            VALUES (?, ?, ?)
        ''', (thread_id, role, content))

        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error saving chat message: {e}")

def get_chat_history(thread_id: str, limit: int = 20) -> List[Dict[str, Any]]:
    """Get chat history for a thread"""
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute('''
            SELECT * FROM chat_sessions
            WHERE thread_id = ?
            ORDER BY created_at ASC
            LIMIT ?
        ''', (thread_id, limit))

        rows = cursor.fetchall()
        messages = [dict(row) for row in rows]

        conn.close()
        return messages
    except Exception as e:
        print(f"Error fetching chat history: {e}")
        return []

def clear_chat_history(thread_id: str):
    """Clear chat history for a thread"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute('DELETE FROM chat_sessions WHERE thread_id = ?', (thread_id,))

        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error clearing chat history: {e}")
