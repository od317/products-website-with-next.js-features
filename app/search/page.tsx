// app/search/page.tsx
import { ProductsResponse } from "@/types";
import { API_ENDPOINTS } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

// This function runs on EVERY request (SSR)
async function getSearchResults(query: string = ""): Promise<ProductsResponse> {
  if (!query.trim()) {
    return { products: [], total: 0, skip: 0, limit: 0 };
  }

  const res = await fetch(API_ENDPOINTS.PRODUCTS_SEARCH(query), {
    cache: "no-store", // This enables SSR behavior
  });

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  return res.json();
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const searchQuery = q || "";

  if (searchQuery) {
    return {
      title: `Search Results for "${searchQuery}" - Our Store`,
      description: `Find products matching "${searchQuery}"`,
    };
  }

  return {
    title: "Search Products - Our Store",
    description: "Search our product catalog",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const searchQuery = q || "";

  // EVERY request has fresh data
  const data = await getSearchResults(searchQuery);
  const products = data.products;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {searchQuery
          ? `Search Results for "${searchQuery}"`
          : "Search Products"}
      </h1>

      {/* Search Form */}
      <form className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            name="q"
            placeholder="Search products..."
            defaultValue={searchQuery}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Search Results */}
      {searchQuery && (
        <div>
          <p className="text-gray-600 mb-4">
            Found {products.length} results for {searchQuery}
          </p>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                No products found for {searchQuery}
              </p>
              <p className="text-gray-400 mt-2">
                Try different keywords or browse all products
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 mb-4">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    {product.title}
                  </h2>
                  <p className="text-gray-600 font-bold">${product.price}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {product.category}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!searchQuery && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            Enter a search term to find products
          </p>
          <p className="text-gray-400 mt-2">
            Try searching for phone, laptop, or fragrance
          </p>
        </div>
      )}
    </div>
  );
}
