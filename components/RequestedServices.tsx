"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";

interface Provider {
  _id: string;
  name?: string;
  userID?: {
    userName: string;
    email?: string;
    phone?: string;
  };
  serviceType?: string;
  description?: string;
  trustScore?: number;
  verification?: boolean;
}

interface Job {
  _id: string;
  providerID: Provider | string;
  price: number | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  completedDate: string | null;
  createdAt: string;
}

interface RequestedServicesProps {
  userId?: string;
  initialJobs?: Job[];
}

const statusLabels = {
  pending: "Requested",
  confirmed: "Accepted",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function RequestedServices({
  userId,
  initialJobs,
}: RequestedServicesProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs || []);
  const [isLoading, setIsLoading] = useState(!initialJobs);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (initialJobs || !userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/jobs?userID=${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [userId, initialJobs]);

  const handleMarkDone = async (jobId: string) => {
    try {
      const now = new Date().toISOString();

      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
          completedDate: now,
        }),
      });

      if (response.ok) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId
              ? { ...job, status: "completed", completedDate: now }
              : job,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to mark job as done:", error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "- / - / ----";

    try {
      const date = new Date(dateString);
      return format(date, "d/M/yyyy");
    } catch {
      return "- / - / ----";
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return "-- $";
    return `${price} $`;
  };

  const getProviderName = (provider: Provider | string) => {
    if (!provider) return "John Smith";

    if (typeof provider === "string") return "John Smith";

    if (provider.userID?.userName) return provider.userID.userName;

    if (provider.name) return provider.name;

    return "John Smith";
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Requested Services</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Requested Services</h2>
        <div className="bg-red-100 text-red-600 p-4 rounded-lg">
          Error loading services: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gray-100 rounded-2xl">
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Requested Services
        </h2>

        {/* Header */}
        <div className="grid grid-cols-4 bg-gray-200 border border-gray-400 rounded-lg px-6 py-3 text-sm font-semibold text-gray-700 mb-4">
          <div className="border-r border-gray-400 pr-4">Provider</div>
          <div className="border-r border-gray-400 pr-4">Price</div>
          <div className="border-r border-gray-400 pr-4">Status</div>
          <div>Completion Date</div>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No requested services found
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const isCompleted = job.status === "completed";
              const isConfirmed = job.status === "confirmed";
              const isPending = job.status === "pending";

              return (
                <div
                  key={job._id}
                  className={`
                    grid grid-cols-4 items-center px-6 py-4 rounded-lg shadow-sm
                    transition
                    ${isCompleted ? "bg-[#F4B740]" : ""}
                    ${isConfirmed ? "bg-[#D9F05A]" : ""}
                    ${isPending ? "bg-gray-200" : ""}
                  `}
                >
                  {/* Provider */}
                  <div className="font-medium text-gray-800">
                    {getProviderName(job.providerID)}
                  </div>

                  {/* Price */}
                  <div className="text-gray-800">{formatPrice(job.price)}</div>

                  {/* Status */}
                  <div className="font-medium text-gray-800">
                    {statusLabels[job.status]}
                  </div>

                  {/* Date + Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">
                      {formatDate(job.completedDate)}
                    </span>

                    {isConfirmed && (
                      <button
                        onClick={() => handleMarkDone(job._id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-1 rounded-md transition"
                      >
                        Done
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
