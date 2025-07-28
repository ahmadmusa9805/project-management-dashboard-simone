import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/authPages/LoginPage";
import WelcomePage from "../pages/WelcomePage";
import NotFoundPage from "../pages/NotFoundPage";
import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import ProjectDefaultRedirect from "./ProjectDefaultRedirect";

import DashbordPage from "../pages/dashbord/DashbordPage";
import AdminTable from "../pages/user/UserManagement";

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
import HandoverToolPage from "../pages/projects/specificProjectDetails/HandoverToolPage";
import NotesPage from "../pages/projects/specificProjectDetails/NotesPage";
import SnaggingListPage from "../pages/projects/specificProjectDetails/SnaggingListPage";
import ReusableDocumentPage from "../components/ReusableDocumentPage";
import CostManagementPage from "../pages/projects/specificProjectDetails/CostManagementPage";
import PaymentTrackerPage from "../pages/projects/specificProjectDetails/PaymentTrackerPage";

import LaborPage from "../pages/projects/specificProjectDetails/LaborPage";
import LabourManagementPage from "../pages/user/LabourManagementPage";

import ExpenseDocumentsPage from "../pages/projects/specificProjectDetails/ExpenseDocumentsPage";
import SitePicturesAndReportsViewPage from "../components/SitePicturesAndReportsViewPage";
import SubFoldersPage from "../pages/shared/SubFoldersPage";
import SubfolderFilesPage from "../pages/shared/SubfolderFilesPage";
import Projects from "../pages/projects/Projects";

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<WelcomePage />} />

    {/* Protected Routes with Layout */}
    <Route
      element={
        <ProtectedRoute
          allowedRoles={["super-admin", "prime-admin", "basic-admin", "client"]}
        >
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      {/* Profile and General Pages */}
      <Route path="/profile" element={<UserProfileEdit />} />
      {/* Dashboard only */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
            <DashbordPage />
          </ProtectedRoute>
        }
      />
      <Route path="/projects" element={<Projects />} />
      {/* Admin Pages (super-admin only) */}
      <Route
        path="/prime-admins"
        element={
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <AdminTable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/basic-admins"
        element={
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <AdminTable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <AdminTable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/labours"
        element={
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <LabourManagementPage></LabourManagementPage>
          </ProtectedRoute>
        }
      />
      {/* Project-specific nested routes */}
      <Route path="/projects/:projectId">
        {/* Redirect logic */}

        <Route
          index
          element={
            <ProtectedRoute
              allowedRoles={[
                "super-admin",
                "prime-admin",
                "basic-admin",
                "client",
              ]}
            >
              <ProjectDefaultRedirect />
            </ProtectedRoute>
          }
        />

        {/* Now protect each project route by role */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
              <ProjectDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="details"
          element={
            <ProtectedRoute
              allowedRoles={[
                "super-admin",
                "prime-admin",
                "basic-admin",
                "client",
              ]}
            >
              <ProjectDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="quote-details"
          element={
            <ProtectedRoute
              allowedRoles={["super-admin", "prime-admin", "client"]}
            >
              <QuoteDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="interim-evaluation"
          element={
            <ProtectedRoute
              allowedRoles={["super-admin", "prime-admin", "basic-admin"]}
            >
              <InterimEvaluationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="live-project-costs"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
              <CostManagementPage></CostManagementPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="payments-track"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
              <PaymentTrackerPage></PaymentTrackerPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="site-pictures-reports"
          element={
            <ProtectedRoute
              allowedRoles={["super-admin", "prime-admin", "basic-admin"]}
            >
              <SitePicturesReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="certificates"
          element={
            <ProtectedRoute
              allowedRoles={[
                "super-admin",
                "prime-admin",
                "basic-admin",
                "client",
              ]}
            >
              <CertificatesPage></CertificatesPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="documents"
          element={
            <ProtectedRoute
              allowedRoles={["super-admin", "prime-admin", "basic-admin"]}
            >
              <DocumentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="second-fixed-list-material"
          element={
            <ProtectedRoute
              allowedRoles={["super-admin", "prime-admin", "basic-admin"]}
            >
              <SecondFixedListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="time-schedule"
          element={
            <ProtectedRoute
              allowedRoles={["super-admin", "prime-admin", "basic-admin"]}
            >
              <TimeSchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="client-details"
          element={
            <ProtectedRoute
              allowedRoles={["super-admin", "prime-admin", "client"]}
            >
              <ClientDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="handover-tool"
          element={
            <ProtectedRoute
              allowedRoles={[
                "super-admin",
                "prime-admin",
                "basic-admin",
                "client",
              ]}
            >
              <HandoverToolPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="notes"
          element={
            <ProtectedRoute
              allowedRoles={[
                "super-admin",
                "prime-admin",
                "basic-admin",
                "client",
              ]}
            >
              <NotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="labour"
          element={
            <ProtectedRoute
              allowedRoles={["super-admin", "prime-admin", "basic-admin"]}
            >
              <LaborPage></LaborPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="snagging-list"
          element={
            <ProtectedRoute
              allowedRoles={[
                "super-admin",
                "prime-admin",
                "basic-admin",
                "client",
              ]}
            >
              <SnaggingListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="quote-documents"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
              <ReusableDocumentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="interim-documents"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
              <ReusableDocumentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="expense-documents"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
              <ExpenseDocumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="paymentrucker-documents"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
              <ReusableDocumentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="schedule-documents"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
              <ReusableDocumentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="site-pictures-reports/:folderId"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
              <SitePicturesAndReportsViewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/documents/:mainFolderId"
          element={
            <ProtectedRoute
              allowedRoles={["super-admin", "prime-admin", "basic-admin"]}
            >
              <SubFoldersPage baseRoute="documents"></SubFoldersPage>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/documents/:mainFolderId/:subFolderId"
          element={
            <ProtectedRoute
              allowedRoles={["super-admin", "prime-admin", "basic-admin"]}
            >
              <SubfolderFilesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/second-fixed-list-material/:mainFolderId"
          element={
            <ProtectedRoute
              allowedRoles={["super-admin", "prime-admin", "basic-admin"]}
            >
              <SubFoldersPage baseRoute="second-fixed-list-material"></SubFoldersPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/second-fixed-list-material/:mainFolderId/:subFolderId"
          element={
            <ProtectedRoute
              allowedRoles={["super-admin", "prime-admin", "basic-admin"]}
            >
              <SubfolderFilesPage />
            </ProtectedRoute>
          }
        />
      </Route>
      // Routes setup for HandoverTool with nested folder/subfolder
      <Route
        path="/projects/:projectId/handover-tool/:mainFolderId"
        element={
          <ProtectedRoute
            allowedRoles={["super-admin", "prime-admin", "basic-admin"]}
          >
            <SubFoldersPage baseRoute="handover-tool" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/handover-tool/:mainFolderId/:subFolderId"
        element={
          <ProtectedRoute
            allowedRoles={["super-admin", "prime-admin", "basic-admin"]}
          >
            <SubfolderFilesPage baseRoute="handover-tool" />
          </ProtectedRoute>
        }
      />
    </Route>

    {/* Catch all */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
