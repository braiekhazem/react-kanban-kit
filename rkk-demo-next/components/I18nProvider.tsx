"use client";

import { useEffect } from "react";
import "@/lib/i18n";

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // i18n is initialized on import
  }, []);
  return <>{children}</>;
}
