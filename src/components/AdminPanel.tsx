"use client";

import React, { useState, useEffect } from 'react';

export const AdminPanel = () => {
  const [isHash, setIsHash] = useState(false);
  const [pass, setPass] = useState("");
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkHash = () => setIsHash(window.location.hash === "#panelkiya");
    window.addEventListener('hashchange', checkHash);
    checkHash();
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === "AvidKiya*2397*7370#") {
      setIsAuth(true);
    } else {
      alert("Unauthorized access.");
    }
  };

  if (!isHash) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0d1117] flex items-center justify-center p-6">
      {!isAuth ? (
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-accent-python font-black text-2xl uppercase tracking-tighter">Secure Login</h2>
            <p className="text-white/20 text-[10px] uppercase tracking-widest font-mono">Kiya OS Core Management</p>
          </div>
          <input 
            type="password" 
            placeholder="ACCESS TOKEN" 
            className="w-full bg-[#161b22] border border-[#30363d] p-4 rounded text-white font-mono outline-none focus:border-accent-python transition-all"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <button className="w-full bg-accent-python py-4 font-black uppercase text-xs tracking-[0.3em] hover:brightness-110 transition-all rounded shadow-lg shadow-blue-500/10">
            Verify Identity
          </button>
        </form>
      ) : (
        <div className="w-full max-w-4xl h-[80vh] code-card rounded-xl overflow-hidden flex flex-col">
          <div className="bg-[#161b22] p-4 border-b border-[#30363d] flex justify-between items-center">
            <span className="text-accent-python font-bold text-xs uppercase tracking-widest">Admin Dashboard v1.0</span>
            <button onClick={() => setIsAuth(false)} className="text-white/40 hover:text-white text-xs">LOGOUT</button>
          </div>
          <div className="flex-1 p-8 grid grid-cols-2 gap-8 overflow-auto">
             <div className="space-y-4">
                <label className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Add Project</label>
                <input placeholder="Project Name" className="w-full bg-black/20 border border-[#30363d] p-3 rounded text-sm outline-none focus:border-accent-python"/>
                <textarea placeholder="Description" className="w-full bg-black/20 border border-[#30363d] p-3 rounded text-sm h-32 outline-none focus:border-accent-python"></textarea>
                <button className="bg-accent-python px-6 py-2 rounded text-[10px] font-bold uppercase tracking-widest">Sync to Cloud</button>
             </div>
             <div className="bg-black/40 rounded-lg p-6 flex items-center justify-center border-2 border-dashed border-[#30363d]">
                <div className="text-center space-y-2 opacity-30">
                   <p className="text-xs font-mono uppercase">Drag & Drop Assets</p>
                   <p className="text-[10px] font-mono">PNG, JPG, SVG max 5MB</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
