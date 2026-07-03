'use client';
import { useCms } from '@/contexts/CmsContext';
export function BgMusic(){const{cms}=useCms();if(!cms.music.enabled||!cms.music.src)return null;return <audio src={cms.music.src} autoPlay={cms.music.autoplay} loop={cms.music.loop} controls className="no-print fixed bottom-5 start-5 z-40 w-56 opacity-80" style={{volume:cms.music.volume} as any}/>}
