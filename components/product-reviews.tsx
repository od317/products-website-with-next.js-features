// app/components/product-reviews.tsx
"use client";

import { useState, useEffect } from "react";
import { ReviewForm } from "./review-form";
import { ReviewsList } from "./reviews-list";

interface Review {
  id: string;
  rating: number;
  userName: string;
  comment: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export function ProductReviews({
  productId,
  productName,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🎯 Function to fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews?productId=${productId}`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
      } else {
        setError("Failed to load reviews");
      }
    } catch (err) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Function to add a new review to the state
  const addNewReview = (newReview: Review) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  // 🎯 Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return (
    <div>
      <ReviewForm
        productId={productId}
        productName={productName}
        onReviewAdded={addNewReview} // 🎯 Pass callback to form
      />
      <ReviewsList
        reviews={reviews}
        loading={loading}
        error={error}
        onRefresh={fetchReviews} // 🎯 Pass refresh function
      />
    </div>
  );
}
