"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaEnvelope, FaEnvelopeOpen, FaReply, FaTrash, FaArrowLeft } from "react-icons/fa";

type Message = {
  id: string;
  subject: string;
  message: string;
  productId?: string | null;
  status: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  vendor: {
    vendorName: string;
    email: string;
  };
};

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "replied">("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    loadMessages();
  }, [filter]);

  async function loadMessages() {
    setLoading(true);
    try {
      const stored = localStorage.getItem("gomart:user");
      if (!stored) {
        router.push("/ui/customers/login");
        return;
      }

      const user = JSON.parse(stored);
      const queryParams = new URLSearchParams({ customerId: user.id });
      if (filter !== "all") {
        queryParams.append("status", filter);
      }

      const res = await fetch(`/api/messages?${queryParams}`);
      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      setMessages(data.data?.messages || []);
    } catch (error) {
      toast.error("Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(messageId: string) {
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });

      if (!res.ok) throw new Error("Failed to update message");

      toast.success("Message marked as read");
      loadMessages();
    } catch (error) {
      toast.error("Failed to update message");
    }
  }

  async function deleteMessage(messageId: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete message");

      toast.success("Message deleted");
      setSelectedMessage(null);
      loadMessages();
    } catch (error) {
      toast.error("Failed to delete message");
    }
  }

  function openMessage(message: Message) {
    setSelectedMessage(message);
    if (message.status === "unread") {
      markAsRead(message.id);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="pill">Inbox</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mt-2">
            My Messages
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </p>
        </div>
        <Link href="/" className="text-gray-300 hover:text-white flex items-center gap-2">
          <FaArrowLeft /> Back
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="glass-surface rounded-3xl p-2 flex gap-2 overflow-x-auto">
        {["all", "unread", "read", "replied"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as typeof filter)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              filter === f
                ? "bg-[var(--primary)] text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {messages.length === 0 ? (
        <div className="glass-surface rounded-3xl p-12 text-center">
          <FaEnvelope className="mx-auto text-5xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No messages yet</h2>
          <p className="text-gray-300">
            {filter === "all"
              ? "You haven't received any messages from vendors."
              : `No ${filter} messages found.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr,1.5fr]">
          {/* Messages List */}
          <div className="glass-surface rounded-3xl p-6 space-y-3 h-fit max-h-[600px] overflow-y-auto">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full text-left p-4 rounded-2xl transition-all ${
                  selectedMessage?.id === msg.id
                    ? "bg-[var(--primary)]/20 border-2 border-[var(--primary)]"
                    : "bg-[rgba(255,255,255,0.03)] border-2 border-white/10 hover:bg-[rgba(255,255,255,0.06)]"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {msg.status === "unread" ? (
                      <FaEnvelope className="text-[var(--gold)]" />
                    ) : (
                      <FaEnvelopeOpen className="text-gray-400" />
                    )}
                    <span className="text-sm font-semibold text-white">{msg.vendor.vendorName}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-200 mb-1">{msg.subject}</p>
                <p className="text-xs text-gray-400 line-clamp-2">{msg.message}</p>
                {msg.status === "replied" && (
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded-lg bg-[var(--primary)]/20 text-[var(--primary)]">
                    Replied
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Message Detail */}
          {selectedMessage ? (
            <div className="glass-surface rounded-3xl p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-[0.4em] text-gray-500">From</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-lg ${
                        selectedMessage.status === "unread"
                          ? "bg-[var(--gold)]/20 text-[var(--gold)]"
                          : selectedMessage.status === "replied"
                          ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                          : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {selectedMessage.status}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">
                    {selectedMessage.vendor.vendorName}
                  </h2>
                  <p className="text-sm text-gray-400">{selectedMessage.vendor.email}</p>
                </div>
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="text-red-400 hover:text-red-300 p-2"
                  title="Delete message"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-2">Subject</p>
                  <p className="text-lg font-semibold text-white">{selectedMessage.subject}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-2">Message</p>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-2">Date</p>
                  <p className="text-sm text-gray-300">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="text-xs text-gray-400 mb-4">
                  To reply to this message, please contact the vendor directly at their email or WhatsApp.
                </p>
                {selectedMessage.productId && (
                  <Link
                    href={`/ui/products/${selectedMessage.productId}`}
                    className="btn-primary px-6 py-3 rounded-xl text-sm font-semibold inline-block"
                  >
                    View Product
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-surface rounded-3xl p-12 flex items-center justify-center text-center">
              <div>
                <FaEnvelopeOpen className="mx-auto text-5xl text-gray-400 mb-4" />
                <p className="text-gray-300">Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

