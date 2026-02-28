"use client";

import { useEffect, useState, useCallback } from "react";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { useAuthStore } from "@/store/useAuthStore";
import ViewRating from "./ViewRating";

type JobStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface Job {
    _id: string;
    status: JobStatus;
    price?: number;
    completedDate?: string;
    createdAt: string;
    userID: {
        _id: string;
        userName: string;
        phone: string;
    };
}

const statusStyles: Record<JobStatus, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

export default function MyJobs() {
    const { user } = useAuthStore();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [providerID, setProviderID] = useState<string | null>(null);
    const [pendingPrices, setPendingPrices] = useState<Record<string, string>>({});

    // view rating state
    const [ratingOpen, setRatingOpen] = useState(false);
    const [currentRating, setCurrentRating] = useState<{
        reliability: number;
        punctuality: number;
        priceHonesty: number;
        total: number;
        comment?: string;
    } | null>(null);

    // Fetch provider ID for the current user
    const fetchProviderID = useCallback(async (userId: string) => {
        try {
            const res = await fetch(`/api/providers?userID=${userId}`);
            if (!res.ok) throw new Error("Failed to fetch provider");
            const data = await res.json();
            if (data.providers && data.providers.length > 0) {
                setProviderID(data.providers[0]._id);
            } else {
                setError("No provider profile found. Please create a provider profile first.");
            }
        } catch (err: unknown) {
            console.error("Error fetching provider:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    }, []);

    // Fetch jobs for the provider
    const fetchJobs = useCallback(async (pID: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/jobs?providerID=${pID}`);
            if (!res.ok) throw new Error("Failed to fetch jobs");
            const data = await res.json();
            setJobs(data.jobs);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle accepting a pending job with a price
    const handleAccept = async (jobID: string) => {
        const priceStr = pendingPrices[jobID];
        const price = parseFloat(priceStr);
        if (isNaN(price) || price < 0) {
            setError("Please enter a valid price");
            return;
        }

        try {
            const res = await fetch("/api/jobs", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobID, status: "confirmed", price }),
            });
            if (!res.ok) throw new Error("Failed to accept job");
            setPendingPrices((prev) => ({ ...prev, [jobID]: "" }));
            fetchJobs(providerID!);
        } catch (err: unknown) {
            console.error("Error accepting job:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    };

    // Handle cancelling a pending job (no price set)
    const handleCancel = async (jobID: string) => {
        try {
            const res = await fetch("/api/jobs", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobID, status: "cancelled" }),
            });
            if (!res.ok) throw new Error("Failed to cancel job");
            // clear any entered price
            setPendingPrices((prev) => ({ ...prev, [jobID]: "" }));
            fetchJobs(providerID!);
        } catch (err: unknown) {
            console.error("Error cancelling job:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    };

    // Fetch and view rating for a completed job
    const openRating = async (jobID: string) => {
        try {
            const res = await fetch(`/api/rating?jobID=${jobID}`);
            if (!res.ok) throw new Error("Failed to fetch rating");
            const data = await res.json();
            const rating = data.ratings && data.ratings[0];
            if (rating) {
                const total =
                    (rating.reliability + rating.punctuality + rating.priceHonesty) / 3;
                setCurrentRating({
                    reliability: rating.reliability,
                    punctuality: rating.punctuality,
                    priceHonesty: rating.priceHonesty,
                    total,
                    comment: rating.comment,
                });
                setRatingOpen(true);
            } else {
                setError("No rating available for this job");
            }
        } catch (err: unknown) {
            console.error("Error fetching rating:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    };

    useEffect(() => {
        if (!user || !user._id) {
            setError("Please log in to view your jobs");
            return;
        }
        fetchProviderID(user._id);
    }, [user, fetchProviderID]);

    useEffect(() => {
        if (providerID) {
            fetchJobs(providerID);
        }
    }, [providerID, fetchJobs]);

    return (
        <>
            {/* rating popup */}
            <ViewRating open={ratingOpen} onClose={() => setRatingOpen(false)} rating={currentRating} />

            <div className="rounded-2xl border border-gray-200 bg-white shadow-md">
                {/* Header */}
                <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                    <WorkOutlineIcon className="text-purple-500" fontSize="small" />
                    <h2 className="text-lg font-bold text-gray-900">My Jobs</h2>
                    {jobs.length > 0 && (
                        <span className="ml-auto text-xs text-gray-400">{jobs.length} total</span>
                    )}
                </div>

                {/* States */}
                {loading && (
                    <p className="px-6 py-8 text-sm text-gray-400 text-center">Loading...</p>
                )}
                {error && (
                    <p className="px-6 py-8 text-sm text-red-500 text-center">Error: {error}</p>
                )}
                {!loading && !error && jobs.length === 0 && (
                    <p className="px-6 py-8 text-sm text-gray-400 text-center">
                        No jobs yet. Check back soon!
                    </p>
                )}

                {/* Table */}
                {!loading && jobs.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Phone</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Date Booked</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {jobs.map((job) => (
                                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {job.userID?.userName ?? "—"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {job.userID?.phone ?? "—"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {job.status === "pending" ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={pendingPrices[job._id] || ""}
                                                    onChange={(e) =>
                                                        setPendingPrices((prev) => ({
                                                            ...prev,
                                                            [job._id]: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="Price"
                                                    className="w-24 rounded border border-gray-300 px-2 py-1"
                                                />
                                            ) : job.price !== undefined ? (
                                                `$${job.price}`
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(job.createdAt).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[job.status]}`}
                                            >
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {job.status === "pending" && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleAccept(job._id)}
                                                        className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(job._id)}
                                                        className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                            
                                            {job.status === "completed" && (
                                                <button
                                                    onClick={() => openRating(job._id)}
                                                    className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
                                                >
                                                    View Rating
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}