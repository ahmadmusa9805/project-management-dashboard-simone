
import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/app/store";

const ProjectDefaultRedirect = () => {
  const { projectId } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role;

  if (!projectId) return null;

  if (role === "super-admin" || role === "prime-admin") {
    return <Navigate to={`/projects/${projectId}/dashboard`} replace />;
  } else {
    return <Navigate to={`/projects/${projectId}/handover-tool`} replace />;
  }
};

export default ProjectDefaultRedirect;
