"use client";

import React from "react";

import { IUser } from "@/types";

interface SidebarProps {
    user: IUser;      
}
const Sidebar = ({ user }: SidebarProps) => {
    return (
    <aside className="w-64 bg-gray-100 p-4">
        <ul className="space-y-2">
            <li>Browse</li>
            <li>Profile</li>

            {user.isProvider && (
            <li>Manage Services</li>
            )}
        </ul>
    </aside>
    );
}

export default Sidebar