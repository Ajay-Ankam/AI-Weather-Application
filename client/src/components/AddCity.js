"use client";
import { useState } from "react";
import api from "@/lib/axios";

export default function AddCity({ onCityAdded }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      await api.post("/weather/cities", { name: query });
      setQuery("");
      onCityAdded(); // Refresh the dashboard list
    } catch (err) {
      alert(err.response?.data?.message || "City not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="flex gap-2 w-full max-w-md">
      <input
        type="text"
        placeholder="Search city (e.g. Tokyo)..."
        className="flex-1 p-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? "Adding..." : "Add City"}
      </button>
    </form>
  );
}
