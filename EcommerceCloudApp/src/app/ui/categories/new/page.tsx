"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaArrowLeft, FaTags, FaCheckCircle, FaLightbulb } from "react-icons/fa";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    categoryName: "",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create category");
      }

      toast.success("Category created successfully!");
      router.push("/ui/categories/list");
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  }

  const suggestedCategories = [
    { icon: "📱", name: "Electronics & Phones" },
    { icon: "👔", name: "Fashion & Clothing" },
    { icon: "🍎", name: "Food & Beverages" },
    { icon: "🏠", name: "Home & Furniture" },
    { icon: "💄", name: "Beauty & Cosmetics" },
    { icon: "⚽", name: "Sports & Fitness" },
    { icon: "📚", name: "Books & Education" },
    { icon: "🧸", name: "Toys & Kids" },
    { icon: "⚕️", name: "Health & Medical" },
    { icon: "🚗", name: "Automotive & Parts" },
    { icon: "🌾", name: "Agriculture & Farming" },
    { icon: "🎨", name: "Crafts & Handmade" },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header Section */}
        <div className="mb-8">
          <Link
            href="/ui/categories/list"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[var(--primary)] transition-colors mb-6 text-sm font-medium"
          >
            <FaArrowLeft className="text-xs" />
            Back to Categories
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[var(--primary)]/15 to-[var(--primary-dark)]/10 border border-[var(--primary)]/30">
              <FaTags className="text-2xl text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">
                Add New Category
              </h1>
              <p className="text-gray-600 text-base">
                Create a new product category for your marketplace
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 mb-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div>
              <label className="block font-semibold text-gray-900 mb-3 text-lg">
                Category Name <span className="text-[var(--secondary)]">*</span>
              </label>
              <input
                type="text"
                value={form.categoryName}
                onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all text-base font-medium bg-white"
                placeholder="e.g., Electronics, Fashion, Food & Beverages"
                required
              />
              <p className="text-xs text-gray-500 mt-2 ml-1">
                Choose a clear, descriptive name for your category
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-gray-900 mb-3 text-lg">
                Description
                <span className="text-gray-500 text-sm font-normal ml-2">(Optional)</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all text-base font-medium min-h-32 resize-y bg-white"
                placeholder="Brief description of this category and what products it includes..."
              />
              <p className="text-xs text-gray-500 mt-2 ml-1">
                Provide helpful information about what products belong in this category
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 px-8 py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Create Category
                  </>
                )}
              </button>
              <Link
                href="/ui/categories/list"
                className="px-8 py-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-gray-800 text-base"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Suggested Categories */}
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaLightbulb className="text-xl text-[var(--gold)]" />
            <h3 className="font-bold text-gray-900 text-xl">
              💡 Suggested Categories for Ghana
            </h3>
          </div>
          <p className="text-gray-700 text-sm mb-5">
            Popular category ideas to help organize your marketplace
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {suggestedCategories.map((category, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setForm({ ...form, categoryName: category.name })}
                className="pill flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-amber-100 hover:border-[var(--primary)]/50 transition-all text-left"
              >
                <span className="text-lg">{category.icon}</span>
                <span className="truncate">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}







