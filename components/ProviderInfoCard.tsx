import VerifiedIcon from '@mui/icons-material/Verified';import FmdGoodIcon from '@mui/icons-material/FmdGood';import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIcon from '@mui/icons-material/Phone';import StarsIcon from "@mui/icons-material/Stars";
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
export type ProviderInfoCardData = {
  name: string;
  professionLabel: string;
  verified: boolean;
  phone?: string;
  locationLabel?: string;
  trustScore: number;
  servicesPerformed?: number;
  description?: string;
};

export default function ProviderInfoCard({
  provider,
  onHire,
}: {
  provider: ProviderInfoCardData;
  onHire?: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-md px-8 py-8">
      <div className="flex gap-6">
        
        {/* Avatar */}
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0">
          <PersonOutlineIcon className="text-white text-4xl" />
        </div>

        {/* Main Info */}
        <div className="flex-1 flex justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-bold text-gray-900">
                {provider.name}
              </h2>
              {provider.verified && (
                <VerifiedIcon className="text-[#FFA902] w-15 h-15" />
              )}
            </div>

            <p className="text-lg text-gray-500 mt-1">
              {provider.professionLabel}
            </p>

            <div className="mt-6 space-y-3 text-gray-700">
              {provider.phone && (
                <div className="flex items-center gap-3 font-semibold text-xl">
                  <PhoneIcon className="text-[#0065FF]" />
                  {provider.phone}
                </div>
              )}

              {provider.locationLabel && (
                <div className="flex items-center gap-3 font-semibold text-xl">
                  <FmdGoodIcon className="text-[#0065FF]" />
                  {provider.locationLabel}
                </div>
              )}
            </div>
          </div>

          {/* Right Info */}
          <div className=" mt-25 mr-35 flex flex-col justify-center gap-4">
            {typeof provider.trustScore === "number" && (
              <div className="flex items-center gap-2 text-xl ">
                <StarsIcon className="text-[#FFA902]" />
                <span>
                  <span className="font-semibold">Trust Score :</span>{" "}
                  {provider.trustScore}
                </span>
              </div>
            )}

            {typeof provider.servicesPerformed === "number" && (
              <div className="flex items-center gap-2 text-xl">
                <WorkHistoryIcon className="text-[#FFA902]" />
                <span>
                  <span className="font-semibold">
                    Services Performed :
                  </span>{" "}
                  {provider.servicesPerformed}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6" />

      {/* Description + Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-[#0065FF] font-bold mb-2 ml-3 text-lg">
            Description
          </h3>
          <p className="ml-3 whitespace-pre-line max-w-xl">
            {provider.description || "—"}
          </p>
        </div>

        <button
          onClick={onHire}
          className="mr-40 bg-[#FF020F] hover:bg-[#CC000C] text-white px-20 py-3 rounded-3xl font-semibold text-lg transition"
        >
          Hire
        </button>
      </div>
    </div>
  );
}