"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import ViewRating from "./ViewRating";
import JobReq from "./JobReq";
import StarIcon from '@mui/icons-material/Star';

type JobStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface UserRef {
    _id?: string;
    userName?: string;
    phone?: string;
    location?: string;
}

interface Job {
    _id: string;
    status: JobStatus;
    price?: number;
    completedDate?: string;
    createdAt: string;
    jobDesc?: string;
    userID?: UserRef;
}

const statusStyles: Record<JobStatus, string> = {
    pending: "bg-[#F5FF66] text-yellow-800",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-[#BFFFDF] text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

export default function MyJobs() {
    const { user } = useAuthStore();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [providerID, setProviderID] = useState<string | null>(null);

    // modal state for viewing details / accepting / cancelling
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isJobReqOpen, setIsJobReqOpen] = useState(false);

    // view rating state
    const [ratingOpen, setRatingOpen] = useState(false);
    const [currentRating, setCurrentRating] = useState<{
        reliability: number;
        punctuality: number;
        priceHonesty: number;
        total: number;
        comment?: string;
    } | null>(null);

    // Empty rating popup state
    const [emptyRatingOpen, setEmptyRatingOpen] = useState(false);

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

    // Handlers invoked by JobReq modal
    const handleModalAccept = useCallback(async (jobID: string, price: number) => {
        try {
            const res = await fetch("/api/jobs", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobID, status: "confirmed", price }),
            });
            if (!res.ok) throw new Error("Failed to accept job");
            // refresh list
            if (providerID) await fetchJobs(providerID);
        } catch (err: unknown) {
            console.error("Error accepting job:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
            throw err;
        }
    }, [providerID, fetchJobs]);

    const handleModalCancel = useCallback(async (jobID: string) => {
        try {
            const res = await fetch("/api/jobs", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobID, status: "cancelled" }),
            });
            if (!res.ok) throw new Error("Failed to cancel job");
            if (providerID) await fetchJobs(providerID);
        } catch (err: unknown) {
            console.error("Error cancelling job:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
            throw err;
        }
    }, [providerID, fetchJobs]);

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
                setEmptyRatingOpen(true);
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

            {/* empty rating popup */}
            {emptyRatingOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="empty-rating-title"
                >
                    <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
                        <div className="mb-4 text-orange-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 id="empty-rating-title" className="mb-2 text-xl font-bold text-gray-800">
                            No Rating Yet
                        </h2>
                        <p className="mb-6 text-gray-600">
                            The customer hasn&apos;t provided a rating for this job yet. Check back later!
                        </p>
                        <button
                            onClick={() => setEmptyRatingOpen(false)}
                            className="rounded-full bg-[#FFA902] px-6 py-2 font-semibold text-white hover:bg-[#FF8C00] transition-colors"
                        >
                            Okay
                        </button>
                    </div>
                </div>
            )}

            <div className="px-6 py-4 rounded-2xl border border-gray-200 bg-white shadow-md">
                {/* Header */}
                <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900">My Jobs</h2>
                    {jobs.length > 0 && (
                        <span className="ml-auto text-sm text-[#FFA902]">{jobs.length} total</span>
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
                    <div className="overflow-x-auto mt-4">
                        <table className="w-3/4 min-w-max table-auto justify-center mx-auto">
                            <thead>
                                <tr className="bg-[#FFD665] h-15 text-center text-xl text-black font-semibold tracking-wide shadow-sm">
                                    <th className="px-6 py-3 ">Client</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3 "></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#FFA902]">
                                {jobs.map((job) => (
                                    <tr
                                        key={job._id}
                                        className={`transition-colors hover:bg-[#F2F2F2] ${
                                            job.status === "pending" ? "bg-[#FFE665]" : ""
                                        }`}
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-800 text-center">
                                            {job.userID?.userName ?? "—"}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[job.status]}`}
                                            >
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-center">
                                            {new Date(job.createdAt).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-20">
                                                <button
                                                    onClick={() => {
                                                        setSelectedJob(job);
                                                        setIsJobReqOpen(true);
                                                    }}
                                                    className={`rounded-full bg-[#0065FF] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#004CCE] transition-colors ${
                                            job.status === "pending" ? "bg-[#FFA902] hover:bg-[#FF8C00]" : ""
                                        }`}
                                                >
                                                    Details
                                                </button>

                                                {job.status === "completed" && (
                                                    <button
                                                        onClick={() => openRating(job._id)}
                                                        className="rounded-full bg-[#FFA902] px-1.5 py-1.5 text-xs font-semibold text-white hover:bg-[#FF8C00] transition-colors"
                                                    >
                                                        <StarIcon className="w-1 h-1  inline" />                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Job details modal */}
            <JobReq
                open={isJobReqOpen}
                onClose={() => {
                    setIsJobReqOpen(false);
                    setSelectedJob(null);
                }}
                job={selectedJob}
                onAccept={handleModalAccept}
                onCancel={handleModalCancel}
            />
        </>
    );
}