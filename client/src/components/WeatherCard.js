"use client";
import api from "@/lib/axios";

export default function WeatherCard({ city, onRefresh }) {
  const { name, isFavorite, currentWeather, _id } = city;

  const toggleFavorite = async () => {
    try {
      await api.patch(`/weather/cities/${_id}/favorite`);
      onRefresh();
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  const handleDelete = async () => {
    // Standard confirmation dialog to prevent accidental clicks
    if (
      window.confirm(
        `Are you sure you want to remove ${name} from your dashboard?`,
      )
    ) {
      try {
        await api.delete(`/weather/cities/${_id}`);
        onRefresh(); // Refresh dashboard to show the city is gone
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to remove city. Please try again.");
      }
    }
  };

  return (
    // Added 'relative' and 'group' for better button interaction
    <div
      className={`p-6 rounded-2xl shadow-lg transition-all border relative group ${
        isFavorite ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100"
      }`}
    >
      {/* Improved Delete Button: Hidden by default, appears on hover for a cleaner look */}
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 bg-white/50 rounded-full lg:opacity-0 lg:group-hover:opacity-100"
        title="Remove City"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>

      {/* Main Content Area: Added padding-right (pr-8) to avoid overlap with Delete button */}
      <div className="flex justify-between items-start pr-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-500 capitalize">
            {currentWeather?.description || "Loading..."}
          </p>
        </div>
        <button
          onClick={toggleFavorite}
          className={`text-3xl transition-transform active:scale-125 ${
            isFavorite
              ? "text-yellow-400"
              : "text-gray-300 hover:text-yellow-200"
          }`}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-4xl font-black text-blue-600">
          {currentWeather?.temp !== undefined
            ? `${Math.round(currentWeather.temp)}°C`
            : "--°C"}
        </div>
        {currentWeather?.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
            alt="weather icon"
            className="w-16 h-16"
          />
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
        <div className="bg-gray-50 p-2 rounded flex items-center gap-1">
          💧 <span className="font-medium">Humidity:</span>{" "}
          {currentWeather?.humidity}%
        </div>
        <div className="bg-gray-50 p-2 rounded flex items-center gap-1">
          🌬️ <span className="font-medium">Wind:</span>{" "}
          {currentWeather?.wind_speed} m/s
        </div>
      </div>
    </div>
  );
}
