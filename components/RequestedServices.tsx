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

            <div className="rounded-3xl border border-gray-200 bg-white shadow-lg overflow-hidden mt-6">
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-xl">
                            <WorkOutlineIcon className="text-purple-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Requested Services</h2>
                    </div>
                    {jobs.length > 0 && (
                        <span className="bg-gray-100 text-gray-600 font-semibold px-4 py-1.5 rounded-full text-sm">
                            {jobs.length} total
                        </span>
                    )}
                </div>

                {/* States */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                )}
                {error && (
                    <div className="mx-8 my-6 p-4 bg-red-50 rounded-2xl flex items-center text-red-600 text-sm font-medium">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}
                {!loading && !error && jobs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <WorkOutlineIcon className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No services yet</h3>
                        <p className="text-gray-500 max-w-sm">You haven&apos;t requested any services. Once you book a provider, it will show up here.</p>
                    </div>
                )}

                {/* Table */}
                {!loading && jobs.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-8 py-5 text-center">Provider</th>
                                    <th className="px-8 py-5 text-center">Service</th>
                                    <th className="px-8 py-5 text-center">Date Booked</th>
                                    <th className="px-8 py-5 text-center">Price</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                    <th className="px-8 py-5 text-center">Review</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/80">
                                {jobs.map((job) => (
                                    <tr key={job._id} className="hover:bg-gray-50/60 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-start w-48 mx-auto gap-4">
                                                <div className="h-9 w-9 rounded-full bg-[#f0f4ff] flex items-center justify-center text-[#0065FF] font-bold text-[13px] shrink-0">
                                                    {(job.providerID?.userID?.userName ?? "P").charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <span className="font-semibold text-gray-700 text-[15px] truncate">
                                                        {job.providerID?.userID?.userName ?? "—"}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {job.providerID?.userID?.phone ?? "No phone"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="font-semibold text-gray-900 capitalize text-base">
                                                {job.providerID?.serviceType ?? "—"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-gray-500 font-medium text-center">
                                            {new Date(job.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
                                            })}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="font-semibold text-gray-900">
                                                {job.price !== undefined ? `$${job.price}` : "—"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span
                                                className={`inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase ${statusStyles[job.status]}`}
                                            >
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            {job.status === "confirmed" ? (
                                                <button
                                                    onClick={() => openRatePopup(job)}
                                                    className="rounded-full bg-[#0065FF] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0052cc] transition-colors"
                                                >
                                                    Mark Done
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm italic group-hover:text-gray-500 transition-colors">
                                                    {job.status === "cancelled" ? "Unavailable" :
                                                        job.status === "completed" ? "Completed" : "Not ready"}
                                                </span>
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