"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ProviderInfoCard, {
  type ProviderInfoCardData,
} from "@/components/ProviderInfoCard";
import ReviewCard from "@/components/ReviewCard";

type ApiProvider = {
  _id: string;
  serviceType: string;
  description?: string;
  trustScore: number;
  verification: boolean;
  userID?: {
    userName?: string;
    phone?: string;
  };
  neighborhoodID?: {
    name?: string;
    city?: string;
  };
};

type Review = {
  _id: string;
  userID?: {
    userName?: string;
  };
  createdAt?: string;
  comment?: string;
};

function serviceTypeToLabel(serviceType?: string) {
  const normalized = (serviceType ?? "").toLowerCase();
  const map: Record<string, string> = {
    electrical: "Electrician",
    plumbing: "Plumber",
    carpentry: "Carpenter",
    painting: "Painter",
    cleaning: "Cleaner",
    gardening: "Gardener",
    hvac: "HVAC Technician",
    roofing: "Roofer",
    handyman: "Handyman",
    moving: "Mover",
    "appliance-repair": "Appliance Repair",
    "pest-control": "Pest Control",
    other: "Service Provider",
  };

  if (map[normalized]) return map[normalized];

  return normalized
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function trustScoreToPercent(trustScore?: number) {
  if (typeof trustScore !== "number" || Number.isNaN(trustScore)) return undefined;
  if (trustScore <= 5) return Math.max(0, Math.min(100, Math.round((trustScore / 5) * 100)));
  return Math.max(0, Math.min(100, Math.round(trustScore)));
}

export default function ProviderProfilePage() {
  const params = useParams();
  const providerId = useMemo(() => {
    const raw = (params as Record<string, string | string[] | undefined>)?.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ApiProvider | null>(null);
  const [servicesPerformed, setServicesPerformed] = useState<number | undefined>(
    undefined
  );
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!providerId) return;
      setLoading(true);
      setError(null);

      try {
        const [providerRes, jobsRes, ratingsRes] = await Promise.all([
          fetch(`/api/providers/${encodeURIComponent(providerId)}`),
          fetch(
            `/api/jobs?providerID=${encodeURIComponent(
              providerId
            )}&status=completed`
          ),
          fetch(`/api/rating?providerID=${encodeURIComponent(providerId)}`),
        ]);

        if (!providerRes.ok) {
          const msg =
            providerRes.status === 404 ? "Provider not found." : "Failed to load provider.";
          throw new Error(msg);
        }

        const providerJson = (await providerRes.json()) as ApiProvider;
        const jobsJson = (await jobsRes.json()) as { jobs?: unknown[] };
        const ratingsJson = (await ratingsRes.json()) as { ratings?: Review[] };

        if (cancelled) return;
        setProvider(providerJson);
        setServicesPerformed(
          Array.isArray(jobsJson?.jobs) ? jobsJson.jobs.length : undefined
        );
        setReviews(Array.isArray(ratingsJson?.ratings) ? ratingsJson.ratings : []);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [providerId]);

  const cardData: ProviderInfoCardData | null = useMemo(() => {
    if (!provider) return null;

    const name = provider.userID?.userName?.trim() || "Unknown Provider";
    const professionLabel = serviceTypeToLabel(provider.serviceType) || "Service Provider";
    const phone = provider.userID?.phone;
    const city = provider.neighborhoodID?.city;
    const neighborhood = provider.neighborhoodID?.name;
    const locationLabel =
      city && neighborhood ? `${city}, ${neighborhood}` : city || neighborhood;

    return {
      name,
      professionLabel,
      verified: Boolean(provider.verification),
      phone,
      locationLabel,
      trustScorePercent: trustScoreToPercent(provider.trustScore),
      servicesPerformed,
      description: provider.description,
    };
  }, [provider, servicesPerformed]);

  return (
    <div className="min-h-[60vh] flex justify-center">
      <div className="w-full max-w-10xl">
        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-red-600 font-medium">{error}</div>
        ) : cardData ? (
          <ProviderInfoCard
            provider={cardData}
            onHire={() => {
              // UI-only for now; wire to job request flow when available
              alert("Hire clicked");
            }}
          />
        ) : (
          <div className="text-gray-600">No provider data.</div>
        )}
        {/* Reviews Row */}
        <div className="flex bg-white rounded-2xl shadow-md p-6 mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {reviews && reviews.length > 0 ? (
              reviews.slice(0, 3).map((r: Review, idx: number) => {
                const name = r.userID?.userName || "Anonymous";
                const created = r.createdAt ? new Date(r.createdAt) : new Date();
                const date = `${String(created.getDate()).padStart(2, "0")} / ${String(
                  created.getMonth() + 1
                ).padStart(2, "0")} / ${created.getFullYear()}`;
                const text = r.comment || "";
                const colors: Array<"yellow" | "teal" | "red" | "purple" | "gray"> = [
                  "teal",
                  "purple",
                  "yellow",
                  "red",
                  "gray",
                ];
                const avatarColor = colors[idx % colors.length];

                return (
                  <ReviewCard
                    key={r._id || idx}
                    name={name}
                    date={date}
                    text={text}
                    avatarColor={avatarColor}
                  />
                );
              })
            ) : (
              <div className="text-gray-500">No reviews yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}