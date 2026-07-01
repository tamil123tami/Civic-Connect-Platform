import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const fetchComplaints = () => API.get("/complaints");
export const createComplaint = (complaintData) =>
  API.post("/complaints", complaintData);
