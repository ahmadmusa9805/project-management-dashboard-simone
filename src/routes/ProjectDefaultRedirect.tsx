// 📂routes/ProjectDefaultRedirect.tsx
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/app/store";
import { USER_ROLE } from "../types/userAllTypes/user";
type Role = "superAdmin" | "primeAdmin" | "basicAdmin" | "client";
const ProjectDefaultRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!projectId || !user) return;

    const role = user.role as Role;

    // Match sidebar default page logic
    if (([USER_ROLE.superAdmin, USER_ROLE.primeAdmin] as Role[]).includes(role)) {
 
      navigate(`/projects/${projectId}/dashboard`, { replace: true });
    } else if (role === USER_ROLE.client || role === USER_ROLE.basicAdmin) {
      navigate(`/projects/${projectId}/site-pictures-reports`, {
        replace: true,
      });
    } else {
      navigate("/not-found", { replace: true });
    }
  }, [navigate, projectId, user]);

  return null; // No UI
};

export default ProjectDefaultRedirect;
