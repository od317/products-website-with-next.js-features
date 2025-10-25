// app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";

// 🎯 NEXT.JS CONCEPT: API Route Handlers in App Router
// Route handlers replace API pages from Pages Router

// In-memory storage for reviews (for demo purposes)
// In real app, use a database
const reviews: any[] = [];

// Define the expected request body type
interface ReviewRequest {
  rating: number;
  productId: string;
  userName: string;
  comment: string;
}

// 🎯 NEXT.JS CONCEPT: Validation function
function validateReview(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (!data.rating) errors.push("Rating is required");
  if (!data.productId) errors.push("Product ID is required");
  if (!data.userName) errors.push("User name is required");
  if (!data.comment) errors.push("Comment is required");

  // Validate rating range (1-5)
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    errors.push("Rating must be between 1 and 5");
  }

  // Validate comment not empty
  if (data.comment && data.comment.trim().length === 0) {
    errors.push("Comment cannot be empty");
  }

  // Validate comment length
  if (data.comment && data.comment.trim().length > 500) {
    errors.push("Comment cannot exceed 500 characters");
  }

  // Validate user name
  if (data.userName && data.userName.trim().length === 0) {
    errors.push("User name cannot be empty");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 🎯 NEXT.JS CONCEPT: POST handler for API route
export async function POST(request: NextRequest) {
  try {
    // 🎯 NEXT.JS CONCEPT: Parse JSON body from request
    const body: ReviewRequest = await request.json();

    // 🎯 Validate the request data
    const validation = validateReview(body);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    // 🎯 Create review object
    const review = {
      id: Date.now().toString(), // Simple ID generation
      rating: body.rating,
      productId: body.productId,
      userName: body.userName.trim(),
      comment: body.comment.trim(),
      createdAt: new Date().toISOString(),
    };

    // 🎯 Store the review (in memory for demo)
    reviews.push(review);

    // 🎯 NEXT.JS CONCEPT: Success response
    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully",
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    // 🎯 NEXT.JS CONCEPT: Error handling in API routes
    console.error("Review submission error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON in request body",
      },
      { status: 400 }
    );
  }
}

// 🎯 NEXT.JS CONCEPT: GET handler to retrieve reviews
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  let filteredReviews = reviews;

  // Filter by productId if provided
  if (productId) {
    filteredReviews = reviews.filter(
      (review) => review.productId === productId
    );
  }

  // Sort by latest first
  filteredReviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({
    success: true,
    reviews: filteredReviews,
    total: filteredReviews.length,
  });
}
