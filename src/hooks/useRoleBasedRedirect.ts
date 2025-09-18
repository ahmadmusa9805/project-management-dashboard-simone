// src/hooks/useRoleBasedRedirect.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/app/store";
import { USER_ROLE } from "../types/userAllTypes/user";

const useRoleBasedRedirect = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user?.role) return;

    if (user.role === USER_ROLE.superAdmin || user.role === USER_ROLE.primeAdmin) {
      navigate("/dashboard", { replace: true });
    } else if (user.role === USER_ROLE.basicAdmin || user.role === USER_ROLE.client) {
      navigate("/projects", { replace: true });
    } else {
      navigate("/unauthorized", { replace: true });
    }
  }, [navigate, user?.role]);
};

export default useRoleBasedRedirect;
