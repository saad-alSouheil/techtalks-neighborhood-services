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
    const handleModalSubmitQuote = useCallback(async (jobID: string, price: number) => {
        try {
            const res = await fetch("/api/jobs", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobID, price }), // Just set price, keep status pending
            });
            if (!res.ok) throw new Error("Failed to submit quote");
            // refresh list
            if (providerID) await fetchJobs(providerID);
        } catch (err: unknown) {
            console.error("Error submitting quote:", err);
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

            <div className="rounded-3xl border border-gray-200 bg-white shadow-lg overflow-hidden mt-6">
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">My Jobs</h2>
                    {jobs.length > 0 && (
                        <span className="bg-gray-100 text-gray-600 font-semibold px-4 py-1.5 rounded-full text-sm">
                            {jobs.length} total
                        </span>
                    )}
                </div>

                {/* States */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0065FF]"></div>
                    </div>
                )}
                {error && (
                    <div className="mx-8 my-6 p-4 bg-red-50 rounded-2xl flex items-center text-red-600 text-sm font-medium">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}
                {!loading && !error && jobs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No jobs yet</h3>
                        <p className="text-gray-500 max-w-sm">You haven&apos;t been hired for any services. Once a client books you, it will show up here.</p>
                    </div>
                )}

                {/* Table */}
                {!loading && jobs.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-8 py-5 text-center">Client</th>
                                    <th className="px-8 py-5 text-center">Date Booked</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                    <th className="px-8 py-5 text-center">Action</th>
                                    <th className="px-8 py-5 text-center">Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/80">
                                {jobs.map((job) => (
                                    <tr key={job._id} className="hover:bg-gray-50/60 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-start w-48 mx-auto gap-4">
                                                <div className="h-9 w-9 rounded-full bg-[#f0f4ff] flex items-center justify-center text-[#0065FF] font-bold text-[13px] shrink-0">
                                                    {(job.userID?.userName ?? "U").charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <span className="font-semibold text-gray-700 text-[15px] truncate">
                                                        {job.userID?.userName ?? "—"}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {job.userID?.phone ?? "No phone"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-gray-500 font-medium text-center">
                                            {new Date(job.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span
                                                className={`inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase ${statusStyles[job.status]}`}
                                            >
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <button
                                                onClick={() => {
                                                    setSelectedJob(job);
                                                    setIsJobReqOpen(true);
                                                }}
                                                className="rounded-full bg-[#0065FF] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0052cc] transition-colors"
                                            >
                                                Details
                                            </button>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            {job.status === "completed" ? (
                                                <button
                                                    onClick={() => openRating(job._id)}
                                                    className="rounded-full bg-[#FFD665] p-2 shadow-sm hover:bg-[#FF8C00] transition-colors flex items-center justify-center mx-auto"
                                                    title="View Rating"
                                                >
                                                    <StarIcon className="w-5 h-5 text-white" />
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">—</span>
                                            )}
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
                onSubmitQuote={handleModalSubmitQuote}
                onCancel={handleModalCancel}
            />
        </>
    );
}