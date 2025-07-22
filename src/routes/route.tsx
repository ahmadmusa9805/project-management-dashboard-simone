import React from "react";
import { BrowserRouter as Router, Routes, Route,  } from "react-router-dom";
import LoginPage from "../pages/authPages/LoginPage";
import WelcomePage from "../pages/WelcomePage";
import CostManagementPage from "../pages/CostManagementPage";
import PaymentTrackerPage from "../pages/PaymentTrackerPage";
import HandoverToolPage from "../pages/HandoverToolPage";
import NotesPage from "../pages/NotesPage";
import SnaggingListPage from "../pages/SnaggingListPage";
import NotFoundPage from "../pages/NotFoundPage";
import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import DashbordPage from "../pages/DashbordPage";
import OngoingProjects from "../pages/projects/ongoingProjects/OngoingProjects";
import ProjectDetailPage from "../pages/projects/ProjectDetailPage";




// Import your page components here

// Example role-based route guard (replace with your actual auth logic)


const AppRoutes: React.FC = () => (
    
        <Routes>
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            
 {/* Project List: All roles */}                             
            <Route
                path="/dashboard" 
                element={
                    <ProtectedRoute allowedRoles={["super-admin", "prime-admin", "basic-admin", "client"]}>
                         <DashboardLayout>
                            <DashbordPage></DashbordPage>
                         </DashboardLayout>
                       
                    </ProtectedRoute>
                }
            />


            {/* Project List: All roles */}                             
            <Route
                path="/projects" 
                element={
                    <ProtectedRoute allowedRoles={["super-admin", "prime-admin", "basic-admin", "client"]}>
                         <DashboardLayout>
                            <OngoingProjects></OngoingProjects>
                         </DashboardLayout>
                       
                    </ProtectedRoute>
                }
            />

           

            {/* Project Details: All roles */}
            <Route
                path="/projects/:id"
                element={
                    <ProtectedRoute allowedRoles={["super-admin", "prime-admin", "basic-admin", "client"]}>
                        <DashboardLayout>
                            <ProjectDetailPage />
                        </DashboardLayout>
                       
                    </ProtectedRoute>
                }
            />

            {/* Cost Management: Super & Prime Admin only */}
            <Route
                path="/cost-management"
                element={
                    <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
                        <CostManagementPage />
                    </ProtectedRoute>
                }
            />

            {/* Payment Tracker: Super & Prime Admin only */}
            <Route
                path="/payment-tracker"
                element={
                    <ProtectedRoute allowedRoles={["super-admin", "prime-admin"]}>
                        <PaymentTrackerPage />
                    </ProtectedRoute>
                }
            />

            {/* Handover Tool: All admins */}
            <Route
                path="/handover-tool"
                element={
                    <ProtectedRoute allowedRoles={["super-admin", "prime-admin", "basic-admin"]}>
                        <HandoverToolPage />
                    </ProtectedRoute>
                }
            />

            {/* Notes: All roles */}
            <Route
                path="/notes"
                element={
                    <ProtectedRoute allowedRoles={["super-admin", "prime-admin", "basic-admin", "client"]}>
                        <NotesPage />
                    </ProtectedRoute>
                }
            />

            {/* Snagging List: All roles */}
            <Route
                path="/snagging-list"
                element={
                    <ProtectedRoute allowedRoles={["super-admin", "prime-admin", "basic-admin", "client"]}>
                        <SnaggingListPage />
                    </ProtectedRoute>
                }
            />

     
 <Route path="*" element={<NotFoundPage />} />
        </Routes>
   
);



export default AppRoutes;