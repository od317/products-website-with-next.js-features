// app/components/reviews-list.tsx
"use client";

interface Review {
  id: string;
  rating: number;
  userName: string;
  comment: string;
  createdAt: string;
}

interface ReviewsListProps {
  reviews: Review[]; // 🎯 CHANGED: Now receives reviews as prop
  loading: boolean; // 🎯 CHANGED: Now receives loading as prop
  error: string; // 🎯 CHANGED: Now receives error as prop
  onRefresh?: () => void; // 🎯 NEW: Optional refresh function
}

export function ReviewsList({
  reviews,
  loading,
  error,
  onRefresh,
}: ReviewsListProps) {
  // 🎯 REMOVED: No more internal state - everything comes from props

  if (loading) {
    return (
      <div className="mt-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b pb-4">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="ml-4 text-sm underline hover:no-underline"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">
        Customer Reviews ({reviews.length})
      </h3>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{review.userName}</h4>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">
                      {"⭐".repeat(review.rating)}
                    </span>
                    <span className="text-gray-400">
                      {"⭐".repeat(5 - review.rating)}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
