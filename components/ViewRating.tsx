"use client";

type JobRating = {
  jobTitle: string;
  customerName?: string;
  rating: number;
  review?: string;
  date?: string;
};

type ViewRatingProps = {
  open: boolean;
  onClose: () => void;
  rating: JobRating | null;
};

export default function ViewRating({ open, onClose, rating }: ViewRatingProps) {
  if (!open || !rating) return null;

  const filledStars = Math.max(0, Math.min(5, Math.round(rating.rating)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <span className="sr-only">Close</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500">Job rating</p>
          <h2 className="mt-1 text-xl font-semibold text-gray-900">{rating.jobTitle}</h2>
          {rating.date && (
            <p className="mt-1 text-xs text-gray-400">{rating.date}</p>
          )}
        </div>

        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={
                  index < filledStars
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-sm font-semibold text-gray-800">
            {rating.rating.toFixed(1)}
          </p>
        </div>

        {rating.customerName && (
          <p className="mb-2 text-sm text-gray-600">
            From {rating.customerName}
          </p>
        )}

        {rating.review && (
          <p className="mt-2 rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
            {rating.review}
          </p>
        )}

        {!rating.review && (
          <p className="mt-2 text-sm text-gray-400">
            No written review provided for this job.
          </p>
        )}
      </div>
    </div>
  );
}
