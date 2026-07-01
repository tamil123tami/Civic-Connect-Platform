import { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    const res = await axios.get("http://localhost:5000/complaints");
    setComplaints(res.data);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const markResolved = async (id) => {
    await axios.patch(
      `http://localhost:5000/complaints/${id}/status`,
      { status: "RESOLVED" }
    );
    fetchComplaints();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🏛️ Admin Dashboard</h2>

      {complaints.map((c) => (
        <div
          key={c._id}
          style={{
            border: "1px solid #8e09e7",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <p><strong>{c.category}</strong></p>
          <p>{c.description}</p>
          <p>Status: {c.status}</p>

          {c.status === "OPEN" && (
            <button
              onClick={() => markResolved(c._id)}
              style={{
                background: "#16a34a",
                color: "white",
                padding: "6px 10px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Mark Resolved
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;

