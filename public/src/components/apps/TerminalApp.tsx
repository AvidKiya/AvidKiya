"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const COMMANDS = {
  help: [
    "Available commands:",
    "  about     - Learn who is @avidkiya",
    "  skills    - View technical expertise",
    "  projects  - Show recent work",
    "  design    - Open Photoshop showcase",
    "  photo     - Open Camera/Gallery",
    "  clear     - Wipe the terminal",
    "  neofetch  - System information",
    "  contact   - Get in touch"
  ],
  about: [
    "User: @avidkiya",
    "Role: AI Engineer | Full-Stack Dev | Creative Designer",
    "Bio: Crafting digital experiences at the intersection of",
    "     code and art. Obsessed with Linux, AI, and Pixels."
  ],
  skills: [
    "Python     [####################] 100%",
    "TypeScript [##################  ] 90%",
    "FastAPI    [#################   ] 85%",
    "AI/ML      [#################   ] 85%",
    "Photoshop  [################### ] 95%",
    "Linux/Bash [####################] 100%"
  ],
  neofetch: [
    "      .---.       AVID KIYA @ ARENA",
    "     /     \\      -----------------",
    "    | () () |     OS: KiyaOS v2.0 (Cyberpunk Edition)",
    "     \\  ^  /      Host: Portfolio.avidkiya.ir",
    "      |||||       Kernel: Next.js 15 / React 19",
    "      |||||       Shell: Interactive Zsh Simulation",
    "                  UI: Tailwind / Framer Motion",
    "                  Theme: Tiffany & Charcoal"
  ],
  contact: [
    "Telegram:  @avidkiya",
    "GitHub:    github.com/AvidKiya",
    "Email:     AvidKiya@gmail.com",
    "Location:  Tehran/Global"
  ]
};

export const TerminalApp = () => {
  const [history, setHistory] = useState<string[]>(["KIYA OS [Version 2.0.42]", "(c) 2026 Avid Kiya. All rights reserved.", "", "Type 'help' to begin..."]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let response: string[] = [];
    if (cmd === 'clear') {
      setHistory([]);
      setInput("");
      return;
    } else if (COMMANDS[cmd as keyof typeof COMMANDS]) {
      response = COMMANDS[cmd as keyof typeof COMMANDS];
    } else {
      response = [`Command not found: ${cmd}. Type 'help' for assistance.`];
    }

    setHistory([...history, `> ${input}`, ...response, ""]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full font-mono text-sm md:text-base p-4 overflow-hidden bg-[#121212] text-[#21F1A8] crt shadow-inner">
      <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar" ref={scrollRef}>
        {history.map((line, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.2 }}
            key={i} 
            className="mb-1 leading-relaxed whitespace-pre-wrap"
          >
            {line}
          </motion.div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="flex items-center gap-2 border-t border-[#21F1A8]/20 pt-4">
        <span className="text-[#21F1A8] animate-pulse">➜</span>
        <span className="text-[#F0EDE4]/50">~/@avidkiya</span>
        <input
          autoFocus
          className="bg-transparent border-none outline-none flex-1 text-[#F0EDE4] caret-[#21F1A8]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
      </form>
    </div>
  );
};
