import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import axios from "axios";

import { io } from "socket.io-client";

// Custom icons setup
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = createIcon('red');
const orangeIcon = createIcon('orange');
const greenIcon = createIcon('green');

const MapView = () => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    fetchComplaints();
    const interval = setInterval(fetchComplaints, 10000);

    // Socket.io listener
    const socket = io("http://localhost:5000");
    socket.on("new_complaint", (newComplaint) => {
      console.log("New complaint received via socket:", newComplaint);
      fetchComplaints(); // Refresh map data
    });

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/complaints");
      // Show only OPEN complaints
      const open = res.data.filter((c) => c.status === "OPEN");

      // Group by location (avoid duplicates)
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

      const finalData = Object.values(grouped).map((c) => ({
        ...c,
        priorityScore: c.reportCount * 3 + c.daysPending * 2,
      }));

      setMarkers(finalData);
    } catch (e) {
      console.error("Failed to fetch complaints", e);
    }
  };

  const getIcon = (score) => {
    if (score >= 10) return redIcon;
    if (score >= 5) return orangeIcon;
    return greenIcon;
  };

  return (
    <MapContainer
      center={[13.0827, 80.2707]}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: "12px" }}
      className="z-0 shadow-inner"
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* MARKERS */}
      {markers.map((c) => (
        <Marker
          key={c._id}
          position={[c.location.lat, c.location.lng]}
          icon={getIcon(c.priorityScore)}
        >
          <Popup maxWidth={260} className="rounded-lg overflow-hidden p-0">
            <div className="text-sm font-sans p-2">
              <div className="font-bold text-slate-800 mb-1 capitalize border-b pb-1 border-slate-100">
                {c.category || "Issue Report"}
              </div>

              <div className="text-slate-600 mb-2">{c.description}</div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2 rounded mb-2">
                <div>
                  <span className="font-semibold">Reports:</span> {c.reportCount}
                </div>
                <div>
                  <span className="font-semibold">Pending:</span> {c.daysPending}d
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold mb-2">
                <span>Priority:</span>
                <span
                  className={`px-2 py-0.5 rounded-full ${c.priorityScore >= 10
                    ? "bg-red-100 text-red-700"
                    : c.priorityScore >= 5
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                    }`}
                >
                  {c.priorityScore}
                </span>
              </div>

              {/* IMAGE PREVIEW */}
              {c.imageUrl && (
                <div className="mt-2 text-center">
                  <div className="rounded-lg overflow-hidden aspect-video relative group">
                    <img
                      src={c.imageUrl}
                      alt="complaint"
                      className="w-full h-full object-cover"
                    />
                    <a
                      href={c.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium"
                    >
                      View Full Image
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* HEATMAP */}
      {markers.map((c) => (
        <Circle
          key={`heat-${c._id}`}
          center={[c.location.lat, c.location.lng]}
          radius={c.priorityScore * 50}
          pathOptions={{
            color:
              c.priorityScore >= 10
                ? "#ef4444" // red-500
                : c.priorityScore >= 5
                  ? "#f97316" // orange-500
                  : "#22c55e", // green-500
            fillOpacity: 0.2,
            stroke: false
          }}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
