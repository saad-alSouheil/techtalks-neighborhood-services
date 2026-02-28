"use client";

import { useEffect, useState } from "react";
import "./Rate.css";

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
    <div className="rate-overlay">
      { }
      <div className="rate-backdrop" onClick={onClose}></div>

      <div className="rate-modal" role="dialog" aria-modal="true">
        <button className="rate-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h2 className="rate-title">Rate the Service</h2>
        <div className="rate-divider"></div>

        <form className="rate-form" onSubmit={handleSubmit}>
          <div className="rate-row">
            <label className="rate-label">Reliability</label>
            <input
              className="rate-input"
              type="number"
              min="1"
              max="5"
              placeholder="1 - 5"
              value={reliability}
              onChange={(e) => setReliability(clamp1to5(e.target.value))}
            />
          </div>

          <div className="rate-row">
            <label className="rate-label">Punctuality</label>
            <input
              className="rate-input"
              type="number"
              min="1"
              max="5"
              placeholder="1 - 5"
              value={punctuality}
              onChange={(e) => setPunctuality(clamp1to5(e.target.value))}
            />
          </div>

          <div className="rate-row">
            <label className="rate-label">Price Honesty</label>
            <input
              className="rate-input"
              type="number"
              min="1"
              max="5"
              placeholder="1 - 5"
              value={priceHonesty}
              onChange={(e) => setPriceHonesty(clamp1to5(e.target.value))}
            />
          </div>

          <div className="rate-comment">
            <label className="rate-label-small">Comment</label>
            <textarea
              className="rate-textarea"
              placeholder="Write your comment here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}

          <div className="rate-actions">
            <button className="rate-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}