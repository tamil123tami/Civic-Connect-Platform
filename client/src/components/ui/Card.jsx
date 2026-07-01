import { cn } from "../../lib/utils";

const Card = ({ children, className, ...props }) => {
    return (
        <div
            className={cn(
                "bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
