"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white">
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center">
        <Link
          href="/"
          className="text-xl font-semibold text-[#2563eb] hover:text-[#1d4ed8] flex-1"
        >
          MyLocalService
        </Link>

        <div className="flex items-center gap-3 justify-center flex-1">
          <Link
            href="/"
            className={`px-5 py-2 rounded-full font-medium transition-colors ${
              pathname === "/"
                ? "bg-[#f59e0b] text-white"
                : "text-gray-900 hover:text-gray-600"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`px-5 py-2 rounded-full font-medium transition-colors ${
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
            className="px-5 py-2 rounded-full bg-[#1e40af] text-white font-medium hover:bg-[#1e3a8a] transition-colors"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
