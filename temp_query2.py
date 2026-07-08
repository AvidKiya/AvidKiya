import sqlite3
import json

DB_PATH = r'C:\Users\Avid Kiya\.local\share\mimocode\mimocode.db'
conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

# List all projects
print("=== PROJECTS ===")
cur.execute("SELECT id, worktree, name, time_created FROM project ORDER BY time_created DESC;")
for r in cur.fetchall():
    print(f"  {r['id']} | worktree={r['worktree']} | name={r['name']}")

# List recent sessions with project info
print("\n=== RECENT SESSIONS (with project) ===")
cur.execute("""
    SELECT s.id, s.title, s.directory, s.time_created, s.project_id, p.worktree, p.name as project_name
    FROM session s
    LEFT JOIN project p ON s.project_id = p.id
    ORDER BY s.time_created DESC LIMIT 20;
""")
for r in cur.fetchall():
    ts = r['time_created']
    from datetime import datetime
    dt = datetime.fromtimestamp(ts / 1000).strftime('%Y-%m-%d %H:%M') if ts else '?'
    print(f"  {r['id']} | {dt} | proj={r['project_name']} | {r['title'][:80]}")

# Get the project ID for the current working directory
print("\n=== CURRENT PROJECT MATCHING ===")
cur.execute("SELECT id, worktree, name FROM project WHERE worktree LIKE '%avidkiya%' OR worktree LIKE '%kiya-os%';")
for r in cur.fetchall():
    print(f"  {r['id']} | worktree={r['worktree']} | name={r['name']}")

conn.close()
