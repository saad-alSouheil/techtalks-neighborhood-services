"use client";

type JobRating = {
  reliability: number;
  punctuality: number;
  priceHonesty: number;
  total: number;
  comment?: string;
};

type ViewRatingProps = {
  open: boolean;
  onClose: () => void;
  rating: JobRating | null;
};

export default function ViewRating({ open, onClose, rating }: ViewRatingProps) {
  if (!open || !rating) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >
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

        <h2 id="rating-title" className="mb-6 text-center text-xl font-bold text-orange-500">
          Rating
        </h2>

        <div className="space-y-3 text-gray-800">
          <div className="flex justify-between">
            <span>Reliability:</span>
            <span>{rating.reliability}</span>
          </div>
          <div className="flex justify-between">
            <span>Punctuality:</span>
            <span>{rating.punctuality}</span>
          </div>
          <div className="flex justify-between">
            <span>Price Honesty:</span>
            <span>{rating.priceHonesty}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>{typeof rating.total === "number" ? rating.total.toFixed(1) : rating.total}</span>
          </div>
        </div>

        {rating.comment && (
          <div className="mt-4">
            <p className="mb-1 text-sm font-medium text-gray-700">Comment:</p>
            <p className="text-sm leading-relaxed text-gray-600">
              {rating.comment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
