import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; 


const WelcomePage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#001D01]">
      <div className="flex flex-col items-center">
        <img
          src={logo}
          alt="Logo"
          className={`w-32 h-32 mb-6 ${loading ? "animate-pulse" : ""}`}
        />
        <h1 className={`text-white text-3xl font-bold mb-6 ${loading ? "animate-pulse" : ""}`}>TheMVV.co.uk</h1>
      </div>
    </div>
  );
};

export default WelcomePage;