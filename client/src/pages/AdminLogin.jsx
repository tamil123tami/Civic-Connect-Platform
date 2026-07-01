import { useNavigate } from "react-router-dom";
import { loginAs } from "../utils/auth";

const AdminLogin = () => {
  const navigate = useNavigate();

  const login = () => {
    loginAs("admin");
    navigate("/admin");
  };

  return (
    <div style={styles.container}>
      <h1>🏛️ Admin Login</h1>
      <button onClick={login} style={styles.btn}>
        Continue
      </button>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    background: "#0f172a",
    color: "white",
  },
  btn: {
    padding: "12px 20px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: 10,
  },
};

export default AdminLogin;
