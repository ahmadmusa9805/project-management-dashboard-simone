import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomCreateButton from "../../components/CustomCreateButton";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";
import CreateProjectForm from "./CreatedAndEditProjectForm";
import type { z } from "zod";
import type {
  projectSchema,
  projectType,
} from "../../types/projectAllTypes/projectSchema";
import { Drawer, Modal } from "antd";
import CustomShareSelector from "../../components/CustomShareSelector";
import { useGetProjectsQuery } from "../../Redux/features/projects/projectsApi";
import { RefreshCw, ShieldCheckIcon } from "lucide-react";
import { useGetAllUsersQuery } from "../../Redux/features/users/usersApi";

type ProjectForm = z.infer<typeof projectSchema>;

const Projects = () => {
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [sharedProjectId, setSharedProjectId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<ProjectForm | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const location = useLocation();
 


  // Parse query params to get "status"
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get("status") || "ongoing";

  // use this statusFilter for your API query
  const {
    data: projects = [],
    isLoading,
    error,
    refetch,
  } = useGetProjectsQuery({ status: statusFilter });

  if (!isLoading && projects.length === 0) {
    return (
      <div className="w-full px-4 py-8 text-center text-gray-500 font-medium">
        No {statusFilter} projects found.
      </div>
    );
  }
  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    console.log(error);
  }

  // Show message if no projects for current status
  if (!isLoading && projects.length === 0) {
    return (
      <div className="w-full px-4 py-8 text-center text-gray-500 font-medium">
        No {statusFilter} projects found.
      </div>
    );
  }

  //  // Pass filter param if you want; or omit it to fetch all projects
  // const { data: projects = [], isLoading, error } = useGetProjectsQuery({ status: "ongoing" });

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error loading projects</div>;
  }

  // const projects = [
  //   { id: 1, title: "Green Villa Renovation", status: "Ongoing" },
  //   { id: 2, title: "TechHub Extension", status: "Ongoing" },
  //   { id: 3, title: "Skyline Apartment", status: "Ongoing" },
  // ];

  // const mockUsers = [
  //   { id: 1, name: "Jonathan Swift", avatar: "https://placehold.co/40x40" },
  //   { id: 2, name: "Emily Carter", avatar: "https://placehold.co/40x40" },
  //   { id: 3, name: "David Miller", avatar: "https://placehold.co/40x40" },
  // ];

  const handleMoreClick = (key: string, projectId: number) => {
    // Simulate fetch or set dummy data for now
    const selectedProject = projects.find(
      (p: { id: number }) => p.id === projectId
    );
    switch (key) {
      case "view":
        navigate(`/projects/${projectId}`);
        break;
      case "edit":
        if (selectedProject) {
          // You should fetch actual project data here from API
          setEditProject({
            projectName: selectedProject.projectName || selectedProject.title, // adjust according to your data shape
            clientName: selectedProject.clientName || "Demo Client",
            projectType: selectedProject.projectType || "Renovation",
            description: selectedProject.description || "Editing project...",
            startDate: selectedProject.startDate || "2024-10-01",
            estimatedCompletionDate:
              selectedProject.estimatedCompletionDate || "2024-12-31",
            contractDate: selectedProject.contractDate || "2024-09-20",
            contractReference: selectedProject.contractReference || "REF-001",
            contractValue: selectedProject.contractValue || 100000,
            estimatedBudget: selectedProject.estimatedBudget || 120000,
            overheadCost: selectedProject.overheadCost || 10000,
            billingCurrency: selectedProject.billingCurrency || "USD",
            projectAddress:
              selectedProject.projectAddress || "123 Project Street",
            primaryContact: selectedProject.primaryContact || "John Doe",
            contractPdf: selectedProject.contractPdf, // make sure this matches
            milestones: selectedProject.milestones || [],
            team: selectedProject.team || [],
            status: selectedProject.status || "ongoing", // important to prefill the status field
            // if you want to show createdAt (read-only)
          });
          setIsEditOpen(true);
        }
        break;

      case "share":
        setSharedProjectId(projectId);
        setIsShareOpen(true);
        break;
      case "removeShare":
        console.log("Remove shared access from", projectId);
        break;
    }
  };

  const handleCreateProject = (data: ProjectForm) => {
    console.log("New Project Created:", data);
    setIsCreateOpen(false);
  };

  const handleEditProject = async (data: ProjectForm) => {
    console.log("Project Updated:", data);

    // Call your API to update the project here, e.g., dispatch an RTK mutation
    // await updateProjectMutation(data);

    // Then refetch projects for current status filter:
    await refetch();

    setIsEditOpen(false);

    if (data.status && data.status !== statusFilter) {
      navigate(`/projects?status=${data.status}`);
    }
  };

  const handleShare = (userIds: number[]) => {
    console.log(`Project ${sharedProjectId} shared with users:`, userIds);
    setIsShareOpen(false);
    setSharedProjectId(null);
  };

  return (
    <>
      <div className="w-full px-4 flex flex-col gap-4 bg-white min-h-screen">
        {/* Create Button */}
        <div className="w-full flex justify-end mt-3">
          <CustomCreateButton
            title="Create Project"
            onClick={() => setIsCreateOpen(true)}
          />
        </div>

        {/* Project Cards */}
        {projects?.map((project: projectType) => (
          <div className="hover:bg-[#e6f4ea] bg-[#f1f1f1]">
            <div
              key={project.id}
              className="w-full px-4 py-2.5  flex items-center gap-2.5"
            >
              <div className="w-6 h-6 relative overflow-hidden">
                {project.timeline.status === "ongoing" ? (
                  <RefreshCw />
                ) : (
                  <ShieldCheckIcon />
                )}
              </div>

              <div className="flex-1 flex items-center gap-2.5">
                <div className="text-[#2B3738] text-base font-ibm font-medium leading-[23.52px]">
                  {project.projectName}
                </div>
              </div>

              <div className="px-1 py-0.5  rounded-full flex items-center gap-2.5">
                <div className="text-[#457205] text-xs font-ibm font-medium leading-[15.6px] tracking-[0.36px]">
                  {project.timeline.status}
                </div>
              </div>

              <div
                className="w-[158px] h-full p-2 flex items-center gap-1 cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="w-[14px] h-[14px] relative overflow-hidden">
                  <div className="w-[14px] h-[10.5px] absolute left-0 top-[1.75px] bg-[#2B3738]" />
                  <div className="w-[4.67px] h-[4.67px] absolute left-[4.67px] top-[4.67px] bg-[#2B3738]" />
                </div>
                <div className="text-black text-xs font-ibm font-medium leading-[15.6px] tracking-[0.36px]">
                  View details
                </div>
              </div>

              <CustomViewMoreButton
                items={[
                  { key: "view", label: "View Project Details" },
                  { key: "edit", label: "Edit Project" },
                  { key: "share", label: "Share Project" },
                  { key: "removeShare", label: "Remove Shared Access" },
                ]}
                onClick={(key) => handleMoreClick(key, project.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Shared Page Conditional Rendering */}
      <Modal
        open={isShareOpen}
        footer={null}
        onCancel={() => {
          setIsShareOpen(false);
          setSharedProjectId(null);
        }}
      >
        <CustomShareSelector
          roles={["Prime-Admin", "Basic-Admin", "Client"]}
           onShare={(selectedIds) => console.log("Shared with IDs:", selectedIds)}
        />
      </Modal>

      <Drawer
        title="Create Project"
        placement="right"
        width={600}
        onClose={() => setIsCreateOpen(false)}
        open={isCreateOpen}
        destroyOnClose
      >
        <CreateProjectForm
          onSubmit={handleCreateProject}
          submitText="Create Project"
        />
      </Drawer>

      <Drawer
        title="Edit Project"
        placement="right"
        width={600}
        onClose={() => setIsEditOpen(false)}
        open={isEditOpen}
        destroyOnClose
      >
        {editProject && (
          <CreateProjectForm
            onSubmit={handleEditProject}
            defaultValues={editProject}
            submitText="Update Project"
            isEdit={true}
          />
        )}
      </Drawer>
    </>
  );
};

export default Projects;
