"use client";

import { useAuthStore, AuthState } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import RequestedServices from "../../components/RequestedServices"; // Adjust the import path as needed

type JobStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface Job {
  _id: string;
  status: JobStatus;
  price?: number;
  completedDate?: string;
  createdAt: string;
  providerID: {
    serviceType: string;
    description?: string;
    trustScore: number;
    userID: {
      userName: string;
      phone: string;
    };
  };
}

const statusColors: Record<JobStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const Profile = () => {
  const user = useAuthStore((state: AuthState) => state.user);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);

  const profile = {
    name: user?.userName ?? "Guest",
    phone: "80 546 456",
    location: "Beirut, Ras Beirut",
    profession: user?.isProvider ? "Service Provider" : "Customer",
    description: "Member of the TechTalks Neighborhood Services platform.",
  };

  useEffect(() => {
    if (!user?._id) return;

    const fetchJobs = async () => {
      setLoadingJobs(true);
      setJobsError(null);
      try {
        const res = await fetch(`/api/jobs?userID=${user._id}`);
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data.jobs);
      } catch (err: unknown) {
        setJobsError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, [user?._id]);

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Profile Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex shrink-0 items-center justify-center rounded-full bg-purple-500 p-4">
            <PersonIcon className="h-16 w-16 text-white" />
          </div>

          <div className="flex-1 space-y-4">
            {/* Name with verification */}
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.name}
              </h1>
              <VerifiedIcon className="h-6 w-6 text-yellow-500" />
            </div>

            {/* Profession */}
            <p className="text-lg font-medium text-gray-600">
              {profile.profession}
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <PhoneIcon className="h-5 w-5 text-gray-500" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <LocationOnIcon className="h-5 w-5 text-gray-500" />
                <span>{profile.location}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="mb-2 text-base font-semibold text-gray-800">
                Description
              </h2>
              <p className="whitespace-pre-line text-gray-600">
                {profile.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requested Services Component */}
      <RequestedServices userId={user?._id} />

      {/* Jobs Section */}
   {/*    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center gap-2">
          <WorkIcon className="h-5 w-5 text-purple-500" />
          <h2 className="text-xl font-bold text-gray-900">My Jobs</h2>
        </div>

        {loadingJobs && (
          <p className="text-gray-500 text-sm">Loading jobs...</p>
        )}

        {jobsError && (
          <p className="text-red-500 text-sm">Error: {jobsError}</p>
        )}

        {!loadingJobs && !jobsError && jobs.length === 0 && (
          <p className="text-gray-500 text-sm">No jobs found.</p>
        )}

        {!loadingJobs && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 capitalize">
                      {job.providerID?.serviceType ?? "Service"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Provider: {job.providerID?.userID?.userName ?? "N/A"} &mdash;{" "}
                      {job.providerID?.userID?.phone}
                    </p>
                    {job.price !== undefined && (
                      <p className="text-sm text-gray-600">
                        Price: <span className="font-medium">${job.price}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Booked on:{" "}
                      {new Date(job.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    {job.completedDate && (
                      <p className="text-xs text-gray-400">
                        Completed:{" "}
                        {new Date(job.completedDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
*/}
                  {/* Status Badge 
                  <span
                    className={`self-start rounded-full px-3 py-1 text-xs font-semibold capitalize sm:self-center ${statusColors[job.status]}`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>*/}
    </div>
  );
};

export default Profile;