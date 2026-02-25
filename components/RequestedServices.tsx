"use client";

import { useEffect, useState, useCallback } from "react";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import RatePopup from "./Rate";

type JobStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface Job {
    _id: string;
    status: JobStatus;
    price?: number;
    completedDate?: string;
    createdAt: string;
    providerID: {
        _id: string;
        serviceType: string;
        userID: {
            userName: string;
            phone: string;
        };
    };
}

const statusStyles: Record<JobStatus, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

interface Props {
    userID: string;
}

export default function RequestedServices({ userID }: Props) {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Rate popup state
    const [rateOpen, setRateOpen] = useState(false);
    const [selectedJobID, setSelectedJobID] = useState("");
    const [selectedProviderID, setSelectedProviderID] = useState("");

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/jobs?userID=${userID}`);
            if (!res.ok) throw new Error("Failed to fetch jobs");
            const data = await res.json();
            setJobs(data.jobs);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [userID]);

    useEffect(() => {
        if (!userID) return;
        fetchJobs();
    }, [userID, fetchJobs]);

    const openRatePopup = (job: Job) => {
        setSelectedJobID(job._id);
        setSelectedProviderID(job.providerID._id);
        setRateOpen(true);
    };

    const closeRatePopup = () => {
        setRateOpen(false);
        setSelectedJobID("");
        setSelectedProviderID("");
    };

    return (
        <>
            <RatePopup
                isOpen={rateOpen}
                onClose={closeRatePopup}
                jobID={selectedJobID}
                userID={userID}
                providerID={selectedProviderID}
                onSuccess={fetchJobs}
            />

            <div className="rounded-2xl border border-gray-200 bg-white shadow-md">
                {/* Header */}
                <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                    <WorkOutlineIcon className="text-purple-500" fontSize="small" />
                    <h2 className="text-lg font-bold text-gray-900">Requested Services</h2>
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
                        No services requested yet.
                    </p>
                )}

                {/* Table */}
                {!loading && jobs.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    <th className="px-6 py-3">Service</th>
                                    <th className="px-6 py-3">Provider</th>
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
                                        <td className="px-6 py-4 font-medium text-gray-800 capitalize">
                                            {job.providerID?.serviceType ?? "—"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {job.providerID?.userID?.userName ?? "—"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {job.providerID?.userID?.phone ?? "—"}
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
                                                    onClick={() => openRatePopup(job)}
                                                    className="rounded-full bg-purple-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-purple-700 transition-colors"
                                                >
                                                    Done
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