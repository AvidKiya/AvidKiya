"use client";

import React from "react";
import { CmsProvider } from "./CmsContext";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return <CmsProvider>{children}</CmsProvider>;
}
