import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, AlertTriangle, Clock, Activity } from "lucide-react";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Admin = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/complaints");
      const open = res.data.filter((c) => c.status === "OPEN");

      const grouped = {};

      open.forEach((c) => {
        const lat = c.location.lat.toFixed(4);
        const lng = c.location.lng.toFixed(4);
        const key = `${lat},${lng}`;

        const daysPending = Math.floor(
          (Date.now() - new Date(c.createdAt)) /
          (1000 * 60 * 60 * 24)
        );

        if (!grouped[key]) {
          grouped[key] = {
            ...c,
            reportCount: 1,
            daysPending,
          };
        } else {
          grouped[key].reportCount += 1;
        }
      });

      const finalData = Object.values(grouped)
        .map((c) => ({
          ...c,
          priorityScore: c.reportCount * 3 + c.daysPending * 2,
          escalated: c.reportCount * 3 + c.daysPending * 2 >= 12,
        }))
        .sort((a, b) => b.priorityScore - a.priorityScore);

      setComplaints(finalData);
    } catch (e) {
      console.error("Failed to fetch", e);
    } finally {
      setIsLoading(false);
    }
  };

  const resolveComplaint = async (id) => {
    // Optimistic update
    setComplaints(prev => prev.filter(c => c._id !== id));

    try {
      await axios.patch(
        `http://localhost:5000/complaints/${id}/status`,
        { status: "RESOLVED" }
      );
      fetchComplaints(); // Re-fetch to be sure
    } catch (e) {
      console.error("Failed to resolve", e);
      fetchComplaints(); // Revert on error
    }
  };

  return (
    <Layout role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Priority Dashboard</h1>
        <p className="text-slate-500">Manage and resolve high-priority civic issues</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-4 flex items-center gap-4 border-l-4 border-l-red-500">
          <div className="p-3 bg-red-50 rounded-full text-red-500">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {complaints.filter(c => c.escalated).length}
            </div>
            <div className="text-sm text-slate-500">Escalated Issues</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-3 bg-blue-50 rounded-full text-blue-500">
            <Activity size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {complaints.length}
            </div>
            <div className="text-sm text-slate-500">Active Clusters</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-l-4 border-l-orange-500">
          <div className="p-3 bg-orange-50 rounded-full text-orange-500">
            <Clock size={24} />
          </div>
          <div>
            {/* Mock data for avg time */}
            <div className="text-2xl font-bold text-slate-800">
              2.4d
            </div>
            <div className="text-sm text-slate-500">Avg. Resolution Time</div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {complaints.map((c) => (
          <Card
            key={c._id}
            className={`flex flex-col md:flex-row gap-6 p-6 transition-all hover:shadow-md ${c.escalated ? 'bg-red-50/50 border-red-100' : ''
              }`}
          >
            {/* Image Section */}
            {c.imageUrl && (
              <div className="w-full md:w-48 h-32 flex-shrink-0">
                <img
                  src={c.imageUrl}
                  alt="Issue"
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                />
              </div>
            )}

            {/* Content Section */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-slate-800 capitalize">
                      {c.category || "General Issue"}
                    </h3>
                    {c.escalated && (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle size={12} /> ESCALATED
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 mb-4">{c.description}</p>
                </div>
                {/* Priority Badge */}
                <div className={`flex flex-col items-end`}>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Priority Score</span>
                  <span className={`text-2xl font-bold ${c.priorityScore >= 10 ? "text-red-600" :
                    c.priorityScore >= 5 ? "text-orange-500" : "text-green-600"
                    }`}>
                    {c.priorityScore}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mt-2 p-3 bg-white rounded-lg border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Reports:</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-700 font-bold">{c.reportCount}</span>
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Pending:</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {c.daysPending} days
                  </span>
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <div>
                  <span className="font-semibold text-slate-700">Location:</span> {c.location.lat.toFixed(4)}, {c.location.lng.toFixed(4)}
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="flex items-center justify-end md:self-center">
              <Button
                onClick={() => resolveComplaint(c._id)}
                className="bg-green-600 hover:bg-green-700 text-white shadow-green-200 flex items-center gap-2"
              >
                <CheckCircle size={18} />
                Resolve All
              </Button>
            </div>
          </Card>
        ))}

        {complaints.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900">All caught up!</h3>
            <p className="text-slate-500">No open complaints requiring attention.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
