"use client";

import { useAuthStore, AuthState } from "@/store/useAuthStore";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RequestedServices from "@/components/RequestedServices";

const Profile = () => {
  const user = useAuthStore((state: AuthState) => state.user);

  const profile = {
    name: user?.userName ?? "Guest",
    phone: "80 546 456",
    location: "Beirut, Ras Beirut",
    profession: user?.isProvider ? "Service Provider" : "Customer",
    description: "Member of the TechTalks Neighborhood Services platform.",
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
              <VerifiedIcon className="h-6 w-6 text-yellow-500" />
            </div>

            {/* Profession */}
            <p className="text-lg font-medium text-gray-600">{profile.profession}</p>

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
              <h2 className="mb-2 text-base font-semibold text-gray-800">Description</h2>
              <p className="whitespace-pre-line text-gray-600">{profile.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Requested Services Table */}
      {user?._id && <RequestedServices userID={user._id} />}
    </div>
  );
};

export default Profile;
