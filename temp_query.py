import sqlite3
import json

DB_PATH = r'C:\Users\Avid Kiya\.local\share\mimocode\mimocode.db'
conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

# Get schema
print("=== SCHEMA ===")
cur.execute("SELECT name, sql FROM sqlite_master WHERE type='table' ORDER BY name;")
for r in cur.fetchall():
    print(f"TABLE: {r['name']}")
    print(r['sql'])
    print()

# List recent sessions
print("=== RECENT SESSIONS ===")
cur.execute("SELECT id, data FROM session ORDER BY rowid DESC LIMIT 20;")
for r in cur.fetchall():
    data = json.loads(r['data'])
    print(f"  {r['id']} | {data.get('project','?')} | {data.get('title','?')[:60]}")

conn.close()
