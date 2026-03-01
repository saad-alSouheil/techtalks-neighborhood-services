"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const INACTIVITY_TIMEOUT_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const LAST_ACTIVITY_KEY = "lastActivityTime";

export default function AuthLoader() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check for inactivity
        const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
        if (lastActivity) {
          const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
          if (timeSinceLastActivity > INACTIVITY_TIMEOUT_MS) {
            // 3 days have passed, logout
            localStorage.removeItem(LAST_ACTIVITY_KEY);
            clearUser();
            return;
          }
        }

        const res = await fetch("/api/auth/me");

        if (!res.ok) {
          clearUser();
          localStorage.removeItem(LAST_ACTIVITY_KEY);
          return;
        }

        const data = await res.json();
        setUser(data);

        // Update last activity time and redirect to /providers
        localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
        router.push("/providers");
      } catch {
        clearUser();
        localStorage.removeItem(LAST_ACTIVITY_KEY);
      }
    };

    loadUser();
  }, [setUser, clearUser, router]);

  return null;
}
