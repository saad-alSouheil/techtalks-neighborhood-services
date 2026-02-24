"use client";

import { useEffect, useState } from "react";
import "./Rate.css";

export default function RatePopup({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (data: { reliability: string | number; punctuality: string | number; priceHonesty: string | number; comment: string }) => void }) {
  const [reliability, setReliability] = useState("");
  const [punctuality, setPunctuality] = useState("");
  const [priceHonesty, setPriceHonesty] = useState("");
  const [comment, setComment] = useState("");


  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const clamp0to5 = (value: string | number) => {
    if (value === "") return "";
    let n = Number(value);
    if (Number.isNaN(n)) return "";
    if (n < 0) n = 0;
    if (n > 5) n = 5;
    return String(n);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (reliability === "" || punctuality === "" || priceHonesty === "") {
      alert("Please fill all ratings (0-5).");
      return;
    }

    const data = {
      reliability,
      punctuality,
      priceHonesty,
      comment,
    };

    if (onSubmit) onSubmit(data);
    onClose();
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
              min="0"
              max="5"
              placeholder="0 - 5"
              value={reliability}
              onChange={(e) => setReliability(clamp0to5(e.target.value))}
            />
          </div>

          <div className="rate-row">
            <label className="rate-label">Punctuality</label>
            <input
              className="rate-input"
              type="number"
              min="0"
              max="5"
              placeholder="0 - 5"
              value={punctuality}
              onChange={(e) => setPunctuality(clamp0to5(e.target.value))}
            />
          </div>

          <div className="rate-row">
            <label className="rate-label">Price Honesty</label>
            <input
              className="rate-input"
              type="number"
              min="0"
              max="5"
              placeholder="0 - 5"
              value={priceHonesty}
              onChange={(e) => setPriceHonesty(clamp0to5(e.target.value))}
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

          <div className="rate-actions">
            <button className="rate-submit" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}