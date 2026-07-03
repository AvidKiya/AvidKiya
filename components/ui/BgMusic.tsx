"use client";
import { useCms } from "@/contexts/CmsContext";
import { useEffect, useRef, useState } from "react";
export function BgMusic(){
  const { cms } = useCms();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(()=>{
    if(audioRef.current){
      audioRef.current.volume = cms.music.volume ?? 0.35;
      audioRef.current.loop = !!cms.music.loop;
      if(cms.music.enabled && cms.music.autoplay && cms.music.src){
        audioRef.current.play().catch(()=>{});
        setPlaying(true);
      }
    }
  }, [cms.music]);
  if(!cms.music.enabled || !cms.music.src) return null;
  return (
    <div className="fixed bottom-5 start-5 z-40 glass rounded-2xl px-3 py-2 text-xs flex items-center gap-2 no-print">
      <button onClick={()=>{
        if(!audioRef.current) return;
        if(playing){ audioRef.current.pause(); setPlaying(false);} else { audioRef.current.play(); setPlaying(true);}
      }} className="font-bold">{playing ? "⏸" : "▶️"} {cms.music.title || "Music"}</button>
      <audio ref={audioRef} src={cms.music.src} />
    </div>
  );
}
