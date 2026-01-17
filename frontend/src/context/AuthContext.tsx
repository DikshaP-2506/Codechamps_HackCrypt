"use client";

import { useState, useEffect } from "react";

export type User = {
  uid: string;
  displayName?: string;
  email?: string;
} | null;

// Minimal useAuth hook used by teleconsultation pages.
// This is intentionally lightweight: it returns `null` when no auth is available.
export function useAuth() {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    // If the app provides a global dev user, use it (optional).
    try {
      // @ts-ignore
      const dev = typeof window !== "undefined" ? (window as any).__DEV_USER__ : null;
      if (dev && dev.uid) setUser(dev as User);
    } catch {
      // ignore
    }
  }, []);

  return { user };
}

export default useAuth;
