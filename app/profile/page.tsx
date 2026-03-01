"use client";

import { useEffect, useState } from "react";
import { useAuthStore, AuthState } from "@/store/useAuthStore";
import VerifiedIcon from "@mui/icons-material/Verified";
import PhoneIcon from "@mui/icons-material/Phone";
import StarsIcon from "@mui/icons-material/Stars";
import RequestedServices from "@/components/RequestedServices";
import MyJobs from "@/components/MyJobs";
import FmdGoodIcon from '@mui/icons-material/FmdGood';

const Profile = () => {
  const user = useAuthStore((state: AuthState) => state.user);

  const [providerDetails, setProviderDetails] = useState<{
    _id: string;
    serviceType: string;
    description: string;
    trustScore?: number;
  } | null>(null);

  // Local contact info fetched from the server (falls back to auth store)
  const [phone, setPhone] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [avatarColor, setAvatarColor] = useState<string>("");

  const colors = [
    "bg-[#00FFE1]",
    "bg-[#FFD279]",
    "bg-[#ff5e5e]",
    "bg-[#02FF80]",
    "bg-[#efbbfa]",
    "bg-[#fcea42]",
  ];

  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  useEffect(() => {
    // Set avatar color on mount
    setAvatarColor(getRandomColor());

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

  useEffect(() => {
    if (!user?._id) return;

    // Fetch the latest user contact info from the server
    fetch(`/api/users/${user._id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then((data) => {
        if (data.phone) setPhone(data.phone);

        const nbId = data.neighborhoodID;
        if (nbId) {
          // Fetch neighborhood list and find the matching one
          fetch('/api/neighborhood')
            .then((r) => r.json())
            .then((list) => {
              const match = list.find((n: any) => String(n.id) === String(nbId));
              if (match) {
                setLocationName(`${match.name}${match.city ? `, ${match.city}` : ''}`);
              }
            })
            .catch((err) => console.error('Error fetching neighborhoods:', err));
        }
      })
      .catch((err) => console.error('Error fetching user info:', err));
  }, [user?._id]);

  const profile = {
    name: user?.userName ?? "Guest",
    phone: phone ?? user?.phone ?? "N/A",
    location: locationName ?? (user?.neighborhoodID?.name ? `${user.neighborhoodID.name}${user.neighborhoodID.city ? `, ${user.neighborhoodID.city}` : ''}` : "N/A"),
    profession: user?.isProvider ? (providerDetails?.serviceType ?? "Service Provider") : "Client",
    description: providerDetails?.description ?? "Member of the TechTalks Neighborhood Services platform.",
  };

  return (
    <div className="w-full max-w-6xl space-y-6 justify-center mx-auto">
      {/* Profile Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-semibold ${avatarColor}`}>
            {user?.userName?.charAt(0).toUpperCase() ?? "U"}
          </div>

          <div className="flex-1 space-y-3">
            {/* Name with verification */}
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold text-gray-900">{profile.name}</h1>
              {user?.isProvider && (providerDetails?.trustScore ?? 0) >= 4 && (
                <VerifiedIcon className="h-15 w-15 text-[#FFA902]" titleAccess="Top Rated Provider" />
              )}
            </div>
              <p className="text-lg font-medium text-gray-600">{profile.profession.toLocaleUpperCase()}</p>

            {/* Contact info */}
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <PhoneIcon className="h-5 w-5 text-[#007BFF]" />
                <span className="text-lg text-black font-bold">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FmdGoodIcon className="h-5 w-5 text-[#007BFF]" />
                <span className="text-lg text-black font-bold">{profile.location}</span>
              </div>

              {user?.isProvider && providerDetails?.trustScore !== undefined && (
                <div className="ml-6 flex items-center gap-1 text-[#FFA902] font-semibold px-3 py-1 rounded-full border border-orange-100 shadow-sm">
                  <StarsIcon className="h-5 w-5" />
                  <span>{providerDetails.trustScore > 0 ? providerDetails.trustScore.toFixed(1) : "New"}</span>
                </div>
              )}
            </div>

            <div className="border border-gray-200 mb-6"></div>

            {/* Description */}
            {user?.isProvider && (
              <div>
                <h2 className="mb-2 text-xl text-[#007BFF] font-semibold">Description</h2>
                <p className="whitespace-pre-line text-black text-lg">
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