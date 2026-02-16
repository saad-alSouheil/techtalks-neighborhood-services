"use client";

import { useState } from "react";
import ViewRating from "@/components/ViewRating";

export default function ProvidersList() {
  const [open, setOpen] = useState(false);

  const rating = {
    jobTitle: "Plumbing Job",
    customerName: "Celine",
    rating: 4.6,
    review: "Fast and professional.",
    date: "2026-02-16",
  };

  return (
    <div className="p-6">
      <div>List of providers page</div>

    

      <ViewRating open={open} onClose={() => setOpen(false)} rating={rating} />
    </div>
  );
}
