"use client";

import { Phone, Email, Notifications } from "@mui/icons-material";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="bg-[#E3E3E3] py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="flex flex-col gap-5">
          <h3 className="text-xl font-semibold text-[#0065FF]">MyLocalService</h3>
          <div className="flex items-center gap-2.5 text-gray-700">
            <Phone sx={{ color: "#FFA902", fontSize: 24 }} />
            <span>80 546 456</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-700">
            <Email sx={{ color: "#FFA902", fontSize: 24 }} />
            <span>myLocalservice@gmail.com</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <Notifications sx={{ color: "#FFA902", fontSize: 24 }} />
            <span className="font-semibold text-gray-700">Join our Newsletter</span>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[220px]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0065FF] text-white font-medium rounded-xl hover:bg-[#1d4ed8] transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
