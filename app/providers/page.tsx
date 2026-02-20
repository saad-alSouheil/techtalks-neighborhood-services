"use client";

import { useState } from "react";
import ProviderCard, { ServiceProvider } from "@/components/ProviderCard";
import ViewRating from "@/components/ViewRating";

const providers: ServiceProvider[] = [
  {
    id: 1,
    name: "Johnny Smith",
    profession: "Electrician",
    trustScore: 95,
    location: "Beirut, Ras Beirut",
    avatarColor: "bg-yellow-400",
  },
  {
    id: 2,
    name: "Sara Hanson",
    profession: "Physical Therapist",
    trustScore: 90,
    location: "Beirut, Hamra",
    avatarColor: "bg-teal-400",
  },
  {
    id: 3,
    name: "Michael Hanna",
    profession: "Plumber",
    trustScore: 89,
    location: "Beirut, Achrafieh",
    avatarColor: "bg-red-400",
  },
  {
    id: 4,
    name: "Sami Akhdar",
    profession: "Gardner",
    trustScore: 86,
    location: "Beirut, Raoucheh",
    avatarColor: "bg-green-400",
  },
  {
    id: 5,
    name: "Lara Hasan",
    profession: "Babysitter",
    trustScore: 96,
    location: "Beirut, Basta",
    avatarColor: "bg-purple-400",
  },
  {
    id: 6,
    name: "Sina Manson",
    profession: "Cleaning Lady",
    trustScore: 86,
    location: "Beirut, Hamra",
    avatarColor: "bg-gray-400",
  },
];

const sampleRating = {
  reliability: 4,
  punctuality: 5,
  priceHonesty: 4,
  total: 4.3,
  comment:
    "The job was done perfectly within a suitable period of time.",
};

export default function ServicesPage() {
  const [ratingOpen, setRatingOpen] = useState(false);

  return (
    <div className="flex justify-center min-h-screen p-8">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-8">
          Service Providers’ List
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onViewRating={() => setRatingOpen(true)}
            />
          ))}
        </div>
      </div>

      <ViewRating
        open={ratingOpen}
        onClose={() => setRatingOpen(false)}
        rating={sampleRating}
      />
    </div>
  );
}
