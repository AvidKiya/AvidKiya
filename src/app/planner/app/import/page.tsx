'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { Upload, Check } from 'lucide-react';

export default function ImportPage() {
  const [source, setSource] = useState('notion');
  const [format, setFormat] = useState('csv');
  const [type, setType] = useState('note');
  const [content, setContent] = useState('');
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const importData = async () => {
    setBusy(true); setResult(null);
    const token = localStorage.getItem('kiya_jwt');
    try {
      const res = await fetch('/api/planner/import', { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify({ source, format, type, content }) });
      const data = await res.json();
      setResult(data);
      if (data.success) setContent('');
    } finally { setBusy(false); }
  };

  return <div className="space-y-6"><div><h1 className="text-2xl font-bold">Import</h1><p className="text-text-2 text-sm mt-1">Import from Notion CSV, Obsidian Markdown, Todoist CSV or generic JSON.</p></div><GlassCard className="!p-5 space-y-4"><div className="grid md:grid-cols-3 gap-3"><label className="text-sm"><div className="text-text-3 mb-1">Source</div><select value={source} onChange={e=>setSource(e.target.value)} className="glass-input"><option value="notion">Notion</option><option value="obsidian">Obsidian</option><option value="todoist">Todoist</option><option value="generic">Generic</option></select></label><label className="text-sm"><div className="text-text-3 mb-1">Format</div><select value={format} onChange={e=>setFormat(e.target.value)} className="glass-input"><option value="csv">CSV</option><option value="markdown">Markdown</option><option value="json">JSON</option></select></label><label className="text-sm"><div className="text-text-3 mb-1">Default type</div><select value={type} onChange={e=>setType(e.target.value)} className="glass-input"><option value="note">Note</option><option value="task">Task</option><option value="goal">Goal</option></select></label></div><textarea value={content} onChange={e=>setContent(e.target.value)} rows={12} className="glass-input w-full font-mono text-[12px]" placeholder={'CSV: title,content,tags\nMy note,Text,tag1\n\nMarkdown: # Note title\nContent...\n\nJSON: [{"type":"task","title":"Do something"}]'} dir="ltr"/><button onClick={importData} disabled={busy || !content.trim()} className="glass-btn-primary !py-3 !px-5 flex items-center gap-2 disabled:opacity-50"><Upload size={16}/> {busy ? 'Importing…' : 'Import data'}</button>{result && <div className={result.success?'text-emerald':'text-rose'}>{result.success ? <span className="inline-flex items-center gap-1"><Check size={14}/> Imported: {JSON.stringify(result.data)}</span> : result.error}</div>}</GlassCard></div>;
}
