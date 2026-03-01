interface ReviewCardProps {
  name: string;
  date: string;
  text: string;
  avatarColor?: "yellow" | "teal" | "red" | "purple" | "gray";
}

export default function ReviewCard({
  name,
  date,
  text,
  avatarColor = "yellow",
}: ReviewCardProps) {
  const colorMap: Record<string, string> = {
    yellow: "bg-[#F6C34A]",
    teal: "bg-[#3EE7D8]",
    red: "bg-[#FF5B5B]",
    purple: "bg-[#B57BFF]",
    gray: "bg-[#C9C9C9]",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className={`h-12 w-12 rounded-full flex items-center justify-center relative ${colorMap[avatarColor]}`}
        >
          <div className="w-3 h-3 bg-white rounded-full absolute top-3" />
          <div className="w-5 h-2 bg-white rounded-b-md absolute bottom-3" />
        </div>

        <div>
          <div className="font-semibold text-gray-900 text-xl">
            {name}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {date}
          </div>
        </div>
      </div>

      {/* Text */}
      <p className="mt-4 text-lg text-gray-700 leading-relaxed">
        {text}
      </p>
    </div>
  );
}