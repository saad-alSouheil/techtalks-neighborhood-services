import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import StarsIcon from "@mui/icons-material/Stars";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

export type ProviderInfoCardData = {
  name: string;
  professionLabel: string;
  verified: boolean;
  phone?: string;
  locationLabel?: string;
  trustScorePercent?: number;
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
    <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-5 flex gap-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0">
          <PersonOutlineIcon className="text-white" />
        </div>

        <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 truncate">
                {provider.name}
              </h2>
              {provider.verified ? (
                <CheckCircleIcon className="text-[#FFA902]" fontSize="small" />
              ) : null}
            </div>
            <p className="text-gray-500 -mt-0.5">{provider.professionLabel}</p>

            <div className="mt-3 space-y-1 text-sm text-gray-700">
              {provider.phone ? (
                <div className="flex items-center gap-2">
                  <PhoneInTalkOutlinedIcon
                    className="text-[#0065FF]"
                    fontSize="small"
                  />
                  <span className="truncate">{provider.phone}</span>
                </div>
              ) : null}

              {provider.locationLabel ? (
                <div className="flex items-center gap-2">
                  <LocationOnOutlinedIcon
                    className="text-[#0065FF]"
                    fontSize="small"
                  />
                  <span className="truncate">{provider.locationLabel}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="min-w-[230px] flex flex-col justify-center gap-3">
            {typeof provider.trustScorePercent === "number" ? (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <StarsIcon className="text-[#FFA902]" fontSize="small" />
                <span>
                  <span className="font-semibold">Trust Score :</span>{" "}
                  {provider.trustScorePercent}%
                </span>
              </div>
            ) : null}

            {typeof provider.servicesPerformed === "number" ? (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <WorkOutlineIcon className="text-[#FFA902]" fontSize="small" />
                <span>
                  <span className="font-semibold">Services Performed:</span>{" "}
                  {provider.servicesPerformed}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      <div className="p-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[#0065FF]">Description</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line break-words">
            {provider.description?.trim() ? provider.description : "—"}
          </p>
        </div>

        <button
          type="button"
          onClick={onHire}
          className="shrink-0 bg-[#E10000] hover:bg-[#C70000] text-white px-10 py-2 rounded-md font-semibold shadow-sm transition-colors"
        >
          Hire
        </button>
      </div>
    </div>
  );
}

