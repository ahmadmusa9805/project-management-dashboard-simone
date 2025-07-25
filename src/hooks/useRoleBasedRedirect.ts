// src/hooks/useRoleBasedRedirect.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useRoleBasedRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role) return;

    if (role === "super-admin" || role === "prime-admin") {
      navigate("/dashboard", { replace: true });
    } else if (role === "basic-admin" || role === "client") {
      navigate("/projects", { replace: true });
    } else {
      navigate("/unauthorized", { replace: true });
    }
  }, [navigate]);
};

export default useRoleBasedRedirect;
