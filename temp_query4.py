import sqlite3
import json
from datetime import datetime

DB_PATH = r'C:\Users\Avid Kiya\.local\share\mimocode\mimocode.db'
conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

# Session ses_0d132cf80ffeC7ufuoPfl0303X - most recent KIYA-Os session (12 msgs)
SID = 'ses_0d132cf80ffeC7ufuoPfl0303X'
print(f"=== SESSION {SID} - Trajectory ===")
cur.execute("""
    SELECT m.id, m.agent_id, m.time_created,
           json_extract(m.data, '$.role') as role
    FROM message m
    WHERE m.session_id = ?
    ORDER BY m.time_created;
""", (SID,))
messages = cur.fetchall()
for m in messages:
    dt = datetime.fromtimestamp(m['time_created'] / 1000).strftime('%H:%M:%S')
    print(f"\n--- msg {m['id']} | {dt} | role={m['role']} | agent={m['agent_id']} ---")
    
    # Get parts for this message
    cur.execute("""
        SELECT id, data FROM part
        WHERE message_id = ?
        ORDER BY time_created;
    """, (m['id'],))
    parts = cur.fetchall()
    for p in parts:
        pdata = json.loads(p['data'])
        ptype = pdata.get('type', '?')
        if ptype == 'text':
            text = pdata.get('text', '')[:500]
            print(f"  [text] {text}")
        elif ptype == 'tool':
            tool = pdata.get('tool', '?')
            state = pdata.get('state', {})
            inp = str(state.get('input', ''))[:200]
            out = str(state.get('output', ''))[:300]
            print(f"  [tool:{tool}] input={inp}")
            print(f"           output={out[:300]}")
        elif ptype == 'step-start':
            print(f"  [step-start]")
        elif ptype == 'step-finish':
            tokens = pdata.get('tokens', 0)
            print(f"  [step-finish] tokens={tokens}")
        else:
            print(f"  [{ptype}] {str(pdata)[:200]}")

conn.close()
