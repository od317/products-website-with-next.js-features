// app/products/[id]/page.tsx
import { Product } from "@/types";
import { API_ENDPOINTS } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";

// 🎯 NEXT.JS CONCEPT: generateStaticParams
// This replaces getStaticPaths from Pages Router
// It tells Next.js which product pages to pre-generate at build time
export async function generateStaticParams() {
  // Fetch all products to determine which pages to pre-generate
  const res = await fetch(API_ENDPOINTS.PRODUCTS);
  const data = await res.json();

  // Return array of params for pre-generated pages
  // Next.js will pre-generate these pages at build time
  return data.products.slice(0, 10).map((product: Product) => ({
    id: product.id.toString(),
  }));
}

// 🎯 NEXT.JS CONCEPT: Dynamic Data Fetching
// This runs for each product page (both pre-generated and on-demand)
async function getProduct(id: string): Promise<Product> {
  const res = await fetch(API_ENDPOINTS.PRODUCT(id), {
    // No revalidate here - we'll handle caching differently
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound(); // Next.js 404 page
    }
    throw new Error("Failed to fetch product");
  }

  return res.json();
}

// 🎯 NEXT.JS CONCEPT: generateMetadata for Dynamic Routes
// Generate SEO metadata for each product page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  return {
    title: `${product.title} - Our Store`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.thumbnail],
    },
  };
}

// 🎯 NEXT.JS CONCEPT: Server Component with Dynamic Params
// params is a Promise in Next.js 16 App Router
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="relative h-96 mb-4">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover rounded-lg"
              priority // Important for above-the-fold images
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(0, 4).map((image, index) => (
              <div key={index} className="relative h-20">
                <Image
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-2xl font-bold text-green-600 mb-4">
            ${product.price}
          </p>
          <div className="flex items-center mb-4">
            <span className="text-yellow-500">⭐ {product.rating}</span>
            <span className="mx-2">•</span>
            <span className="text-gray-600">{product.brand}</span>
          </div>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <div className="space-y-2">
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Stock:</strong> {product.stock} units
            </p>
            <p>
              <strong>Discount:</strong> {product.discountPercentage}% off
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
