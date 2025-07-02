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
    <div className="min-h-screen max-w-2xl mx-auto p-6 mt-5">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Contact Us</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-3 rounded-md"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-3 rounded-md"
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-3 rounded-md"
        />
        <textarea
          name="comment"
          placeholder="Comment"
          rows="4"
          value={formData.comment}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-3 rounded-md"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#0FFF50] text-white px-5 py-3 rounded-md hover:bg-[#285b35] transition w-full cursor-pointer"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
        {sent && <p className="text-green-600 mt-2">Message sent successfully!</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}
