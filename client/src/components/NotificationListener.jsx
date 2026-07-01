import { useEffect } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const SOCKET_URL = "http://localhost:5000";

const NotificationListener = () => {
    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on("connect", () => {
            console.log("Connected to socket server");
        });

        // Listen for status updates
        socket.on("status_updated", (data) => {
            toast.success(`Complaint Resolved: ${data.category}`, {
                duration: 5000,
                icon: "✅",
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
        });

        // Listen for new complaints (for admin)
        socket.on("new_complaint", (data) => {
            toast(`New Complaint: ${data.category}`, {
                icon: "📢",
                style: {
                    borderRadius: "10px",
                    background: "#3b82f6", // Blue background
                    color: "#fff",
                },
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return null; // Headless component
};

export default NotificationListener;
