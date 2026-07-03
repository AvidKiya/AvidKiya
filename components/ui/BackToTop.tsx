"use client";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
export function BackToTop(){
  const [show, setShow] = useState(false);
  useEffect(()=>{
    const fn = ()=> setShow(window.scrollY > 500);
    window.addEventListener("scroll", fn);
    return ()=> window.removeEventListener("scroll", fn);
  },[]);
  if(!show) return null;
  return <button onClick={()=>window.scrollTo({top:0, behavior:"smooth"})} className="fixed bottom-6 end-6 z-40 p-3 rounded-2xl glass shadow-glow hover:scale-105 transition no-print"><Icon name="arrow_up" /></button>;
}
