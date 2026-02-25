import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    isFavorite: { type: Boolean, default: false },
    // Store coordinates to avoid redundant API geocoding calls
    lat: Number,
    lon: Number,
  },
  { timestamps: true },
);

const City = mongoose.model("City", citySchema);
export default City;
