// Signup page

"use client";

import { useState } from "react";
import Link from "next/link";

export default function Signup() {
  const [neighborhood, setNeighborhood] = useState("");

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center">

      {/* Card */}
      <div className="bg-white w-96 p-10 rounded-2xl shadow-xl">

        {/* Title */}
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          Sign Up
        </h1>

        <p className="text-gray-600 mb-6">
          Hello! Welcome to MyLocalService
        </p>

        {/* Form */}
        <form className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Username"
            className="p-3 rounded-full bg-gray-200 text-gray-900 outline-none"
            required
          />

          <input
            type="tel"
            placeholder="Phone number"
            className="p-3 rounded-full bg-gray-200 text-gray-900 outline-none"
            required
          />

          {/* Neighborhood dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Neighborhood
            </label>

            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="p-3 rounded-lg bg-gray-200 text-gray-900 outline-none"
              required
            >
              <option value="">Select your neighborhood</option>
              <option value="hamra">Hamra</option>
              <option value="achrafieh">Achrafieh</option>
              <option value="verdun">Verdun</option>
              <option value="downtown">Downtown</option>
            </select>
          </div>

          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-full bg-gray-200 text-gray-900 outline-none"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>

          <p className="text-sm text-center text-gray-700">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}



