import { Navigate } from "react-router-dom";
import { getRole } from "../utils/auth";

const ProtectedRoute = ({ allowedRole, children }) => {
  const role = getRole();

  if (!role) {
    return <Navigate to="/" />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
