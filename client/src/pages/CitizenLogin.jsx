import { useNavigate } from "react-router-dom";
import { loginAs } from "../utils/auth";

const CitizenLogin = () => {
  const navigate = useNavigate();

  const login = () => {
    loginAs("citizen");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h1>👤 Citizen Login</h1>
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
  },
  btn: {
    padding: "12px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 10,
  },
};

export default CitizenLogin;
