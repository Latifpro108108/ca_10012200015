"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  region: string;
  city: string;
  address: string;
  dateJoined: string;
  isActive: boolean;
};

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    region: "",
    city: "",
    address: "",
  });

  // Format date safely - only on client side
  const formatDate = (dateString: string): string => {
    if (!mounted || !dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Load user from localStorage only on client
  useEffect(() => {
    setMounted(true);
    
    const loadUser = () => {
      try {
        const stored = localStorage.getItem("gomart:user");
        if (!stored) {
          toast.error("Please login to view your profile");
          router.push("/ui/customers/login");
          return;
        }
        
        const user = JSON.parse(stored);
        if (user?.id) {
          fetchCustomer(user.id);
        } else {
          toast.error("Invalid user session");
          router.push("/ui/customers/login");
        }
      } catch (error) {
        toast.error("Error loading user session");
        router.push("/ui/customers/login");
      }
    };

    loadUser();
  }, [router]);

  const fetchCustomer = async (customerId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/customers/${customerId}`);
      
      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        console.error("Response status:", res.status);
        console.error("Response headers:", Object.fromEntries(res.headers.entries()));
        
        // Clear invalid session
        localStorage.removeItem("gomart:user");
        toast.error("Session expired. Please login again.");
        router.push("/ui/customers/login");
        return;
      }
      
      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        if (res.status === 404) {
          localStorage.removeItem("gomart:user");
          toast.error("Account not found. Please login again.");
          router.push("/ui/customers/login");
          return;
        }
        throw new Error(data.message || "Failed to fetch profile");
      }

      const customerData = data.data.customer;
      setCustomer(customerData);
      setFormData({
        firstName: customerData.firstName || "",
        lastName: customerData.lastName || "",
        phoneNumber: customerData.phoneNumber || "",
        region: customerData.region || "",
        city: customerData.city || "",
        address: customerData.address || "",
      });
    } catch (error: any) {
      console.error("Error fetching customer:", error);
      toast.error(error.message || "Failed to load profile");
      // Don't redirect on network errors, let user retry
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned an invalid response. Please try again.");
      }

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update local storage
      const stored = localStorage.getItem("gomart:user");
      if (stored) {
        const user = JSON.parse(stored);
        localStorage.setItem(
          "gomart:user",
          JSON.stringify({
            ...user,
            firstName: formData.firstName,
            lastName: formData.lastName,
          })
        );
      }

      setCustomer(data.data.customer);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating customer:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state during SSR and initial load
  if (!mounted || loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const displayName = customer.firstName && customer.lastName 
    ? `${customer.firstName} ${customer.lastName}` 
    : customer.email;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-[var(--gold)] transition-colors mb-6 text-sm font-medium"
          >
            <FaArrowLeft className="text-xs" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-3xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary-dark)]/10 border border-[var(--primary)]/30">
                <FaUser className="text-3xl text-[var(--primary)]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                  My Profile
                </h1>
                <p className="text-gray-400 text-base">
                  Manage your account information
                </p>
              </div>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="btn-primary flex items-center gap-2 px-6 py-3"
              >
                <FaEdit />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="glass-surface rounded-3xl border border-white/10 p-8 shadow-2xl">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-white mb-3 text-base">
                    First Name <span className="text-[var(--secondary)]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-white mb-3 text-base">
                    Last Name <span className="text-[var(--secondary)]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-white mb-3 text-base">
                  Email
                </label>
                <input
                  type="email"
                  value={customer.email}
                  disabled
                  className="w-full px-5 py-4 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/5 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block font-semibold text-white mb-3 text-base">
                  Phone Number <span className="text-[var(--secondary)]">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full px-5 py-4 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-white mb-3 text-base">
                    Region <span className="text-[var(--secondary)]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) =>
                      setFormData({ ...formData, region: e.target.value })
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-white mb-3 text-base">
                    City <span className="text-[var(--secondary)]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-white mb-3 text-base">
                  Address <span className="text-[var(--secondary)]">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-5 py-4 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all min-h-24 resize-y"
                  required
                />
              </div>

              <div className="flex gap-4 pt-6 border-t border-white/10">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      firstName: customer.firstName || "",
                      lastName: customer.lastName || "",
                      phoneNumber: customer.phoneNumber || "",
                      region: customer.region || "",
                      city: customer.city || "",
                      address: customer.address || "",
                    });
                  }}
                  className="px-8 py-4 border-2 border-white/20 rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all font-semibold text-white flex items-center gap-2"
                >
                  <FaTimes />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/5">
                  <FaUser className="text-xl text-[var(--primary)] mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Full Name
                    </p>
                    <p className="text-white font-semibold text-lg">
                      {displayName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/5">
                  <FaEnvelope className="text-xl text-[var(--primary)] mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <p className="text-white font-semibold text-lg break-all">
                      {customer.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/5">
                  <FaPhone className="text-xl text-[var(--primary)] mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Phone Number
                    </p>
                    <p className="text-white font-semibold text-lg">
                      {customer.phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/5">
                  <FaMapMarkerAlt className="text-xl text-[var(--primary)] mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Location
                    </p>
                    <p className="text-white font-semibold text-lg">
                      {customer.city}, {customer.region}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/5">
                  <FaMapMarkerAlt className="text-xl text-[var(--primary)] mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Address
                    </p>
                    <p className="text-white font-semibold text-lg">
                      {customer.address || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/5">
                  <FaCalendarAlt className="text-xl text-[var(--primary)] mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Member Since
                    </p>
                    <p className="text-white font-semibold text-lg">
                      {formatDate(customer.dateJoined)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary-dark)]/5 border border-[var(--primary)]/20">
                  <FaCheckCircle className="text-xl text-[var(--primary)]" />
                  <div>
                    <p className="text-white font-semibold">
                      Account Status: Active
                    </p>
                    <p className="text-gray-400 text-sm">
                      Your account is active and ready to use
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
