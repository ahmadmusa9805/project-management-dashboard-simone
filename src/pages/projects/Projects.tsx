import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Drawer, Modal } from "antd";
import { RefreshCw, ShieldCheckIcon } from "lucide-react";

import CustomCreateButton from "../../components/CustomCreateButton";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";
import CustomShareSelector from "../../components/CustomShareSelector";
import CreateProjectForm from "./CreatedAndEditProjectForm";

import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from "../../Redux/features/projects/projectsApi";

import { showDeleteAlert } from "../../utils/deleteAlert";
import { successAlert } from "../../utils/alerts";

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [, setSharedProjectId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const queryParams = new URLSearchParams(location.search);
 
  const statusFilter = queryParams.get("status") || "ongoing";
  console.log(statusFilter)
  const {
    data: projects = [],
    refetch,
  } = useGetProjectsQuery({ status: statusFilter });

  console.log(projects)

  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  // ✅ DELETE Handler using showDeleteAlert + RTK Mutation
  const handleDelete = (projectId: number) => {
    const projectToDelete = projects.find((p) => p.id === projectId);
    if (!projectToDelete) return;

    showDeleteAlert({
      title: "Do you really want to delete this project?",
      text: "You won’t be able to recover this project!",
      onConfirm: async () => {
        try {
          await deleteProject(projectId).unwrap();
          successAlert("Project deleted successfully!");
          refetch();
        } catch (error) {
          console.error("Delete failed:", error);
        }
      },
    });
  };

  // Handle "View More" actions from dropdown
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
        handleDelete(projectId);
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
          <div
            key={project.id}
            className="hover:bg-[#e6f4ea] bg-[#f1f1f1]"
          >
            <div className="w-full px-4 py-2.5 flex items-center gap-2.5">
              <div className="w-6 h-6 relative overflow-hidden">
                {project.timeline.status === "ongoing" ? (
                  <RefreshCw />
                ) : (
                  <ShieldCheckIcon />
                )}
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

      {/* Share Modal */}
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

      {/* Create Drawer */}
      <Drawer
        title="Create Project"
        placement="right"
        width={600}
        onClose={() => setIsCreateOpen(false)}
        open={isCreateOpen}
        destroyOnClose
      >
        <CreateProjectForm
          onSubmit={async (data) => {
            console.log("Created: data", data);
            try {
              const result = await createProject(data).unwrap();
              console.log("Created:", result);
              successAlert("Project created successfully");
              setIsCreateOpen(false);
              refetch();
            } catch (err) {
              console.error("Create failed:", err);
            }
          }}
          submitText="Create Project"
        />
      </Drawer>

      {/* Edit Drawer */}
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
            defaultValues={editProject}
            isEdit
            submitText="Update Project"
            onSubmit={async (data) => {
              console.log("Updated data:", data);
              try {
                const result = await updateProject({
                  id: editProject.id,
                  data,
                }).unwrap();
                console.log("Updated:", result);
                successAlert("Project updated successfully");
                setIsEditOpen(false);
                refetch();
              } catch (err) {
                console.error("Update failed:", err);
              }
            }}
          />
        )}
      </Drawer>
    </>
  );
};

export default Projects;
