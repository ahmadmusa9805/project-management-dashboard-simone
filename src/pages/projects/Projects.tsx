import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomCreateButton from "../../components/CustomCreateButton";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";
import CreateProjectForm from "./CreatedAndEditProjectForm";
import type { z } from "zod";
import type { projectSchema } from "../../types/projectAllTypes/projectSchema";
import { Drawer, Modal } from "antd";
import CustomShareSelector from "../../components/CustomShareSelector";

type ProjectForm = z.infer<typeof projectSchema>;

const Projects = () => {
  const navigate = useNavigate();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [sharedProjectId, setSharedProjectId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<ProjectForm | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const projects = [
    { id: 1, title: "Green Villa Renovation", status: "Ongoing" },
    { id: 2, title: "TechHub Extension", status: "Ongoing" },
    { id: 3, title: "Skyline Apartment", status: "Ongoing" },
  ];

  const mockUsers = [
    { id: 1, name: "Jonathan Swift", avatar: "https://placehold.co/40x40" },
    { id: 2, name: "Emily Carter", avatar: "https://placehold.co/40x40" },
    { id: 3, name: "David Miller", avatar: "https://placehold.co/40x40" },
  ];

  const handleMoreClick = (key: string, projectId: number) => {
    // Simulate fetch or set dummy data for now
    const selectedProject = projects.find((p) => p.id === projectId);
    switch (key) {
      case "view":
        navigate(`/projects/${projectId}`);
        break;
      case "edit":
        if (selectedProject) {
          // You should fetch actual project data here from API
          setEditProject({
            projectName: selectedProject.title,
            clientName: "Demo Client",
            projectType: "Renovation",
            description: "Editing project...",
            startDate: "2024-10-01",
            estimatedCompletionDate: "2024-12-31",
            contractDate: "2024-09-20",
            contractReference: "REF-001",
            contractValue: 100000,
            estimatedBudget: 120000,
            overheadCost: 10000,
            billingCurrency: "USD",
            projectAddress: "123 Project Street",
            primaryContact: "John Doe",
            contractPdf: undefined,
            milestones: [],
            team: [],
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

  const handleEditProject = (data: ProjectForm) => {
    console.log("Project Updated:", data);
    setIsEditOpen(false);
  };

  const handleShare = (userIds: number[]) => {
    console.log(`Project ${sharedProjectId} shared with users:`, userIds);
    setIsShareOpen(false);
    setSharedProjectId(null);
  };

  return (
    <>
      <div className="w-full px-4 flex flex-col gap-4">
        {/* Create Button */}
        <div className="w-full flex justify-end">
          <CustomCreateButton
            title="Create Project"
            onClick={() => setIsCreateOpen(true)}
          />
        </div>

        {/* Project Cards */}
        {projects.map((project) => (
          <div
            key={project.id}
            className="w-full px-4 py-2.5 bg-[#F1F1F1] flex items-center gap-2.5"
          >
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-[22px] h-[20px] absolute left-[1px] top-[2px] bg-[#6B7374]" />
            </div>

            <div className="flex-1 flex items-center gap-2.5">
              <div className="text-[#2B3738] text-base font-ibm font-medium leading-[23.52px]">
                {project.title}
              </div>
            </div>

            <div className="px-1 py-0.5 bg-[#ECF1E6] rounded-full flex items-center gap-2.5">
              <div className="text-[#457205] text-xs font-ibm font-medium leading-[15.6px] tracking-[0.36px]">
                {project.status}
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
          roles={["Admin", "Editor", "Client"]}
          users={mockUsers}
          onShare={handleShare}
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
          />
        )}
      </Drawer>
    </>
  );
};

export default Projects;
