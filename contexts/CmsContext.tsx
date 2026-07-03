"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CmsState,
  defaultCmsState,
  EditableText,
  I18nText,
  StyleOverride,
} from "@/lib/cms/schema";
import { useApp } from "./AppContext";
import { fetchRemoteState, pingApi, pushRemoteState, verifyToken } from "@/lib/cms/api";

const LS_STATE = "avidkiya:cms";
const LS_EDIT_MODE = "avidkiya:editMode";
const LS_TOKEN = "avidkiya:admin-token";

/* ─── Path helpers (no lodash) ──────────────────────────────── */
function setByPath(obj: any, path: string, value: any): any {
  const parts = path.split(".");
  const clone: any = Array.isArray(obj) ? obj.slice() : { ...obj };
  let cur = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    const idx = /^\d+$/.test(k) ? Number(k) : k;
    const nextVal = cur[idx];
    cur[idx] = Array.isArray(nextVal) ? nextVal.slice() : { ...(nextVal ?? {}) };
    cur = cur[idx];
  }
  const last = parts[parts.length - 1];
  cur[/^\d+$/.test(last) ? Number(last) : last] = value;
  return clone;
}
function getByPath(obj: any, path: string): any {
  const parts = path.split(".");
  let cur = obj;
  for (const k of parts) {
    if (cur == null) return undefined;
    cur = cur[/^\d+$/.test(k) ? Number(k) : k];
  }
  return cur;
}

/* ─── Types ─────────────────────────────────────────────────── */
export type SyncStatus = "idle" | "syncing" | "synced" | "offline" | "error";

interface CmsContextValue {
  state: CmsState;
  loaded: boolean;

  // Auth / mode
  isAdmin: boolean;
  editMode: boolean;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
  setEditMode: (v: boolean) => void;

  // Remote sync
  syncStatus: SyncStatus;
  lastSyncAt: string | null;
  syncNow: () => Promise<void>;

  // Mutations
  update: (path: string, value: any) => void;
  updateText: (path: string, lang: "fa" | "en", value: string) => void;
  updateStyle: (path: string, style: StyleOverride) => void;
  addToList: <T>(path: string, item: T) => void;
  removeFromList: (path: string, index: number) => void;
  moveInList: (path: string, index: number, dir: -1 | 1) => void;

  // Convenience
  resolve: (text: I18nText) => string;
  resolveEditable: (t: EditableText) => string;
  reset: () => void;
  exportJson: () => string;
  importJson: (json: string) => boolean;
}

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const { language } = useApp();
  const [state, setState] = useState<CmsState>(defaultCmsState);
  const [loaded, setLoaded] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [editMode, setEditModeState] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const initialized = useRef(false);
  const skipNextPush = useRef(true);
  const debounceRef = useRef<any>(null);

  /* ─ Boot: hydrate from localStorage, then try remote KV ─ */
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      // Local hydration first (instant, offline-friendly)
      try {
        const raw = localStorage.getItem(LS_STATE);
        if (raw) {
          const parsed = JSON.parse(raw);
          setState({ ...defaultCmsState, ...parsed });
        }
        setToken(localStorage.getItem(LS_TOKEN));
        setEditModeState(localStorage.getItem(LS_EDIT_MODE) === "yes");
      } catch {}

      // Remote sync (production Cloudflare Pages)
      try {
        setSyncStatus("syncing");
        const remote = await fetchRemoteState();
        if (remote) {
          setState({ ...defaultCmsState, ...remote });
          try {
            localStorage.setItem(LS_STATE, JSON.stringify(remote));
          } catch {}
          setLastSyncAt(new Date().toISOString());
          setSyncStatus("synced");
        } else {
          // Endpoint responded but empty (fresh KV) — that's fine
          setSyncStatus("synced");
        }
      } catch {
        setSyncStatus("offline");
      }

      setLoaded(true);
      // Allow subsequent state changes to trigger push
      setTimeout(() => (skipNextPush.current = false), 100);
    })();
  }, []);

  /* ─ Persist locally on every change, debounced push to remote ─ */
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(LS_STATE, JSON.stringify(state));
    } catch {}

    if (skipNextPush.current) return;
    if (!token) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSyncStatus("syncing");
      const res = await pushRemoteState(state, token);
      if (res.ok) {
        setSyncStatus("synced");
        setLastSyncAt(new Date().toISOString());
      } else {
        setSyncStatus("error");
      }
    }, 800);
  }, [state, loaded, token]);

  /* ─ API ─ */
  const setEditMode = useCallback((v: boolean) => {
    setEditModeState(v);
    try {
      localStorage.setItem(LS_EDIT_MODE, v ? "yes" : "no");
    } catch {}
  }, []);

  const login = useCallback(async (t: string) => {
    // 1) See if the API is reachable at all (i.e. we're on Cloudflare Pages
    //    with Functions deployed).
    const ping = await pingApi();

    if (ping.apiReachable) {
      // 2) Verify against the server. Only ADMIN_TOKEN from Cloudflare env
      //    is accepted — no offline password bypass in production, otherwise
      //    the local fallback would defeat the whole auth scheme.
      const v = await verifyToken(t);
      if (v.ok) {
        setToken(t);
        localStorage.setItem(LS_TOKEN, t);
        setSyncStatus(v.kvBound ? "synced" : "offline");
        setLastSyncAt(new Date().toISOString());
        return true;
      }
      return false;
    }

    // 3) API unreachable → we're on localhost / static preview.
    //    Accept the dev password so the panel remains usable offline.
    if (t === "avidkiya-2026") {
      setToken(t);
      localStorage.setItem(LS_TOKEN, t);
      setSyncStatus("offline");
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setEditMode(false);
    localStorage.removeItem(LS_TOKEN);
  }, [setEditMode]);

  const syncNow = useCallback(async () => {
    if (!token) return;
    setSyncStatus("syncing");
    const res = await pushRemoteState(state, token);
    if (res.ok) {
      setSyncStatus("synced");
      setLastSyncAt(new Date().toISOString());
    } else {
      setSyncStatus("error");
    }
  }, [state, token]);

  const update = useCallback((path: string, value: any) => {
    setState((s) => setByPath(s, path, value));
  }, []);
  const updateText = useCallback((path: string, lang: "fa" | "en", value: string) => {
    setState((s) => setByPath(s, `${path}.${lang}`, value));
  }, []);
  const updateStyle = useCallback((path: string, style: StyleOverride) => {
    setState((s) => {
      const current = getByPath(s, `${path}.style`) ?? {};
      return setByPath(s, `${path}.style`, { ...current, ...style });
    });
  }, []);
  const addToList = useCallback(<T,>(path: string, item: T) => {
    setState((s) => {
      const list = (getByPath(s, path) ?? []) as any[];
      return setByPath(s, path, [...list, item]);
    });
  }, []);
  const removeFromList = useCallback((path: string, index: number) => {
    setState((s) => {
      const list = (getByPath(s, path) ?? []) as any[];
      return setByPath(s, path, list.filter((_, i) => i !== index));
    });
  }, []);
  const moveInList = useCallback((path: string, index: number, dir: -1 | 1) => {
    setState((s) => {
      const list = ((getByPath(s, path) ?? []) as any[]).slice();
      const swap = index + dir;
      if (swap < 0 || swap >= list.length) return s;
      [list[index], list[swap]] = [list[swap], list[index]];
      return setByPath(s, path, list);
    });
  }, []);

  const resolve = useCallback(
    (t: I18nText) => (t ? t[language] ?? t.en ?? "" : ""),
    [language]
  );
  const resolveEditable = useCallback(
    (t: EditableText) => resolve(t?.value ?? { fa: "", en: "" }),
    [resolve]
  );

  const reset = useCallback(() => setState(defaultCmsState), []);
  const exportJson = useCallback(() => JSON.stringify(state, null, 2), [state]);
  const importJson = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json);
      setState({ ...defaultCmsState, ...parsed });
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo<CmsContextValue>(
    () => ({
      state,
      loaded,
      isAdmin: !!token,
      editMode,
      login,
      logout,
      setEditMode,
      syncStatus,
      lastSyncAt,
      syncNow,
      update,
      updateText,
      updateStyle,
      addToList,
      removeFromList,
      moveInList,
      resolve,
      resolveEditable,
      reset,
      exportJson,
      importJson,
    }),
    [state, loaded, token, editMode, syncStatus, lastSyncAt, login, logout, setEditMode, syncNow, update, updateText, updateStyle, addToList, removeFromList, moveInList, resolve, resolveEditable, reset, exportJson, importJson]
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used inside CmsProvider");
  return ctx;
}
