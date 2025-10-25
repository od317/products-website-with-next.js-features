// app/admin/page.tsx
import { getAuthToken, getCurrentUser } from "@/lib/auth";
import { ProductsResponse } from "@/types";
import { API_ENDPOINTS } from "@/lib/api";
import { Metadata } from "next";
import { LogoutButton } from "@/components/logout-button";

// We check authentication at the component level

export const metadata: Metadata = {
  title: "Admin Dashboard - Our Store",
  description: "Admin panel for managing products and reviews",
};

async function getStats(): Promise<{
  totalProducts: number;
  totalReviews: number;
  averageRating: number;
}> {
  const productsRes = await fetch(API_ENDPOINTS.PRODUCTS, {
    next: { revalidate: 60 }, // Cache for 1 minute
  });
  const productsData: ProductsResponse = await productsRes.json();

  // Mock reviews count (in real app, fetch from your database)
  const totalReviews = productsData.products.reduce(
    (acc, product) => acc + Math.floor(product.rating * 2),
    0
  );

  const averageRating =
    productsData.products.reduce((acc, product) => acc + product.rating, 0) /
    productsData.products.length;

  return {
    totalProducts: productsData.total,
    totalReviews,
    averageRating: Number(averageRating.toFixed(2)),
  };
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  const stats = await getStats();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.username}!</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Products
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalProducts}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Reviews
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.totalReviews}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Average Rating
          </h3>
          <p className="text-3xl font-bold text-yellow-600">
            ⭐ {stats.averageRating}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Add New Product
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            View All Reviews
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
            User Management
          </button>
        </div>
      </div>

      {/* Recent Activity (Mock) */}
      <div className="bg-white p-6 rounded-lg shadow-md border mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span>New review submitted for iPhone 9</span>
            <span className="text-sm text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span>Product Samsung Universe updated</span>
            <span className="text-sm text-gray-500">1 hour ago</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span>New user registration</span>
            <span className="text-sm text-gray-500">3 hours ago</span>
          </div>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}
