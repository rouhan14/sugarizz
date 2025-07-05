"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSent(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSent(true);
        setFormData({ name: "", email: "", phoneNumber: "", comment: "" });
      } else {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1f2937] via-[#111827] to-[#0f172a] px-4 py-8">
      <div className="w-full max-w-2xl backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 transition-all duration-300">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-white/70"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-white/70"
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-white/70"
          />
          <textarea
            name="comment"
            placeholder="Your Message"
            rows="5"
            value={formData.comment}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-white/70"
          ></textarea>

          <button
  type="submit"
  disabled={loading}
  className={`
    w-full py-3 rounded-md text-white font-semibold
    bg-green-500/70 hover:bg-green-500/40
    border border-white/20 backdrop-blur-md
    shadow-[inset_0_0_4px_rgba(255,255,255,0.2),_0_4px_10px_rgba(0,128,0,0.35)]
    hover:shadow-[inset_0_0_6px_rgba(255,255,255,0.25),_0_6px_14px_rgba(0,128,0,0.45)]
    transition-all duration-300
    disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer
  `}
>
  {loading ? "Sending..." : "Send Message"}
</button>

          {sent && (
            <p className="text-green-400 text-sm mt-2 text-center">
              ✅ Message sent successfully!
            </p>
          )}
          {error && (
            <p className="text-red-400 text-sm mt-2 text-center">
              ❌ {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
