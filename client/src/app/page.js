"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex flex-col items-center justify-center text-white px-4">
      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          Weather<span className="text-blue-200">AI</span>
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-blue-100 font-light">
          Experience the future of weather forecasting. Personal insights,
          activity recommendations, and AI-powered briefings tailored just for
          you.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {user ? (
            <Link
              href="/dashboard"
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-50 transition transform hover:scale-105"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-50 transition transform hover:scale-105"
              >
                Get Started for Free
              </Link>
              <Link
                href="/login"
                className="bg-transparent border-2 border-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Preview */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="text-xl font-bold mb-2">AI Insights</h3>
          <p className="text-blue-100 text-sm">
            Ask Gemini about the best time for a run or what to pack for your
            trip.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
          <div className="text-3xl mb-3">🌍</div>
          <h3 className="text-xl font-bold mb-2">Live Tracking</h3>
          <p className="text-blue-100 text-sm">
            Real-time data from OpenWeather for all your favorite global cities.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="text-xl font-bold mb-2">Daily Briefing</h3>
          <p className="text-blue-100 text-sm">
            Get a 2-sentence summary of your entire day as soon as you log in.
          </p>
        </div>
      </div>

      <footer className="absolute bottom-8 text-blue-200 text-sm">
        © 2026 WeatherAI. Powered by Gemini AI.
      </footer>
    </div>
  );
}
