"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    

    try{
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Login failed");
      }
      router.push("/providers");
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">

        {/* Title */}
        <h1 className="text-4xl font-bold text-orange-600 mb-2">
          Welcome <br /> Back
        </h1>

        <p className="text-gray-600 mb-6">
          Hey! Good to see you again
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            className="p-3 rounded-full bg-gray-200 text-gray-900 placeholder-gray-500 outline-none"
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            className="p-3 rounded-full bg-gray-200 text-gray-900 placeholder-gray-500 outline-none"
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button disabled={loading}
                  className="bg-orange-600 text-white p-3 rounded-full font-semibold hover:bg-orange-700 transition"
          >
            {loading ? (
              <span className="ml-2">Loading...</span>
            ) : (
              "Login"
            )}
          </button>

          <p className="text-sm text-center text-gray-700">
            Don’t have an account?{" "}
            <Link href="/auth/signup" className="text-orange-600 font-semibold">
              Sign up
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
}