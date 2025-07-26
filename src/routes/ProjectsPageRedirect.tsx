// import { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import OngoingProjects from "../pages/projects/OngoingProjects";

// const ProjectsPageRedirect = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!searchParams.get("status")) {
//       navigate("/projects?status=ongoing", { replace: true });
//     }
//   }, [searchParams, navigate]);

//   return ;
// };

// export default ProjectsPageRedirect;
// // 