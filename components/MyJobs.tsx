"use client";

import { useEffect, useState, useCallback } from "react";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { useAuthStore } from "@/store/useAuthStore";

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

    // Handle marking job as completed
    const handleMarkDone = async (jobID: string) => {
        try {
            const res = await fetch("/api/jobs", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jobID,
                    status: "completed",
                }),
            });
            if (!res.ok) throw new Error("Failed to update job");
            fetchJobs(providerID!);
        } catch (err: unknown) {
            console.error("Error updating job:", err);
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
                                            {job.price !== undefined ? `$${job.price}` : "—"}
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
                                            {job.status === "confirmed" && (
                                                <button
                                                    onClick={() => handleMarkDone(job._id)}
                                                    className="rounded-full bg-purple-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-purple-700 transition-colors"
                                                >
                                                    Mark Done
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