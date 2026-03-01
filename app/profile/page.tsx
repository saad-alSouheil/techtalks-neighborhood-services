"use client";

import { useEffect, useState } from "react";
import { useAuthStore, AuthState } from "@/store/useAuthStore";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarsIcon from "@mui/icons-material/Stars";
import RequestedServices from "@/components/RequestedServices";
import MyJobs from "@/components/MyJobs";

const Profile = () => {
  const user = useAuthStore((state: AuthState) => state.user);

  const [providerDetails, setProviderDetails] = useState<{
    _id: string;
    serviceType: string;
    description: string;
    trustScore?: number;
  } | null>(null);

  useEffect(() => {
    if (user?.isProvider && user?._id) {
      // Fetch provider details by user ID
      fetch(`/api/providers?userID=${user._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.providers && data.providers.length > 0) {
            setProviderDetails(data.providers[0]);
          }
        })
        .catch((err) => console.error("Error fetching provider details:", err));
    }
  }, [user]);

  const profile = {
    name: user?.userName ?? "Guest",
    phone: "80 546 456",
    location: "Beirut, Ras Beirut",
    profession: user?.isProvider ? (providerDetails?.serviceType ?? "Service Provider") : "Client",
    description: providerDetails?.description ?? "Member of the TechTalks Neighborhood Services platform.",
  };

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
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              {user?.isProvider && (providerDetails?.trustScore ?? 0) >= 4 && (
                <VerifiedIcon className="h-6 w-6 text-yellow-500" titleAccess="Top Rated Provider" />
              )}
            </div>

            {/* Profession and Trust Score */}
            <div className="flex items-center gap-4">
              <p className="text-lg font-medium text-gray-600">{profile.profession}</p>
              {user?.isProvider && providerDetails?.trustScore !== undefined && (
                <div className="flex items-center gap-1 text-[#FFA902] font-semibold bg-orange-50 px-3 py-1 rounded-full border border-orange-100 shadow-sm">
                  <StarsIcon className="h-5 w-5" />
                  <span>{providerDetails.trustScore > 0 ? providerDetails.trustScore.toFixed(1) : "New"}</span>
                </div>
              )}
            </div>

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
            {user?.isProvider && (
              <div>
                <h2 className="mb-2 text-base font-semibold text-gray-800">Description</h2>
                <p className="whitespace-pre-line text-gray-600">
                  {profile.description || "No description provided."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* My Jobs Table - For Providers */}
      {user?.isProvider && <MyJobs />}

      {/* Requested Services Table */}
      {user?._id && <RequestedServices userID={user._id} />}
    </div>
  );
};

export default Profile;