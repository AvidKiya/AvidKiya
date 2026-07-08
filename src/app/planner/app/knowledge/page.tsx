'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { EmptyState } from '@/components/ui/states';

interface Note { id: string; title: string; content: string; tags: string[]; createdAt: string; }
interface GraphNode { id: string; label: string; type: 'note'|'tag'|'task'|'goal'; weight: number; }
interface GraphEdge { id: string; source: string; target: string; }
const authHeader = () => ({ Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('kiya_jwt') || '' : ''}` });
const normalizeTags = (tags: unknown): string[] => Array.isArray(tags) ? tags.map(String) : typeof tags === 'string' ? tags.split(',').map(t=>t.trim()).filter(Boolean) : [];

export default function KnowledgePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [graph, setGraph] = useState<{nodes:GraphNode[]; edges:GraphEdge[]}>({nodes:[], edges:[]});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'notes'|'graph'>('notes');

  useEffect(() => { fetchNotes(); fetchGraph(); }, []);

  const fetchGraph = async () => {
    try { const res = await fetch('/api/planner/knowledge/graph', { headers: authHeader() }); const data = await res.json(); if (data.success) setGraph(data.data); } catch {}
  };
  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/planner/notes', { headers: authHeader() });
      const data = await res.json();
      if (data.success) setNotes((data.data || []).map((n:any)=>({...n, tags: normalizeTags(n.tags), content: n.content || ''})));
    } catch {}
  };

  const addNote = async () => {
    if (!newNote.title.trim()) return;
    const tags = newNote.tags.split(',').map((t) => t.trim()).filter(Boolean);
    try {
      const res = await fetch('/api/planner/notes', { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify({ title: newNote.title, content: newNote.content, tags: tags.join(',') }) });
      const data = await res.json();
      if (data.success) setNotes((prev) => [{...data.data, tags: normalizeTags(data.data.tags), content: data.data.content || ''}, ...prev]);
    } catch {}
    setNewNote({ title: '', content: '', tags: '' }); setShowAddForm(false); fetchGraph();
  };

  const updateNote = async () => {
    if (!editingNote || !editingNote.title.trim()) return;
    try { await fetch('/api/planner/notes', { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify({ id: editingNote.id, title: editingNote.title, content: editingNote.content, tags: editingNote.tags.join(',') }) }); } catch {}
    setNotes((prev) => prev.map((n) => (n.id === editingNote.id ? editingNote : n))); setEditingNote(null); fetchGraph();
  };

  const deleteNote = async (id: string) => { try { await fetch(`/api/planner/notes?id=${id}`, { method: 'DELETE', headers: authHeader() }); } catch {} setNotes((prev) => prev.filter((n) => n.id !== id)); fetchGraph(); };
  const filteredNotes = notes.filter((n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()) || n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

  return <div className="space-y-6"><div className="flex justify-between items-center gap-3 flex-wrap"><h1 className="text-2xl font-bold">Knowledge</h1><div className="flex gap-2"><button onClick={()=>setView('notes')} className={`glass-btn px-4 py-2 ${view==='notes'?'text-primary':''}`}>Notes</button><button onClick={()=>setView('graph')} className={`glass-btn px-4 py-2 ${view==='graph'?'text-primary':''}`}>Graph</button><button onClick={() => setShowAddForm(true)} className="glass-btn-primary px-4 py-2">+ New note</button></div></div>
    {view==='notes' && <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none" />}
    {(showAddForm || editingNote) && <GlassCard><div className="space-y-4"><input type="text" value={editingNote?.title || newNote.title} onChange={(e) => editingNote ? setEditingNote({ ...editingNote, title: e.target.value }) : setNewNote({ ...newNote, title: e.target.value })} placeholder="Title" className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"/><textarea value={editingNote?.content || newNote.content} onChange={(e) => editingNote ? setEditingNote({ ...editingNote, content: e.target.value }) : setNewNote({ ...newNote, content: e.target.value })} placeholder="Content" rows={6} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none resize-none"/><input type="text" value={editingNote?.tags.join(', ') || newNote.tags} onChange={(e) => editingNote ? setEditingNote({ ...editingNote, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) }) : setNewNote({ ...newNote, tags: e.target.value })} placeholder="Tags, comma separated" className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"/><div className="flex gap-2"><button onClick={editingNote ? updateNote : addNote} className="glass-btn-primary px-4 py-2">{editingNote ? 'Save' : 'Add'}</button><button onClick={() => { setShowAddForm(false); setEditingNote(null); }} className="glass-btn px-4 py-2">Cancel</button></div></div></GlassCard>}
    {view==='graph' ? <KnowledgeGraph graph={graph} /> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{filteredNotes.map(note => <GlassCard key={note.id}><div className="flex justify-between items-start mb-2"><h3 className="font-bold">{note.title}</h3><div className="flex gap-2"><button onClick={() => setEditingNote(note)} className="text-primary text-sm hover:underline">Edit</button><button onClick={() => deleteNote(note.id)} className="text-red-400 text-sm hover:underline">Delete</button></div></div><p className="text-text-2 text-sm mb-3 line-clamp-3">{note.content}</p><div className="flex flex-wrap gap-1">{note.tags.map(tag => <span key={tag} className="text-xs bg-white/10 px-2 py-0.5 rounded">{tag}</span>)}</div><div className="text-xs text-text-3 mt-3">{new Date(note.createdAt).toLocaleDateString('en-US')}</div></GlassCard>)}</div>}
    {view==='notes' && filteredNotes.length === 0 && !showAddForm && <EmptyState icon="note" title="No notes yet" description="Add your first note." action={{ label: '+ Add note', onClick: () => setShowAddForm(true) }} />}
  </div>;
}

function KnowledgeGraph({graph}:{graph:{nodes:GraphNode[]; edges:GraphEdge[]}}) {
  if (!graph.nodes.length) return <EmptyState icon="note" title="No graph data yet" description="Add notes with tags, tasks or goals to build your knowledge graph." />;
  const w=900,h=520,cx=w/2,cy=h/2,r=190;
  const positions = new Map(graph.nodes.map((n,i)=>[n.id,{x:cx+Math.cos((i/graph.nodes.length)*Math.PI*2)*r,y:cy+Math.sin((i/graph.nodes.length)*Math.PI*2)*r}]));
  const color = (t:string)=> t==='tag'?'#34d399':t==='goal'?'#f59e0b':t==='task'?'#60a5fa':'#a78bfa';
  return <GlassCard className="!p-4 overflow-auto"><svg viewBox={`0 0 ${w} ${h}`} className="min-w-[720px] w-full h-[520px]"><g>{graph.edges.map(e=>{const s=positions.get(e.source),t=positions.get(e.target); if(!s||!t) return null; return <line key={e.id} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="rgba(255,255,255,.18)" strokeWidth="1"/>})}</g><g>{graph.nodes.map(n=>{const p=positions.get(n.id)!; return <g key={n.id}><circle cx={p.x} cy={p.y} r={Math.min(28,12+n.weight*2)} fill={color(n.type)} opacity=".85"/><text x={p.x} y={p.y+38} textAnchor="middle" fill="currentColor" className="text-[12px]" style={{fontSize:12}}>{n.label.slice(0,22)}</text></g>})}</g></svg></GlassCard>;
}
