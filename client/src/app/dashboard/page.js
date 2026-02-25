"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import WeatherCard from "@/components/WeatherCard";
import AddCity from "@/components/AddCity";
import AIChat from "@/components/AIChat";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { logout } = useAuth();
  const router = useRouter();

  const fetchCities = async () => {
    try {
      const { data } = await api.get("/weather/cities");
      setCities(data);
    } catch (err) {
      console.error("Error fetching cities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCities();
  }, [user]);

  if (loading)
    return <div className="p-10 text-center">Loading your weather...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
        <button
          onClick={() => router.push("/")}
          className="text-gray-600 hover:text-blue-600 font-bold"
        >
          ← Home
        </button>
        <button
          onClick={logout}
          className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition font-bold"
        >
          Logout
        </button>
      </nav>


      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">
          My <span className="text-blue-600">Weather</span> Dashboard
        </h1>
        {/* Add City Search Bar will go here later */}
        <AddCity onCityAdded={fetchCities} />
      </header>

      <main className="max-w-6xl mx-auto">
        {cities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
            <p className="text-gray-500">
              No cities added yet. Start by searching for a city!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <WeatherCard key={city._id} city={city} onRefresh={fetchCities} />
            ))}
          </div>
        )}
      </main>

      {/* Floating AI Agent */}
      <AIChat />
    </div>
  );
}
