"use client";

import { useAuthStore } from "@/store/useAuthStore";

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <aside className="w-64 bg-white p-4">
      <ul className="space-y-2">
        <li>Browse</li>
        <li>Profile</li>

        {user.isProvider && (
          <li>Manage Services</li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
