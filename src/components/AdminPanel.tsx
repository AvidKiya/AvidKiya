"use client";

import React, { useState, useEffect } from 'react';

export const AdminPanel = () => {
  const [isHash, setIsHash] = useState(false);
  const [pass, setPass] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [siteData, setSiteData] = useState({
    name: "AVID KIYA",
    title: "Senior AI & Backend Architect",
    bio: "Building scalable intelligent systems with Python & Node.js.",
  });

  useEffect(() => {
    const checkHash = () => setIsHash(window.location.hash === "#panelkiya");
    window.addEventListener('hashchange', checkHash);
    checkHash();
    
    const saved = localStorage.getItem('kiya_site_data');
    if (saved) setSiteData(JSON.parse(saved));

    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleSave = () => {
    localStorage.setItem('kiya_site_data', JSON.stringify(siteData));
    alert("Changes synced to local cache! Update code for permanent deployment.");
    window.location.reload();
  };

  if (!isHash) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 font-mono">
      {!isAuth ? (
        <div className="w-full max-w-sm space-y-8">
           <div className="text-center">
              <h2 className="text-[#00FF41] text-2xl font-black">ACCESS RESTRICTED</h2>
              <p className="text-white/20 text-[10px] mt-2">IDENTIFICATION REQUIRED</p>
           </div>
           <input 
             type="password" 
             autoFocus
             placeholder="VERIFICATION_KEY" 
             className="w-full bg-white/5 border border-white/10 p-5 rounded-xl text-center text-white tracking-[0.5em] outline-none focus:border-[#00FF41] transition-all"
             onChange={(e) => e.target.value === "AvidKiya*2397*7370#" && setIsAuth(true)}
           />
        </div>
      ) : (
        <div className="w-full max-w-5xl h-[85vh] bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
             <span className="text-[#00FF41] font-bold text-xs">MASTER_CONTROL_PANEL v5.0</span>
             <div className="flex gap-4">
                <button onClick={handleSave} className="bg-[#00FF41] text-black px-6 py-2 rounded-lg text-[10px] font-black uppercase">Deploy Changes</button>
                <button onClick={() => setIsAuth(false)} className="text-white/20 hover:text-white text-xs">LOGOUT</button>
             </div>
          </div>
          
          <div className="flex-1 p-10 grid grid-cols-1 md:grid-cols-2 gap-12 overflow-y-auto">
             <div className="space-y-8">
                <h3 className="text-white/40 text-[10px] uppercase font-bold tracking-widest">General Information</h3>
                <div className="space-y-4">
                   <input 
                     value={siteData.name} 
                     onChange={e => setSiteData({...siteData, name: e.target.value})}
                     placeholder="Name" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-[#00FF41]"
                   />
                   <input 
                     value={siteData.title} 
                     onChange={e => setSiteData({...siteData, title: e.target.value})}
                     placeholder="Title" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-[#00FF41]"
                   />
                   <textarea 
                     value={siteData.bio} 
                     onChange={e => setSiteData({...siteData, bio: e.target.value})}
                     placeholder="Biography" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl h-32 outline-none focus:border-[#00FF41]"
                   />
                </div>
             </div>

             <div className="space-y-8">
                <h3 className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Media Assets</h3>
                <div className="border-2 border-dashed border-white/10 rounded-2xl h-64 flex flex-col items-center justify-center gap-4 hover:border-[#00FF41]/40 transition-colors cursor-pointer group">
                   <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round"/></svg>
                   </div>
                   <p className="text-[10px] text-white/30 uppercase font-black">Upload Profile / Work</p>
                </div>
                <div className="grid grid-cols-3 gap-4 opacity-50">
                   {[1,2,3].map(i => <div key={i} className="aspect-square bg-white/5 rounded-lg border border-white/5 animate-pulse"></div>)}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
