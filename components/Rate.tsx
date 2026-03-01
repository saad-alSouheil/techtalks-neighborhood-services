"use client";

import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import StarRateIcon from '@mui/icons-material/StarRate';

interface RatePopupProps {
  isOpen: boolean;
  onClose: () => void;
  jobID: string;
  userID: string;
  providerID: string;
  onSuccess: () => void;
}

export default function RatePopup({ isOpen, onClose, jobID, userID, providerID, onSuccess }: RatePopupProps) {
  const [reliability, setReliability] = useState("");
  const [punctuality, setPunctuality] = useState("");
  const [priceHonesty, setPriceHonesty] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset form when popup closes
  useEffect(() => {
    if (!isOpen) {
      setReliability("");
      setPunctuality("");
      setPriceHonesty("");
      setComment("");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const clamp1to5 = (value: string) => {
    if (value === "") return "";
    let n = Number(value);
    if (Number.isNaN(n)) return "";
    if (n < 1) n = 1;
    if (n > 5) n = 5;
    return String(n);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (reliability === "" || punctuality === "" || priceHonesty === "") {
      setError("Please fill all ratings (1–5).");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Mark job as completed
      const jobRes = await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobID,
          status: "completed",
        }),
      });

      if (!jobRes.ok) {
        const jobData = await jobRes.json();
        setError(jobData.error ?? "Failed to mark job as completed.");
        return;
      }

      // 2. Submit rating
      const ratingRes = await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobID,
          userID,
          providerID,
          reliability: Number(reliability),
          punctuality: Number(punctuality),
          priceHonesty: Number(priceHonesty),
          comment,
        }),
      });

      if (!ratingRes.ok) {
        const ratingData = await ratingRes.json();
        setError(ratingData.error ?? "Failed to submit rating. Please try again.");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal Content */}
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-purple-50 to-white px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <StarRateIcon className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Review Service</h2>
          </div>
          <button
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Body */}
        <form className="px-8 py-6 flex flex-col gap-6" onSubmit={handleSubmit}>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold text-gray-800">Reliability</label>
              <input
                className="w-24 px-4 py-2 border border-gray-200 rounded-xl text-center text-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                type="number"
                min="1"
                max="5"
                placeholder="1 - 5"
                value={reliability}
                onChange={(e) => setReliability(clamp1to5(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold text-gray-800">Punctuality</label>
              <input
                className="w-24 px-4 py-2 border border-gray-200 rounded-xl text-center text-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                type="number"
                min="1"
                max="5"
                placeholder="1 - 5"
                value={punctuality}
                onChange={(e) => setPunctuality(clamp1to5(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold text-gray-800">Price Honesty</label>
              <input
                className="w-24 px-4 py-2 border border-gray-200 rounded-xl text-center text-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                type="number"
                min="1"
                max="5"
                placeholder="1 - 5"
                value={priceHonesty}
                onChange={(e) => setPriceHonesty(clamp1to5(e.target.value))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-100 pt-6">
            <label className="text-sm font-semibold tracking-wide text-gray-500 uppercase">Comment (Optional)</label>
            <textarea
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-25 resize-none bg-gray-50/50"
              placeholder="How was your experience?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          {error && (
            <div className="p-4 bg-red-50 rounded-xl flex items-center text-red-600 text-sm font-medium">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <div className="pt-4 pb-2">
            <button
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-sm transform transition-all active:scale-[0.98] ${isSubmitting ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 hover:shadow-md"
                }`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting Review..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}