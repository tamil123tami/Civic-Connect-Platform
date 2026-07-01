import express from "express";
import upload from "../middleware/upload.js";
import {
  createComplaint,
  getComplaints,
  updateStatus,
} from "../controllers/complaintController.js";

const router = express.Router();

router.post("/", upload.single("image"), createComplaint);
router.get("/", getComplaints);
router.patch("/:id/status", updateStatus);

export default router;
