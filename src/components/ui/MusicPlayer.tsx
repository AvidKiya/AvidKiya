'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCms } from '@/contexts/AppContext';
import { Icon } from '@/components/ui/Icon';

export function MusicPlayer() {
  const { cms, updateCms } = useCms();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState<number>(cms.music.currentIndex || 0);
  const tracks = cms.music.tracks || [];

  useEffect(() => {
    setIndex(cms.music.currentIndex || 0);
  }, [cms.music.currentIndex, cms.music.tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = cms.music.volume ?? 0.5;
    audio.loop = cms.music.loop ?? false;
  }, [cms.music.volume, cms.music.loop]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (tracks[index]) {
      audio.src = tracks[index].src;
      if (cms.music.autoplay) {
        audio.play().catch(() => {});
        setPlaying(true);
      }
    }
  }, [index, tracks, cms.music.autoplay]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
    updateCms('music.currentIndex', index);
  };

  const next = () => {
    if (!tracks.length) return;
    const nextIndex = (index + 1) % tracks.length;
    setIndex(nextIndex);
    updateCms('music.currentIndex', nextIndex);
    setPlaying(true);
  };

  const prev = () => {
    if (!tracks.length) return;
    const prevIndex = (index - 1 + tracks.length) % tracks.length;
    setIndex(prevIndex);
    updateCms('music.currentIndex', prevIndex);
    setPlaying(true);
  };

  const onEnded = () => {
    if (cms.music.loop) {
      const audio = audioRef.current;
      if (audio) audio.play();
    } else {
      next();
    }
  };

  if (!cms.music.enabled) return null;

  return (
    <>
      <audio ref={audioRef} onEnded={onEnded} style={{ display: 'none' }} />

      {/* Floating trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open music player"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full glass-card-strong flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        <Icon name="music" size={20} />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-md glass-card-strong p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Music Player</h3>
              <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-[var(--bg-tertiary)]">
                <Icon name="x" size={18} />
              </button>
            </div>

            {tracks.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No tracks available</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-[var(--bg-tertiary)] flex items-center justify-center">
                    {tracks[index]?.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tracks[index].cover} alt={String(tracks[index].title || 'cover')} className="w-full h-full object-cover" />
                    ) : (
                      <Icon name="music" size={28} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{typeof tracks[index]?.title === 'string' ? tracks[index]?.title : (tracks[index]?.title?.en || tracks[index]?.title?.fa)}</div>
                    <div className="text-sm text-[var(--text-muted)]">{tracks[index]?.artist || ''}</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6">
                  <button onClick={prev} className="p-3 rounded-full hover:bg-[var(--bg-tertiary)]">
                    <Icon name="skip-back" size={18} />
                  </button>
                  <button onClick={togglePlay} className="p-4 rounded-full gradient-bg text-white shadow">
                    {playing ? <Icon name="pause" size={18} /> : <Icon name="play" size={18} />}
                  </button>
                  <button onClick={next} className="p-3 rounded-full hover:bg-[var(--bg-tertiary)]">
                    <Icon name="skip-forward" size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Icon name="volume" size={16} />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={cms.music.volume}
                    onChange={(e) => updateCms('music.volume', Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={cms.music.loop}
                      onChange={(e) => updateCms('music.loop', e.target.checked)}
                    />
                    Loop
                  </label>

                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={cms.music.autoplay}
                      onChange={(e) => updateCms('music.autoplay', e.target.checked)}
                    />
                    Autoplay
                  </label>
                </div>

                <div className="mt-2">
                  <h4 className="text-sm font-medium mb-2">Playlist</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {tracks.map((t, i) => (
                      <div key={t.id} className={`flex items-center justify-between p-2 rounded-lg ${i === index ? 'bg-[var(--bg-tertiary)]' : ''}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[var(--bg-secondary)] flex items-center justify-center text-xs">{i + 1}</div>
                          <div>
                            <div className="font-medium">{typeof t.title === 'string' ? t.title : (t.title?.en || t.title?.fa)}</div>
                            <div className="text-xs text-[var(--text-muted)]">{t.artist}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setIndex(i); updateCms('music.currentIndex', i); setPlaying(true); }} className="p-2 rounded hover:bg-[var(--bg-tertiary)]">
                            <Icon name="play" size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MusicPlayer;
