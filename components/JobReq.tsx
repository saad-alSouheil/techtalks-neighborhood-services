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
    onSubmitQuote: (jobID: string, price: number) => Promise<void>;
    onCancel: (jobID: string) => Promise<void>;
}

export default function JobReq({ open, onClose, job, onSubmitQuote, onCancel }: Props) {
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

    const handleSubmitQuote = async () => {
        const p = parseFloat(price);
        if (isNaN(p) || p < 0) {
            alert("Please enter a valid price");
            return;
        }
        setSubmitting(true);
        try {
            await onSubmitQuote(job._id, p);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to submit quote");
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
                    <h3 className="text-4xl text-[#FFA902] font-bold mb-4">Job Details</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <div className="mb-4 text-center border-b-2 border-gray-300"></div>

                <div className="mt-4 space-y-3 text-gray-900">
                    <div>
                        <div className="text-sm text-[#0065FF]">Client</div>
                        <div className="font-medium">{job.userID?.userName ?? "—"}</div>
                    </div>

                    <div>
                        <div className="text-sm text-[#0065FF]">Location</div>
                        <div className="font-medium">
                            {job.userID?.neighborhoodID?.name
                                ? `${job.userID?.neighborhoodID?.name}${job.userID?.neighborhoodID?.city ? `, ${job.userID?.neighborhoodID?.city}` : ''}`
                                : "—"}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-[#0065FF]">Phone</div>
                        <div className="font-medium">{job.userID?.phone ?? "—"}</div>
                    </div>

                    <div>
                        <div className="text-sm text-[#0065FF]">Description</div>
                        <div className="whitespace-pre-line text-gray-800">{job.jobDesc ?? "NO DESCRIPTION"}</div>
                    </div>

                    <div>
                        <div className="text-sm text-[#0065FF]">Price</div>
                        {job.status === "pending" && job.price === undefined ? (
                            <input
                                type="number"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="mt-1 w-25 rounded-full border border-gray-300 px-5 py-1"
                                placeholder="Set your price"
                            />
                        ) : (
                            <div className="mt-1 font-medium text-gray-800">
                                {job.price !== undefined ? `$${job.price}` : "—"}
                            </div>
                        )}
                        {job.status === "pending" && job.price !== undefined && (
                            <div className="mt-2 text-sm font-semibold text-[#FFA902] bg-yellow-50 px-3 py-1.5 rounded-md inline-block border border-yellow-200">
                                Awaiting Client Approval
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-center gap-3">


                    {job.status === "pending" && job.price === undefined && (
                        <>
                            <button
                                onClick={handleCancel}
                                disabled={submitting}
                                className="rounded-full bg-[#9102FF] text-white px-4 py-2 font-semibold hover:bg-[#7A00D9] transition-colors   "
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitQuote}
                                disabled={submitting}
                                className="rounded-full bg-[#FFA902] px-4 py-2 font-semibold text-white hover:bg-[#FF8C00] transition-colors"
                            >
                                Submit Quote
                            </button>
                        </>
                    )}
                    {job.status === "pending" && job.price !== undefined && (
                        <button
                            onClick={handleCancel}
                            disabled={submitting}
                            className="rounded-full bg-[#9102FF] text-white px-4 py-2 font-semibold hover:bg-[#7A00D9] transition-colors"
                        >
                            Cancel Job
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
