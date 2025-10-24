// app/products/page.tsx
import { ProductsResponse, Product } from "@/types";
import { API_ENDPOINTS } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

// ISR: Revalidate every 5 minutes
async function getProducts(): Promise<ProductsResponse> {
  const res = await fetch(API_ENDPOINTS.PRODUCTS, {
    next: { revalidate: 300 }, // ISR enabled
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "All Products - Our Store",
    description: "Browse our complete collection of high-quality products",
  };
}

export default async function ProductsPage() {
  const data = await getProducts();
  const products = data.products;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        All Products ({products.length})
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            {/* Next.js Image component with optimization */}
            <div className="relative h-48 mb-4">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-600 font-bold">${product.price}</p>
            <p className="text-sm text-gray-500 mt-2">{product.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
