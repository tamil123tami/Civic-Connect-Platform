import axios from "axios";
import Complaint from "../models/Complaint.js";
import s3 from "../config/s3.js";

export const createComplaint = async (req, res) => {
  try {
    const { description, location } = req.body;

    if (!description || !location || !req.file) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 🔼 Upload image to S3 (AWS SDK v2)
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `complaints/${Date.now()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
      .promise();



    const imageUrl = uploadResult.Location;

    // 🧠 AI category
    let category = "OTHER";
    try {
      const ai = await axios.post("http://127.0.0.1:8000/predict", {
        description,
      });
      category = ai.data.category || "OTHER";
    } catch {
      console.warn("AI failed, using fallback");
    }

    const complaint = await Complaint.create({
      description,
      imageUrl,
      location: JSON.parse(location),
      category,
      status: "OPEN",
    });

    // 🔔 Notify admins
    const io = req.app.get("io");
    io.emit("new_complaint", complaint);

    res.status(201).json(complaint);
  } catch (err) {
    console.error("Create complaint failed:", err);
    res.status(500).json({ message: "Create complaint failed" });
  }
};

export const getComplaints = async (req, res) => {
  const complaints = await Complaint.find().sort({ createdAt: -1 });
  res.json(complaints);
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await Complaint.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  // 🔔 Notify users
  const io = req.app.get("io");
  io.emit("status_updated", updated);

  res.json(updated);
};
