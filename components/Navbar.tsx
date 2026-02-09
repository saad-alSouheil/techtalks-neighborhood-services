"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.ok ? res.json() : null)
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return (
    <header className="bg-white">
      <nav className="mx-auto px-6 py-5 flex items-center pr-10 pl-10 pt-5">
        <Link
          href="/"
          className="text-2xl font-semibold text-[#0065FF] hover:text-[#1d4ed8] flex-1"
        >
          MyLocalService
        </Link>

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
        </div>

        <div className="flex-1 flex justify-end">
          <Link
            href="/auth/login"
            className="px-5 py-2 rounded-2xl bg-[#0065FF] text-white font-medium hover:bg-[#1d4ed8] transition-colors"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
