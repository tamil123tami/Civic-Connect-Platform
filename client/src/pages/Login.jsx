import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, UserCircle, ShieldCheck } from "lucide-react";
import { loginAs, getRole } from "../utils/auth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = getRole();
    if (role === 'admin') navigate('/admin');
    if (role === 'citizen') navigate('/home');
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // ADMIN LOGIN
    if (username === "admin" && password === "admin123") {
      loginAs("admin");
      navigate("/admin");
      window.location.reload(); // Force reload to ensure state updates
      return;
    }

    // CITIZEN LOGIN
    if (username === "citizen" && password === "citizen123") {
      loginAs("citizen");
      navigate("/home");
      window.location.reload(); // Force reload to ensure state updates
      return;
    }

    setError("Invalid username or password");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Animated Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-100/50 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -60, 0],
            x: [0, -50, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-100/50 blur-3xl"
        />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md p-4 z-10"
      >
        <Card className="p-8 backdrop-blur-sm bg-white/90 border-white/50 shadow-2xl">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200 cursor-pointer"
            >
              <Building2 size={32} />
            </motion.div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Sign in to the Civic Platform</p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-4">
            <motion.div variants={itemVariants}>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={error && " "} // Simple error trigger
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-all duration-300 focus:scale-[1.02]"
              />
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, x: -10 }}
                animate={{ opacity: 1, height: "auto", x: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
                className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full relative overflow-hidden group"
                size="lg"
              >
                <span className="relative z-10">Sign In</span>
                <motion.div
                  className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                />
              </Button>
            </motion.div>
          </form>

          <motion.div
            variants={itemVariants}
            className="mt-8 pt-6 border-t border-slate-100"
          >
            <div className="text-xs text-slate-400 uppercase font-semibold text-center mb-4 tracking-wider">
              Test Credentials
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ y: -5, borderColor: '#3b82f6' }}
                className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center cursor-default transition-colors"
              >
                <div className="flex justify-center mb-2 text-blue-600">
                  <ShieldCheck size={20} />
                </div>
                <div className="font-medium text-slate-700 text-sm">Admin</div>
                <div className="text-xs text-slate-500 mt-1">admin / admin123</div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5, borderColor: '#14b8a6' }}
                className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center cursor-default transition-colors"
              >
                <div className="flex justify-center mb-2 text-teal-600">
                  <UserCircle size={20} />
                </div>
                <div className="font-medium text-slate-700 text-sm">Citizen</div>
                <div className="text-xs text-slate-500 mt-1">citizen / citizen123</div>
              </motion.div>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
