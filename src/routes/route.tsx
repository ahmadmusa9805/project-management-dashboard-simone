// import React from "react";
// import { BrowserRouter as Router, Routes, Route,  } from "react-router-dom";
// import LoginPage from "../pages/authPages/LoginPage";
// import WelcomePage from "../pages/WelcomePage";
// import HandoverToolPage from "../pages/HandoverToolPage";
// import NotesPage from "../pages/NotesPage";
// import SnaggingListPage from "../pages/SnaggingListPage";
// import NotFoundPage from "../pages/NotFoundPage";
// import DashboardLayout from "../layout/DashboardLayout";
// import ProtectedRoute from "./ProtectedRoute";
// import DashbordPage from "../pages/DashbordPage";
// import AdminTable from "../pages/user/UserManagement";
// import OngoingProjects from "../pages/projects/OngoingProjects";
// import UserProfileEdit from "../pages/user/UserProfileEdit";
// import ProjectDashboard from "../pages/projects/specificProjectDetails/ProjectDashboard";
// import ProjectDetailsPage from "../pages/projects/specificProjectDetails/ProjectDetailsPage";
// import QuoteDetailsPage from "../pages/projects/specificProjectDetails/QuoteDetailsPage";
// import InterimEvaluationPage from "../pages/projects/specificProjectDetails/InterimEvaluationPage";
// import SitePicturesReportsPage from "../pages/projects/specificProjectDetails/SitePicturesReportsPage";
// import CertificatesPage from "../pages/projects/specificProjectDetails/CertificatesPage";
// import DocumentsPage from "../pages/projects/specificProjectDetails/DocumentsPage";
// import SecondFixedListPage from "../pages/projects/specificProjectDetails/SecondFixedListPage";
// import TimeSchedulePage from "../pages/projects/specificProjectDetails/TimeSchedulePage";
// import ClientDetailsPage from "../pages/projects/specificProjectDetails/ClientDetailsPage";

// // Import your page components here

// // Example role-based route guard (replace with your actual auth logic)

// const AppRoutes: React.FC = () => (

//         <Routes>
//             <Route path="/welcome" element={<WelcomePage />} />
//             <Route path="/login" element={<LoginPage />} />

//  {/* Project List: All roles */}

// {/*
// <Route
//   path="/projects/:projectId"
//   element={
//     <ProtectedRoute allowedRoles={["super-admin"]}>
//       <DashboardLayout ></DashboardLayout>
//     </ProtectedRoute>
//   }
// >
//   <Route path="dashboard" element={<ProjectDashboard />} />
//   <Route path="details" element={<ProjectDetailsPage />} />
//   <Route path="quote-details" element={<QuoteDetailsPage />} />
//   <Route path="interim-evaluation" element={<InterimEvaluationPage />} />
//   <Route path="site-pictures-reports" element={<SitePicturesReportsPage />} />
//   <Route path="certificates" element={<CertificatesPage />} />
//   <Route path="documents" element={<DocumentsPage />} />
//   <Route path="second-fixed-list-material" element={<SecondFixedListPage />} />
//   <Route path="time-schedule" element={<TimeSchedulePage />} />
//   <Route path="client-details" element={<ClientDetailsPage />} />
//   <Route path="handover-tool" element={<HandoverToolPage />} />
//   <Route path="notes" element={<NotesPage />} />
//   <Route path="snagging-list" element={<SnaggingListPage />} />
// </Route>
//       */}

//  <Route
//       path="/projects/:projectId"
//       element={
//         <ProtectedRoute allowedRoles={["super-admin", "prime-admin", "basic-admin", "client"]}>
//           <DashboardLayout />
//         </ProtectedRoute>
//       }
//     >
//       <Route path="dashboard" element={<ProjectDashboard />} />
//       <Route path="details" element={<ProjectDetailsPage />} />
//       <Route path="quote-details" element={<QuoteDetailsPage />} />
//       <Route path="interim-evaluation" element={<InterimEvaluationPage />} />
//       <Route path="site-pictures-reports" element={<SitePicturesReportsPage />} />
//       <Route path="certificates" element={<CertificatesPage />} />
//       <Route path="documents" element={<DocumentsPage />} />
//       <Route path="second-fixed-list-material" element={<SecondFixedListPage />} />
//       <Route path="time-schedule" element={<TimeSchedulePage />} />
//       <Route path="client-details" element={<ClientDetailsPage />} />
//       <Route path="snagging-list" element={<SnaggingListPage />} />
//       <Route path="handover-tool" element={<HandoverToolPage />} />
//       <Route path="notes" element={<NotesPage />} />
//     </Route>

// {/* <Route path="/projects/:projectId/interim-evaluation" element={
//   <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
//     <DashboardLayout><InterimEvaluationPage /></DashboardLayout>
//   </ProtectedRoute>
// } />

// <Route path="/projects/:projectId/site-pictures-reports" element={
//   <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
//     <DashboardLayout><SitePicturesReportsPage /></DashboardLayout>
//   </ProtectedRoute>
// } />

// <Route path="/projects/:projectId/certificates" element={
//   <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
//     <DashboardLayout><CertificatesPage /></DashboardLayout>
//   </ProtectedRoute>
// } />

// <Route path="/projects/:projectId/documents" element={
//   <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
//     <DashboardLayout><DocumentsPage /></DashboardLayout>
//   </ProtectedRoute>
// } />

// <Route path="/projects/:projectId/second-fixed-list-material" element={
//   <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
//     <DashboardLayout><SecondFixedListPage /></DashboardLayout>
//   </ProtectedRoute>
// } />

// <Route path="/projects/:projectId/time-schedule" element={
//   <ProtectedRoute allowedRoles={["super-admin", "prime-admin", "basic-admin"]}>
//     <DashboardLayout><TimeSchedulePage /></DashboardLayout>
//   </ProtectedRoute>
// } />

// <Route path="/projects/:projectId/client-details" element={
//   <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
//     <DashboardLayout><ClientDetailsPage /></DashboardLayout>
//   </ProtectedRoute>
// } />
//  */}

//  <Route path="*" element={<NotFoundPage />} />
//         </Routes>

// );

// export default AppRoutes;

import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/authPages/LoginPage";
import WelcomePage from "../pages/WelcomePage";
import HandoverToolPage from "../pages/HandoverToolPage";
import NotesPage from "../pages/NotesPage";
import SnaggingListPage from "../pages/SnaggingListPage";
import NotFoundPage from "../pages/NotFoundPage";
import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import DashbordPage from "../pages/dashbord/DashbordPage";
import AdminTable from "../pages/user/UserManagement";
import OngoingProjects from "../pages/projects/OngoingProjects";
import UserProfileEdit from "../pages/user/UserProfileEdit";
import ProjectDashboard from "../pages/projects/specificProjectDetails/ProjectDashboard";
import ProjectDetailsPage from "../pages/projects/specificProjectDetails/ProjectDetailsPage";
import QuoteDetailsPage from "../pages/projects/specificProjectDetails/QuoteDetailsPage";
import InterimEvaluationPage from "../pages/projects/specificProjectDetails/InterimEvaluationPage";
import SitePicturesReportsPage from "../pages/projects/specificProjectDetails/SitePicturesReportsPage";
import CertificatesPage from "../pages/projects/specificProjectDetails/CertificatesPage";
import DocumentsPage from "../pages/projects/specificProjectDetails/DocumentsPage";
import SecondFixedListPage from "../pages/projects/specificProjectDetails/SecondFixedListPage";
import TimeSchedulePage from "../pages/projects/specificProjectDetails/TimeSchedulePage";
import ClientDetailsPage from "../pages/projects/specificProjectDetails/ClientDetailsPage";
import ReusableDocumentPage from "../components/ReusableDocumentPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<WelcomePage />} />

      {/* Protected Parent Route with Layout */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "super-admin",
              "prime-admin",
              "basic-admin",
              "client",
            ]}
          >
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Main Menu Routes */}
        <Route path="/dashboard" element={<DashbordPage />} />
        <Route path="/profile" element={<UserProfileEdit />} />
        <Route path="/projects" element={<OngoingProjects />} />
        <Route path="/prime-admins" element={<AdminTable />} />
        <Route path="/basic-admins" element={<AdminTable />} />
        <Route path="/clients" element={<AdminTable />} />

        {/* Project-specific Nested Routes */}
        <Route path="/projects/:projectId">
          <Route path="dashboard" element={<ProjectDashboard />} />
          <Route path="details" element={<ProjectDetailsPage />} />
          <Route path="quote-details" element={<QuoteDetailsPage />} />
          <Route
            path="interim-evaluation"
            element={<InterimEvaluationPage />}
          />
          <Route
            path="site-pictures-reports"
            element={<SitePicturesReportsPage />}
          />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route
            path="second-fixed-list-material"
            element={<SecondFixedListPage />}
          />
          <Route path="time-schedule" element={<TimeSchedulePage />} />
          <Route path="client-details" element={<ClientDetailsPage />} />
          <Route path="handover-tool" element={<HandoverToolPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="snagging-list" element={<SnaggingListPage />} />

          <Route path="quote-documents" element={<ReusableDocumentPage />} />
          <Route path="interim-documents" element={<ReusableDocumentPage  />} />

        </Route>
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
