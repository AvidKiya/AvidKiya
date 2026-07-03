"use client";
import { useEffect, useState } from "react";
export function ScrollProgress(){
  const [p, setP] = useState(0);
  useEffect(()=>{
    const onScroll = ()=>{
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setP(height>0 ? (scrolled/height)*100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return ()=> window.removeEventListener("scroll", onScroll);
  },[]);
  return <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-transparent no-print"><div className="h-full bg-accent-2 transition-all" style={{ width: p+"%" }} /></div>;
}
