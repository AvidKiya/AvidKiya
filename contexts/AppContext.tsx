"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Lang, Theme } from "@/lib/cms/schema";

type AppCtx = {
  lang: Lang;
  setLang: (l: Lang)=>void;
  theme: Theme;
  setTheme: (t: Theme)=>void;
  dir: "rtl" | "ltr";
  toggleLang: ()=>void;
  toggleTheme: ()=>void;
};

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children, defaultLang = "fa", defaultTheme = "dark" }: { children: React.ReactNode, defaultLang?: Lang, defaultTheme?: Theme }) {
  const [lang, setLangState] = useState<Lang>(defaultLang);
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(()=>{
    const savedLang = localStorage.getItem("ak_lang") as Lang | null;
    const savedTheme = localStorage.getItem("ak_theme") as Theme | null;
    if(savedLang) setLangState(savedLang);
    if(savedTheme) setThemeState(savedTheme);
  }, []);

  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem("ak_lang", l); document.documentElement.setAttribute("lang", l); document.documentElement.setAttribute("dir", l==="fa" ? "rtl" : "ltr"); };
  const setTheme = (t: Theme) => { setThemeState(t); localStorage.setItem("ak_theme", t); };

  useEffect(()=>{
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang==="fa" ? "rtl" : "ltr");
    if(theme==="light") document.documentElement.classList.add("light");
    else document.documentElement.classList.remove("light");
  }, [lang, theme]);

  const toggleLang = ()=> setLang(lang==="fa" ? "en" : "fa");
  const toggleTheme = ()=> setTheme(theme==="dark" ? "light" : "dark");

  return <Ctx.Provider value={{ lang, setLang, theme, setTheme, dir: lang==="fa" ? "rtl" : "ltr", toggleLang, toggleTheme }}>
    {children}
  </Ctx.Provider>
}

export const useApp = ()=> {
  const v = useContext(Ctx);
  if(!v) throw new Error("AppProvider missing");
  return v;
};
