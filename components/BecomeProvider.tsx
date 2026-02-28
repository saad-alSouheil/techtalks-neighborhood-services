"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

interface BecomeProviderPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BecomeProviderPopup({ isOpen, onClose }: BecomeProviderPopupProps) {
    const { user, setUser } = useAuthStore();
    const [service, setService] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const validServices = [
        "plumbing",
        "electrical",
        "carpentry",
        "painting",
        "cleaning",
        "gardening",
        "hvac",
        "roofing",
        "handyman",
        "moving",
        "appliance-repair",
        "pest-control",
        "other",
    ];

    const handleSubmit = async () => {
        if (!user) {
            setError("You must be logged in to become a provider.");
            return;
        }

        if (!service) {
            setError("Please select a service.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/providers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userID: user._id,
                    serviceType: service,
                    description: description,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to register as provider");
            }

            // Update auth store
            setUser({ ...user, isProvider: true });

            onClose();
            // Optional: reload the page to apply new provider state universally if needed
            window.location.reload();

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative w-full max-w-sm rounded-[24px] bg-white p-8 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <h2 className="mb-6 text-[32px] leading-tight font-bold text-[#0065FF]">
                    Become a Service <br /> Provider
                </h2>

                <div className="mb-6 border-b border-gray-200"></div>

                {error && (
                    <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
                )}

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <label className="text-base font-bold text-gray-900 w-24">Service</label>
                        <select
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 focus:border-[#0065FF] focus:outline-none focus:ring-1 focus:ring-[#0065FF] capitalize"
                            disabled={loading}
                        >
                            <option value="" disabled>Select a service type</option>
                            {validServices.map((s) => (
                                <option key={s} value={s}>
                                    {s.replace("-", " ")}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-base font-bold text-gray-900">
                            Add Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write a description about you and the services you do"
                            className="h-28 w-full resize-none rounded-md border border-gray-300 p-3 text-sm text-gray-600 focus:border-[#0065FF] focus:outline-none focus:ring-1 focus:ring-[#0065FF]"
                            disabled={loading}
                        ></textarea>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-full bg-[#0065FF] px-8 py-2.5 text-base font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Confirming..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}
