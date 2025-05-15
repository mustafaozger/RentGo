import React from "react";
import { useNavigate } from "react-router-dom";
import successTick from "../assets/icons/tick.png"; 

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <img src={successTick} alt="success" style={styles.tick} />
      <h1 style={styles.title}>Siparişiniz Başarıyla Oluşturuldu</h1>

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/")}>  
          <img src={successTick} alt="tick" style={styles.icon} /> Kiralamaya Devam Et
        </button>

        <button style={styles.buttonSecondary} onClick={() => navigate("/account")}>  
          <img src={successTick} alt="tick" style={styles.icon} /> Aktif Kiralamalarım
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  tick: {
    width: "100px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    color: "#4B0082",
    marginBottom: "40px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  button: {
    backgroundColor: "#6a1b9a",
    color: "white",
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  buttonSecondary: {
    backgroundColor: "#8e24aa",
    color: "white",
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  icon: {
    width: "20px",
  },
};

export default OrderSuccessPage;
