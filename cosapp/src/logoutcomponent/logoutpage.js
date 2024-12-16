import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();
  const logoSrc = "./UNextLogo2.png";

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      navigate("/logout", { replace: true });
    };
  }, [navigate]);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.logoutBox}>
      <img src={logoSrc} alt="Logo" style={styles.logo} />
        <h5 style={styles.message}>
          You have been logged out! Thank you for taking this survey.
        </h5>
        <h5 style={styles.message}>
          Contact for Results: <strong><font color="blue"></font>admin@survey.u-next.com</strong>.
        </h5>
        <h5 style={styles.message}>Please close this page or log in again.</h5>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
    width:"500px",
    backgroundColor: "rgb(209, 79, 19)",
  },

  logo: {
    width: "150px", // Adjust the size of the logo as needed
    margin: "0 auto 20px auto",
    display: "block",
  },
  logoutBox: {
    width: "90%",
    maxWidth: "600px",
    padding: "20px",
    textAlign: "center",
    backgroundColor:"#F79646",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    border: "1px solid #ddd",
    
    
  },
  message: {
    fontSize: "12px",
    color: "white",
    margin: "10px 0",
    lineHeight: "1.5",
  },
};

export default LogoutPage;
