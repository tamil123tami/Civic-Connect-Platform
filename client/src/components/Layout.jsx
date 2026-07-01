import { useNavigate, useLocation, Link } from "react-router-dom";
import { LogOut, Home, LayoutDashboard, Map as MapIcon } from "lucide-react";
import { motion } from "framer-motion";
import { logout } from "../utils/auth";
import Button from "./ui/Button";
import { Toaster } from "react-hot-toast";
import NotificationListener from "./NotificationListener";

const Layout = ({ children, role = "citizen" }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const menuItems =
        role === "admin"
            ? [{ icon: LayoutDashboard, label: "Dashboard", path: "/admin" }]
            : [
                { icon: Home, label: "Home", path: "/home" },
                // { icon: MapIcon, label: "Map View", path: "/map" },
            ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Toaster position="top-right" reverseOrder={false} />
            <NotificationListener />
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-10 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                            C
                        </div>
                        <span className="font-bold text-xl text-slate-800">CivicPlatform</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link to={item.path} key={item.path}>
                                <div
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-start gap-3 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-8 max-w-7xl mx-auto"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default Layout;
