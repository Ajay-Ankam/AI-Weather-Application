"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null; // Don't show navbar on login/signup pages

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-black text-blue-600">
          WeatherAI
        </Link>
        <button
          onClick={logout}
          className="text-sm font-medium text-gray-500 hover:text-red-500 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
