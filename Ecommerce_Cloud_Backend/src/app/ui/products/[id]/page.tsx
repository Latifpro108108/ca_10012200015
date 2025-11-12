"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaArrowLeft, FaMapMarkerAlt, FaShoppingCart, FaStar, FaEnvelope, FaWeight, FaRegStar } from "react-icons/fa";
import { FiImage } from "react-icons/fi";

type ProductDetail = {
  id: string;
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageURL?: string;
  galleryImages?: string[];
  highlights?: string[];
  deliveryInfo?: string | null;
  returnPolicy?: string | null;
  videoURL?: string | null;
  specifications?: Record<string, string> | null;
  brand?: string | null;
  sku?: string | null;
  weight?: number | null;
  averageRating: number;
  reviewCount: number;
  category: { id: string; categoryName: string };
  vendor: {
    id: string;
    vendorName: string;
    region: string;
    isVerified: boolean;
    storeDescription?: string | null;
    storeLogo?: string | null;
    whatsappNumber?: string | null;
  };
};

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
  };
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
   const [highlightsText, setHighlightsText] = useState<string>("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  useEffect(() => {
    if (!id) return;

    async function loadProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          router.push("/ui/products/list");
          return;
        }
        const data = await res.json();
        const fetchedProduct: ProductDetail | undefined = data.data?.product;
        if (!fetchedProduct) {
          router.push("/ui/products/list");
          return;
        }
        setProduct(fetchedProduct);
        const gallery = fetchedProduct.galleryImages?.length
          ? fetchedProduct.galleryImages
          : fetchedProduct.imageURL
          ? [fetchedProduct.imageURL]
          : [];
        setSelectedImage(gallery[0] || null);
      } catch (error) {
        router.push("/ui/products/list");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, router]);

  const gallery = useMemo(() => {
    if (!product) return [] as string[];
    if (product.galleryImages && product.galleryImages.length > 0) {
      return product.galleryImages;
    }
    return product.imageURL ? [product.imageURL] : [];
  }, [product]);

  const productReviews = product?.reviews ?? [];

  function handleMessageVendor() {
    const user = localStorage.getItem("gomart:user");
    if (!user) {
      toast.error("Please login to message the vendor");
      router.push("/ui/customers/login");
      return;
    }

    if (product?.vendor.whatsappNumber) {
      const message = encodeURIComponent(`Hi! I'm interested in ${product.productName}`);
      window.open(`https://wa.me/${product.vendor.whatsappNumber}?text=${message}`, '_blank');
    } else {
      toast.info("Vendor contact info not available");
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;

    const sessionStr = localStorage.getItem("gomart:user");
    if (!sessionStr) {
      toast.error("Please login to submit a review");
      router.push("/ui/customers/login");
      return;
    }

    const { id: customerId } = JSON.parse(sessionStr);
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerId,
          rating: reviewRating,
          comment: reviewComment.trim() || null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit review");
      }

      toast.success("Review submitted successfully!");
      setShowReviewForm(false);
      setReviewComment("");
      setReviewRating(5);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-300">
        <p className="text-lg">Product not available at the moment please try again later or contact the vendor.</p>
        <Link href="/ui/products/list" className="btn-primary inline-flex mt-6 px-6 py-3 rounded-xl text-sm font-semibold">
          Back to products
        </Link>
      </div>
    );
  }

  function handleAddToCart() {
    if (!product) return;
    try {
      const stored = localStorage.getItem("gomart:cart");
      let cart: Array<{
        productId: string;
        productName: string;
        price: number;
        imageURL?: string | null;
        quantity: number;
        stockQuantity: number;
      }> = stored ? JSON.parse(stored) : [];

      const existing = cart.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          toast.info("Maximum stock already in cart");
        } else {
          existing.quantity += 1;
          toast.success("Quantity updated in cart");
        }
      } else {
        cart.push({
          productId: product.id,
          productName: product.productName,
          price: product.price,
          imageURL: selectedImage || product.imageURL,
          quantity: 1,
          stockQuantity: product.stockQuantity,
        });
        toast.success("Added to cart");
      }

      localStorage.setItem("gomart:cart", JSON.stringify(cart));
      window.dispatchEvent(new StorageEvent("storage", { key: "gomart:cart" }));
    } catch (error) {
      toast.error("Could not update cart");
    }
  }

  const specificationsEntries = product.specifications
    ? Object.entries(product.specifications)
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center gap-3 text-sm text-gray-300">
        <Link href="/ui/products/list" className="inline-flex items-center gap-2 text-gray-300 hover:text-white">
          <FaArrowLeft /> Back to products
        </Link>
        <span>•</span>
        <span>{product.category.categoryName}</span>
      </div>

      <div className="glass-surface rounded-3xl p-6 md:p-10 grid gap-8 lg:grid-cols-[1.2fr,0.9fr] items-start">
        <div className="space-y-4">
          <div className="relative h-[340px] md:h-[420px] rounded-3xl overflow-hidden border border-white/10 bg-[rgba(255,255,255,0.04)]">
            {selectedImage ? (
              <Image 
                src={selectedImage} 
                alt={product.productName} 
                fill 
                className="object-cover" 
                quality={95}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                <FiImage className="text-5xl" />
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="pill bg-[rgba(10,155,69,0.2)] text-[var(--primary)]">
                {product.category.categoryName}
              </span>
              {product.vendor.isVerified && (
                <span className="pill bg-[rgba(244,196,48,0.2)] text-[var(--gold)]">Verified vendor</span>
              )}
            </div>
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {gallery.map((image) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(image)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border ${
                    selectedImage === image ? "border-[var(--gold)]" : "border-white/10"
                  }`}
                >
                  <Image 
                    src={image} 
                    alt="Thumbnail" 
                    fill 
                    className="object-cover" 
                    quality={90}
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">{product.productName}</h1>
            {product.brand && (
              <p className="text-sm uppercase tracking-[0.35em] text-gray-500">{product.brand}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <FaStar className="text-[var(--gold)]" />
                <span>{product.averageRating.toFixed(1)}</span>
                <span className="text-xs text-gray-500">({product.reviewCount} reviews)</span>
              </div>
              {product.weight && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <FaWeight className="text-gray-400" />
                    <span>{product.weight} kg</span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FaMapMarkerAlt />
                <span>{product.vendor.vendorName}</span>
                <span>•</span>
                <span>{product.vendor.region}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>

          <div className="rounded-3xl bg-[rgba(255,255,255,0.04)] border border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.4em] text-gray-500">Price</span>
              <span className="text-3xl font-extrabold text-[var(--gold)]">GH₵ {product.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Availability</span>
              <span>
                {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                disabled={product.stockQuantity === 0}
              >
                <FaShoppingCart /> Add to cart
              </button>
              <button
                onClick={handleMessageVendor}
                className="btn-secondary px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                title="Message Vendor"
              >
                <FaEnvelope />
              </button>
            </div>
          </div>

          {product.highlights && product.highlights.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-white">Highlights</h2>
              <ul className="space-y-2 text-sm text-gray-300 list-disc pl-5">
                {product.highlights.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {specificationsEntries.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-white">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                {specificationsEntries.map(([key, value]) => (
                  <div key={key} className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.4em] text-gray-500">{key}</p>
                    <p className="mt-1 text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(product.deliveryInfo || product.returnPolicy) && (
            <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-300">
              {product.deliveryInfo && (
                <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Delivery information</h3>
                  <p>{product.deliveryInfo}</p>
                </div>
              )}
              {product.returnPolicy && (
                <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Return policy</h3>
                  <p>{product.returnPolicy}</p>
                </div>
              )}
            </div>
          )}

          <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Vendor</h3>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
                {product.vendor.storeLogo ? (
                  <Image 
                    src={product.vendor.storeLogo} 
                    alt="Vendor logo" 
                    width={48} 
                    height={48} 
                    className="object-cover" 
                    quality={90}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">
                    {product.vendor.vendorName[0]}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-white">{product.vendor.vendorName}</p>
                <p className="text-xs text-gray-400">{product.vendor.region}</p>
              </div>
            </div>
            {product.vendor.storeDescription && (
              <p className="text-sm text-gray-300 leading-relaxed">
                {product.vendor.storeDescription}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="glass-surface rounded-3xl p-6 md:p-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-white">Customer Reviews</h2>
          <button
            onClick={() => setShowReviewForm((prev) => !prev)}
            className="btn-secondary px-4 py-2 rounded-xl text-sm font-semibold"
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </button>
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="text-2xl transition-colors"
                  >
                    {star <= reviewRating ? (
                      <FaStar className="text-[var(--gold)]" />
                    ) : (
                      <FaRegStar className="text-gray-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Your Review (Optional)</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[var(--gold)] focus:outline-none min-h-[100px]"
              />
            </div>
            <button
              type="submit"
              disabled={submittingReview}
              className="btn-primary px-6 py-3 rounded-xl text-sm font-semibold"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {productReviews.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No reviews yet. Be the first to review this product!</p>
          ) : (
            productReviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      {review.customer.firstName} {review.customer.lastName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? "text-[var(--gold)]" : "text-gray-600"}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-300 leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
