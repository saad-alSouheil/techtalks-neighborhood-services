"use client";

import { useEffect, useState } from "react";

interface JobDescModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string) => void;
}

export default function JobDescModal({ isOpen, onClose, onSubmit }: JobDescModalProps) {
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() === "") {
      setError("Description cannot be empty.");
      return;
    }
    onSubmit(description.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <h2 className="mt-7 mb-4 text-center text-3xl font-bold text-[#FFA902]">
          Describe the Job
        </h2>

        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full h-32 rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide details of the service you need..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-[#FFA902] text-white hover:bg-[#e59400]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
