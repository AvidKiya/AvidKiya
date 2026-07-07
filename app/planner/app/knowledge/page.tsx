'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { EmptyState } from '@/components/ui/states';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

const authHeader = () => ({ Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('kiya_jwt') || '' : ''}` });

export default function KnowledgePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const demo: Note[] = [
      { id: '1', title: 'یادداشت تست', content: 'محتوای تست', tags: ['تست'], createdAt: new Date().toISOString() },
    ];
    try {
      const res = await fetch('/api/planner/notes', { headers: authHeader() });
      if (res.ok) {
        const data = await res.json();
        setNotes(data.data && data.data.length > 0 ? data.data : demo);
      } else {
        setNotes(demo);
      }
    } catch {
      setNotes(demo);
    }
  };

  const addNote = async () => {
    if (!newNote.title.trim()) return;
    const tags = newNote.tags.split(',').map((t) => t.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/planner/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ title: newNote.title, content: newNote.content, tags }),
      });
      if (res.ok) {
        const data = await res.json();
        setNotes((prev) => [data.data, ...prev]);
      } else {
        const note: Note = { id: `note-${Date.now()}`, title: newNote.title, content: newNote.content, tags, createdAt: new Date().toISOString() };
        setNotes((prev) => [note, ...prev]);
      }
    } catch {
      const note: Note = { id: `note-${Date.now()}`, title: newNote.title, content: newNote.content, tags, createdAt: new Date().toISOString() };
      setNotes((prev) => [note, ...prev]);
    }
    setNewNote({ title: '', content: '', tags: '' });
    setShowAddForm(false);
  };

  const updateNote = async () => {
    if (!editingNote || !editingNote.title.trim()) return;

    try {
      await fetch('/api/planner/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ id: editingNote.id, title: editingNote.title, content: editingNote.content, tags: editingNote.tags }),
      });
    } catch {}

    setNotes((prev) =>
      prev.map((n) => (n.id === editingNote.id ? editingNote : n))
    );
    setEditingNote(null);
  };

  const deleteNote = async (id: string) => {
    try {
      await fetch(`/api/planner/notes?id=${id}`, { method: 'DELETE', headers: authHeader() });
    } catch {}
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.includes(searchQuery) ||
      n.content.includes(searchQuery) ||
      n.tags.some((t) => t.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">دانش</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="glass-btn-primary px-4 py-2"
        >
          + یادداشت جدید
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="جستجو..."
        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
      />

      {/* Add/Edit Form */}
      {(showAddForm || editingNote) && (
        <GlassCard>
          <div className="space-y-4">
            <input
              type="text"
              value={editingNote?.title || newNote.title}
              onChange={(e) => {
                if (editingNote) {
                  setEditingNote({ ...editingNote, title: e.target.value });
                } else {
                  setNewNote({ ...newNote, title: e.target.value });
                }
              }}
              placeholder="عنوان"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
            />
            <textarea
              value={editingNote?.content || newNote.content}
              onChange={(e) => {
                if (editingNote) {
                  setEditingNote({ ...editingNote, content: e.target.value });
                } else {
                  setNewNote({ ...newNote, content: e.target.value });
                }
              }}
              placeholder="محتوا"
              rows={6}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none resize-none"
            />
            <input
              type="text"
              value={editingNote?.tags.join(', ') || newNote.tags}
              onChange={(e) => {
                if (editingNote) {
                  setEditingNote({
                    ...editingNote,
                    tags: e.target.value.split(',').map((t) => t.trim()),
                  });
                } else {
                  setNewNote({ ...newNote, tags: e.target.value });
                }
              }}
              placeholder="تگ‌ها (با کاما جدا کنید)"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={editingNote ? updateNote : addNote}
                className="glass-btn-primary px-4 py-2"
              >
                {editingNote ? 'ذخیره' : 'افزودن'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingNote(null);
                }}
                className="glass-btn px-4 py-2"
              >
                انصراف
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <GlassCard key={note.id}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold">{note.title}</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingNote(note)}
                  className="text-primary text-sm hover:underline"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-red-400 text-sm hover:underline"
                >
                  حذف
                </button>
              </div>
            </div>
            <p className="text-text-2 text-sm mb-3 line-clamp-3">{note.content}</p>
            <div className="flex flex-wrap gap-1">
              {note.tags.map((tag) => (
                <span key={tag} className="text-xs bg-white/10 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-xs text-text-3 mt-3">
              {new Date(note.createdAt).toLocaleDateString('fa-IR')}
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredNotes.length === 0 && !showAddForm && (
        <EmptyState
          icon="note"
          title="هنوز یادداشتی ندارید"
          description="اولین یادداشت خود را اضافه کنید."
          action={{ label: '+ افزودن یادداشت', onClick: () => setShowAddForm(true) }}
        />
      )}
    </div>
  );
}