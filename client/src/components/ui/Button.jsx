import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

const Button = ({ children, variant = "primary", className, ...props }) => {
    const baseStyles =
        "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg",
        secondary: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-400 shadow-md hover:shadow-lg",
        outline: "border-2 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 focus:ring-blue-500",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
