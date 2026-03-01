"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

import ExploreIcon from '@mui/icons-material/Explore';
import PersonIcon from '@mui/icons-material/Person';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

    const navItemStyle = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
    ${
      pathname === path
        ? "bg-[#F2F2F2] text-xl pt-5 pb-5 text-black"
        : "text-gray-700 text-xl pt-5 pb-5 hover:bg-[#F2F2F2]"
    }`;

  return (
    <aside className="w-64 min-h-100 bg-white flex flex-col justify-between p-5 shadow-lg">
      <div>
        <nav className="flex flex-col gap-3">
          <Link href="/providers" className={navItemStyle("/providers")}>
          <ExploreIcon className="text-lg" />
            Browse
          </Link>

          <Link href="/profile" className={navItemStyle("/profile")}>
            <PersonIcon className="text-lg" />
            Profile
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
