// app/products/[id]/page.tsx
import { Product } from "@/types";
import { API_ENDPOINTS } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { ProductReviews } from "@/components/product-reviews";


export async function generateStaticParams() {
  const res = await fetch(API_ENDPOINTS.PRODUCTS);
  const data = await res.json();

  return data.products.slice(0, 10).map((product: Product) => ({
    id: product.id.toString(),
  }));
}

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(API_ENDPOINTS.PRODUCT(id), {});

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch product");
  }

  return res.json();
}

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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Images - Left Column */}
        <div className="lg:col-span-1">
          <div className="relative h-96 mb-4">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover rounded-lg"
              priority
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

        {/* Product Details - Middle Column */}
        <div className="lg:col-span-1">
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

        {/* Reviews Section - Right Column */}
        <div className="lg:col-span-1">
          <ProductReviews productId={id} productName={product.title} />
        </div>
      </div>
    </div>
  );
}
