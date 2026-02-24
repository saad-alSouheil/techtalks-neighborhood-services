import StarsIcon from '@mui/icons-material/Stars';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { useRouter } from "next/navigation";
export interface ServiceProvider {
  id: number;
  name: string;
  profession: string;
  trustScore: number;
  location: string;
  avatarColor: string; // Tailwind color class for avatar background
}

interface Props {
  provider: ServiceProvider;
}

export default function ProviderCard({ provider }: Props) {
  const router = useRouter();

  const goToProfile = () => {
    router.push(`/providers/${provider.id}`);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-gray-300 max-w-80 shadow-md p-6 w-full hover:shadow-lg transition duration-300 cursor-pointer"
      onClick={goToProfile}
    >
      {/* Avatar + Name */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold ${provider.avatarColor}`}
        >
          {provider.name.charAt(0)}
        </div>

        <div>
          <h3 className="font-bold text-xl">{provider.name}</h3>
          <p className="text-sm text-gray-500">{provider.profession.toUpperCase()}</p>
        </div>
      </div>

      {/* Trust Score */}
      <div className="flex items-center gap-2 text-sm mb-2">
        <StarsIcon className="w-5 h-5 text-[#FFA902]" />
        <span className="font-bold text-lg">
          <span>Trust Score :</span>{" "}
          {provider.trustScore}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <PlaceOutlinedIcon className="w-5 h-5 text-[#0065FF]" />
        <span className='font-bold text-lg'>{provider.location}</span>
      </div>

      {/* Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goToProfile();
        }}
        className="ml-12 bg-yellow-400 hover:bg-[#FFA902] text-white px-6 py-2 rounded-full text-sm font-medium transition"
      >
        Check out
      </button>
    </div>
  );
}
