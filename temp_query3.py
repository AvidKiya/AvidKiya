import sqlite3
import json
from datetime import datetime

DB_PATH = r'C:\Users\Avid Kiya\.local\share\mimocode\mimocode.db'
conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

PROJECT_ID = '95496672-070a-455c-a6cf-e183e58345ee'

# Sessions for current project
print("=== SESSIONS FOR KIYA-Os PROJECT ===")
cur.execute("""
    SELECT id, title, directory, time_created, time_updated, project_id
    FROM session
    WHERE project_id = ?
    ORDER BY time_created DESC;
""", (PROJECT_ID,))
for r in cur.fetchall():
    dt = datetime.fromtimestamp(r['time_created'] / 1000).strftime('%Y-%m-%d %H:%M')
    print(f"  {r['id']} | {dt} | {r['title'][:80]}")

# Recent sessions across all projects (last 7 days)
print("\n=== ALL SESSIONS (last 7 days) ===")
seven_days_ago = int((datetime.now().timestamp() - 7*86400) * 1000)
cur.execute("""
    SELECT id, title, directory, time_created, project_id
    FROM session
    WHERE time_created > ?
    ORDER BY time_created DESC;
""", (seven_days_ago,))
for r in cur.fetchall():
    dt = datetime.fromtimestamp(r['time_created'] / 1000).strftime('%Y-%m-%d %H:%M')
    print(f"  {r['id']} | {dt} | proj={r['project_id'][:12]}... | {r['title'][:70]}")

# Count messages per session for current project
print("\n=== MESSAGE COUNTS PER PROJECT SESSION ===")
cur.execute("""
    SELECT s.id, s.title, COUNT(m.id) as msg_count
    FROM session s
    LEFT JOIN message m ON m.session_id = s.id
    WHERE s.project_id = ?
    GROUP BY s.id
    ORDER BY s.time_created DESC;
""", (PROJECT_ID,))
for r in cur.fetchall():
    print(f"  {r['id']} | msgs={r['msg_count']} | {r['title'][:70]}")

conn.close()
