"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });

    clearUser();   // instant UI update
    router.push("/");
  };

  return (
    <header className="bg-white">
      <nav className="mx-auto px-6 py-5 flex items-center pr-10 pl-10 pt-5">
        <p className="text-2xl font-semibold text-[#0065FF] flex-1">
          MyLocalService
        </p>

        {!user && (
          <div className="flex items-center gap-3 justify-center flex-1">
            <Link
              href="/"
              className={`text-lg px-5 py-2 rounded-full ${
                pathname === "/"
                  ? "bg-[#f59e0b] text-white"
                  : "text-gray-900 hover:text-gray-600"
              }`}
            >
              Home
            </Link>

            <Link
              href="/about"
              className={`text-lg px-5 py-2 rounded-full ${
                pathname === "/about"
                  ? "bg-[#f59e0b] text-white"
                  : "text-gray-900 hover:text-gray-600"
              }`}
            >
              About
            </Link>
          </div>
        )}

        <div className="flex-1 flex justify-end">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="px-5 py-2 rounded-2xl bg-[#0065FF] text-white hover:bg-[#1d4ed8]"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
