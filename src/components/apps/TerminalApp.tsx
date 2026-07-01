"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '@/store/os-store';

const COMMANDS = {
  help: "Available commands: help, about, skills, projects, clear, whoami, neofetch",
  about: "Avid Kiya: AI Engineer, Linux Enthusiast, Backend Developer, and Graphic Designer.",
  whoami: "User: Guest\nHost: KiyaOS\nRole: Creative Technologist",
  skills: "Python: [##########] 100%\nLinux:  [##########] 100%\nAI:     [######### ] 90%\nDesign: [########  ] 80%",
  neofetch: "      .---.      OS: KiyaOS 1.0\n     /     \\     Host: Portfolio-Workstation\n    | () () |    Kernel: Next.js 15\n     \\  ^  /     Shell: Custom Bash Simulation\n      |||||      UI: Tailwind + Framer Motion\n      |||||      Uptime: 100% Focused",
};

export const TerminalApp = () => {
  const [history, setHistory] = useState<string[]>(["Welcome to KiyaOS v1.0.0", "Type 'help' to see available commands."]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, `$ ${input}`];

    if (cmd === 'clear') {
      setHistory([]);
    } else if (COMMANDS[cmd as keyof typeof COMMANDS]) {
      newHistory.push(COMMANDS[cmd as keyof typeof COMMANDS]);
      setHistory(newHistory);
    } else {
      newHistory.push(`Command not found: ${cmd}`);
      setHistory(newHistory);
    }

    setInput("");
  };

  return (
    <div className="bg-charcoal text-primary p-4 font-mono text-sm h-full flex flex-col scanlines" ref={scrollRef}>
      <div className="flex-1 whitespace-pre-wrap">
        {history.map((line, i) => (
          <div key={i} className="mb-1">{line}</div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="flex mt-2">
        <span className="mr-2">$</span>
        <input
          autoFocus
          className="bg-transparent border-none outline-none flex-1 text-primary"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
};
