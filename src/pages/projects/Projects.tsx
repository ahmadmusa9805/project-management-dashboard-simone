import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomCreateButton from "../../components/CustomCreateButton";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";
import CreateProjectForm from "./CreatedAndEditProjectForm";
import { Drawer, Modal } from "antd";
import CustomShareSelector from "../../components/CustomShareSelector";
import { useGetProjectsQuery } from "../../Redux/features/projects/projectsApi";
import { RefreshCw, ShieldCheckIcon } from "lucide-react";
import { showDeleteAlert } from "../../utils/deleteAlert";

const Projects = () => {
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [sharedProjectId, setSharedProjectId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get("status") || "ongoing";

  const {
    data: projects = [],
    refetch,
  } = useGetProjectsQuery({ status: statusFilter });

  const deleteProject = (projectId: number) => {
    showDeleteAlert({
      title: "Do you really want to delete this project?",
      text: "You won’t be able to recover this project!",
      onConfirm: () => {
        const projectToDelete = projects.find((p) => p.id === projectId);
        if (!projectToDelete) return;

        console.log("Deleting project ID:", projectId);
        refetch();
      },
    });
  };

  const handleMoreClick = (key: string, projectId: number) => {
    const selectedProject = projects.find((p) => p.id === projectId);
    switch (key) {
      case "view":
        navigate(`/projects/${projectId}`);
        break;
      case "edit":
        if (selectedProject) {
          setEditProject({
            ...selectedProject,
            projectName: selectedProject.projectName || selectedProject.title,
          });
          setIsEditOpen(true);
        }
        break;
      case "share":
        setSharedProjectId(projectId);
        setIsShareOpen(true);
        break;
      case "delete":
        deleteProject(projectId);
        break;
    }
  };

  return (
    <>
      <div className="w-full px-4 flex flex-col gap-4 bg-white min-h-screen">
        <div className="w-full flex justify-end mt-3">
          <CustomCreateButton
            title="Create Project"
            onClick={() => setIsCreateOpen(true)}
          />
        </div>

        {projects?.map((project) => (
          <div className="hover:bg-[#e6f4ea] bg-[#f1f1f1]" key={project.id}>
            <div className="w-full px-4 py-2.5 flex items-center gap-2.5">
              <div className="w-6 h-6 relative overflow-hidden">
                {project.timeline.status === "ongoing" ? <RefreshCw /> : <ShieldCheckIcon />}
              </div>
              <div className="flex-1 flex items-center gap-2.5">
                <div className="text-[#2B3738] text-base font-ibm font-medium">
                  {project.projectName}
                </div>
              </div>
              <div className="px-1 py-0.5 rounded-full flex items-center">
                <div className="text-[#457205] text-xs font-ibm font-medium">
                  {project.timeline.status}
                </div>
              </div>
              <div
                className="w-[158px] h-full p-2 flex items-center gap-1 cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="text-black text-xs font-ibm font-medium">
                  View details
                </div>
              </div>
              <CustomViewMoreButton
                items={[
                  { key: "view", label: "View Project Details" },
                  { key: "edit", label: "Edit Project" },
                  { key: "share", label: "Share Project" },
                  { key: "delete", label: "Delete Project" },
                ]}
                onClick={(key) => handleMoreClick(key, project.id)}
              />
            </div>
          </div>
        ))}
      </div>

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
          onShare={(selectedIds) => console.log("Shared with:", selectedIds)}
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
        <CreateProjectForm onSubmit={() => {}} submitText="Create Project" />
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
            onSubmit={() => {}}
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
