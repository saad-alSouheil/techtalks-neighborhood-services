/* // i updated this one too (Celine mortada)
const ProvidersList = () => {
  return (
    <div>List of providers page</div>
    
  )
}

export default ProvidersList
*/
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

      <button
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
        onClick={() => setOpen(true)}
      >
        View Rating
      </button>

      <ViewRating open={open} onClose={() => setOpen(false)} rating={rating} />
    </div>
  );
}
