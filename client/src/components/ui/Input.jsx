import { cn } from "../../lib/utils";

const Input = ({ className, error, ...props }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <input
                className={cn(
                    "px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400 bg-white shadow-sm",
                    error && "border-red-500 focus:ring-red-500",
                    className
                )}
                {...props}
            />
            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
};

export default Input;
