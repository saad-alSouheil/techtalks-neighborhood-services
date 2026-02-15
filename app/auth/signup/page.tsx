"use client";

import { useState } from "react";
import { useEffect } from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";

interface Neighborhood {
  id: string;
  name: string;
  city: string;
}

export default function Signup() {

  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [neighborhoodID, setNeighborhoodID] = useState("");
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch neighborhoods
  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const res = await fetch("/api/neighborhood");
        const data = await res.json();
        setNeighborhoods(data);
      } catch (err) {
        console.error("Failed to fetch neighborhoods");
      }
    };

    fetchNeighborhoods();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          email,
          password,
          phone,
          neighborhoodID,
          isProvider: false, // default false
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Redirect to login after success
      router.push("/auth/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center">
      <div className="bg-white w-96 p-10 rounded-2xl shadow-xl">

        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          Sign Up
        </h1>

        <p className="text-gray-600 mb-6">
          Hello! Welcome to MyLocalService
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="p-3 rounded-full bg-gray-200 text-gray-900 outline-none"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-full bg-gray-200 text-gray-900 outline-none"
            required
          />

          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 rounded-full bg-gray-200 text-gray-900 outline-none"
            required
          />

          {/* Neighborhood dropdown */}
          <select
            value={neighborhoodID}
            onChange={(e) => setNeighborhoodID(e.target.value)}
            className="p-3 rounded-lg bg-gray-200 outline-none"
            required
          >
            <option value="">Select your neighborhood</option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>
                {n.city} - {n.name}
              </option>
            ))}
          </select>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-full bg-gray-200 text-gray-900 outline-none"
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
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



