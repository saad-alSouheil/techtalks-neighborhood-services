"use client";

import { useEffect, useState } from "react";

type JobStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface NeighborhoodRef {
    _id?: string;
    name?: string;
    city?: string;
}

interface UserRef {
    _id?: string;
    userName?: string;
    phone?: string;
    neighborhoodID?: NeighborhoodRef | null;
}

interface Job {
    _id: string;
    status: JobStatus;
    price?: number;
    createdAt: string;
    jobDesc?: string;
    userID?: UserRef;
}

interface Props {
    open: boolean;
    onClose: () => void;
    job: Job | null;
    onAccept: (jobID: string, price: number) => Promise<void>;
    onCancel: (jobID: string) => Promise<void>;
}

export default function JobReq({ open, onClose, job, onAccept, onCancel }: Props) {
    const [price, setPrice] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (job && job.price !== undefined) {
            setPrice(String(job.price));
        } else {
            setPrice("");
        }
    }, [job]);

    if (!open || !job) return null;

    const handleAccept = async () => {
        const p = parseFloat(price);
        if (isNaN(p) || p < 0) {
            alert("Please enter a valid price");
            return;
        }
        setSubmitting(true);
        try {
            await onAccept(job._id, p);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to accept job");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel this job?")) return;
        setSubmitting(true);
        try {
            await onCancel(job._id);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to cancel job");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold">Job Details</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <div className="mt-4 space-y-3 text-sm text-gray-700">
                    <div>
                        <div className="text-xs text-gray-500">Client</div>
                        <div className="font-medium">{job.userID?.userName ?? "—"}</div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500">Location</div>
                        <div className="font-medium">
                            {job.userID?.neighborhoodID?.name
                                ? `${job.userID?.neighborhoodID?.name}${job.userID?.neighborhoodID?.city ? `, ${job.userID?.neighborhoodID?.city}` : ''}`
                                : "—"}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500">Phone</div>
                        <div className="font-medium">{job.userID?.phone ?? "—"}</div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500">Job Description</div>
                        <div className="whitespace-pre-line text-gray-800">{job.jobDesc ?? "—"}</div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500">Price</div>
                        {job.status === "pending" ? (
                            <input
                                type="number"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="mt-1 w-36 rounded border border-gray-300 px-3 py-2"
                                placeholder="Enter price"
                            />
                        ) : (
                            <div className="mt-1 font-medium text-gray-800">
                                {job.price !== undefined ? `$${job.price}` : "—"}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Close
                    </button>

                    {job.status === "pending" && (
                        <>
                            <button
                                onClick={handleCancel}
                                disabled={submitting}
                                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAccept}
                                disabled={submitting}
                                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Accept
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
