import sqlite3
import json
import os
from datetime import datetime

DB_PATH = r'C:\Users\Avid Kiya\.local\share\mimocode\mimocode.db'
conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

# Check global session ses_0c7fb9970ffeeFFhDAAMVaSVd6
SID = 'ses_0c7fb9970ffeeFFhDAAMVaSVd6'
print(f"=== GLOBAL SESSION {SID} ===")
cur.execute("""
    SELECT id, title, directory, project_id, time_created FROM session WHERE id = ?
""", (SID,))
row = cur.fetchone()
if row:
    print(f"  title: {row['title']}")
    print(f"  project_id: {row['project_id']}")
    print(f"  directory: {row['directory']}")

# Check its messages - just user text for context
cur.execute("""
    SELECT m.id, m.agent_id, m.time_created,
           json_extract(m.data, '$.role') as role
    FROM message m
    WHERE m.session_id = ?
    ORDER BY m.time_created;
""", (SID,))
messages = cur.fetchall()
print(f"  messages: {len(messages)}")
for m in messages:
    dt = datetime.fromtimestamp(m['time_created'] / 1000).strftime('%H:%M:%S')
    cur.execute("""
        SELECT data FROM part WHERE message_id = ? ORDER BY time_created;
    """, (m['id'],))
    parts = cur.fetchall()
    for p in parts:
        pdata = json.loads(p['data'])
        if pdata.get('type') == 'text':
            text = pdata.get('text', '')[:400]
            print(f"  [{m['role']}] {text[:200]}...")

# Check current session
SID2 = 'ses_0c7fb9924ffesqI6gcq6vwp3Gs'
print(f"\n=== CURRENT SESSION {SID2} ===")
cur.execute("""
    SELECT id, title, directory, project_id, time_created FROM session WHERE id = ?
""", (SID2,))
row = cur.fetchone()
if row:
    print(f"  title: {row['title']}")
    print(f"  project_id: {row['project_id']}")
    print(f"  directory: {row['directory']}")

# Check all checkpoint files
print("\n=== ALL SESSION CHECKPOINT FILES ===")
sess_dir = r'C:\Users\Avid Kiya\.local\share\mimocode\memory\sessions'
for d in os.listdir(sess_dir):
    cp = os.path.join(sess_dir, d, 'checkpoint.md')
    if os.path.exists(cp):
        print(f"  {d}/checkpoint.md EXISTS")
    else:
        notes = os.path.join(sess_dir, d, 'notes.md')
        if os.path.exists(notes):
            print(f"  {d}/ (notes only)")

conn.close()
