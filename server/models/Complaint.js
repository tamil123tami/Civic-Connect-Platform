import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "UNKNOWN",
    },

    status: {
      type: String,
      default: "OPEN",
    },

    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
