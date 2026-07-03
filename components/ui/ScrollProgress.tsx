'use client';
import { useEffect, useState } from 'react';
export function ScrollProgress(){const[p,setP]=useState(0);useEffect(()=>{const f=()=>{const h=document.documentElement.scrollHeight-innerHeight;setP(h>0?scrollY/h*100:0)};f();addEventListener('scroll',f,{passive:true});addEventListener('resize',f);return()=>{removeEventListener('scroll',f);removeEventListener('resize',f)}},[]);return <div className="fixed inset-x-0 top-0 z-[80] h-1 bg-transparent no-print"><div className="h-full bg-[linear-gradient(90deg,var(--emerald),var(--primary-bright))]" style={{width:`${p}%`}}/></div>}
