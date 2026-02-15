"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";   // <<< added
import { usePathname } from "next/navigation";

interface User {
  id: string;
  userName: string;
  isProvider: boolean;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();               // <<< added
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include", // important for cookies
        });

        if (!res.ok) {
          router.refresh();
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.refresh();                    // ← refresh the page
    router.push("/");                    // then navigate to home
  };

  return (
    <header className="bg-white">
      <nav className="mx-auto px-6 py-5 flex items-center pr-10 pl-10 pt-5">
        <p className="text-2xl font-semibold text-[#0065FF] hover:text-[#1d4ed8] flex-1">
          MyLocalService
        </p>

        {!user? (
        <div className="flex items-center gap-3 justify-center flex-1">
          <Link
            href="/"
            className={`text-lg px-5 py-2 rounded-full font-medium transition-colors ${
              pathname === "/"
                ? "bg-[#f59e0b] text-white"
                : "text-gray-900 hover:text-gray-600"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`text-lg px-5 py-2 rounded-full font-medium transition-colors ${
              pathname === "/about"
                ? "bg-[#f59e0b] text-white"
                : "text-gray-900 hover:text-gray-600"
            }`}
          >
            About
          </Link>
        </div>) : null}

        <div className="flex-1 flex justify-end">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="px-5 py-2 rounded-2xl bg-[#0065FF] text-white font-medium hover:bg-[#1d4ed8] transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
