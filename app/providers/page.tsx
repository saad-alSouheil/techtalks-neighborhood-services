"use client";

import { useEffect, useState } from "react";
import ProviderCard, { ServiceProvider } from "@/components/ProviderCard";
import SearchIcon from '@mui/icons-material/Search';

interface ApiProvider {
  _id: string;
  serviceType: string;
  trustScore: number;
  userID: {
    userName: string;
  };
  neighborhoodID: {
    name: string;
    city: string;
  };
}

interface Neighborhood {
  id: string;
  name: string;
  city: string;
}

export default function ServicesPage() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

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

  const fetchProviders = async () => {
    try {
      setLoading(true);

      const query = [];

      if (search) {
        const value = search.toLowerCase();
        query.push(`service=${encodeURIComponent(value)}`);
        query.push(`query=${encodeURIComponent(value)}`);
      }
      if (selectedNeighborhood)
        query.push(`neighborhood=${encodeURIComponent(selectedNeighborhood)}`);

      const queryString = query.length ? `?${query.join("&")}` : "";

      const res = await fetch(`/api/providers${queryString}`);
      const data = await res.json();

      const formatted: ServiceProvider[] = data.providers.map(
        (provider: ApiProvider) => ({
          id: provider._id,
          name: provider.userID.userName,
          profession: provider.serviceType,
          trustScore: provider.trustScore,
          location: `${provider.neighborhoodID.city}, ${provider.neighborhoodID.name}`,
          avatarColor: getRandomColor(),
        })
      );

      setProviders(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Neighborhoods
  const fetchNeighborhoods = async () => {
    try {
      const res = await fetch("/api/neighborhood");
      const data = await res.json();
      setNeighborhoods(data);
    } catch (error) {
      console.error("Error fetching neighborhoods:", error);
    }
  };

  useEffect(() => {
    fetchProviders();
    fetchNeighborhoods();
  }, []);

  const handleSearch = () => {
    fetchProviders();
  };

  return (
    <div className="flex justify-center min-h-screen bg-[#F7F7F7]">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-7xl">
        
        {/* Top Action Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8 bg-[#F7F7F7] rounded-lg p-4 pl-4 pr-4 shadow-sm">
          
          {/* Become Provider Button */}
          <button className="bg-[#0065FF] text-white px-6 py-2 rounded-full min-w-[300px] font-medium hover:bg-blue-800 transition">
            Become a provider
          </button>

          {/* Search Bar */}
          <div className="relative w-full max-w-md bg-white rounded-full">
            <input
              type="text"
              placeholder="Search Service Type"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full border border-gray-300 rounded-full pl-5 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSearch}
              className="absolute right-4 top-2.5 w-5 h-5 text-gray-500 cursor-pointer"
            >
            <SearchIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Neighborhood Dropdown */}
          <select
            value={selectedNeighborhood}
            onChange={(e) => {
              setSelectedNeighborhood(e.target.value);
            }}
            className="font-bold border border-gray-300 rounded-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0065FF] min-w-[300px] bg-white"
          >
            <option value="">Neighbourhood</option>
            {neighborhoods.map((neighborhood) => (
              <option key={neighborhood.id} value={neighborhood.name}>
                {neighborhood.city}, {neighborhood.name}
              </option>
            ))}
          </select>
        </div>

        {/* Providers Grid */}
        {loading ? (
          <p>Loading...</p>
        ) : providers.length === 0 ? (
          <p className="text-gray-500">No providers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}