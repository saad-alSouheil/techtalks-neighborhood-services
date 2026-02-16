"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthLoader() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me");

        if (!res.ok) {
          clearUser();
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch {
        clearUser();
      }
    };

    loadUser();
  }, [setUser, clearUser]);

  return null;
}
