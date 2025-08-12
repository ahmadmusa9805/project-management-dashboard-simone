/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// src/pages/Projects/Projects.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Drawer, Modal, Spin } from "antd";
import { HourglassIcon, RefreshCw, ShieldCheckIcon } from "lucide-react";

import CustomCreateButton from "../../components/CustomCreateButton";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";
import CustomShareSelector from "../../components/CustomShareSelector";
import CreateProjectForm from "./CreatedAndEditProjectForm";

import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectsWithstatusQuery,
  useShareProjectMutation,
  // useUnShareProjectMutation,
  useUpdateProjectMutation,
} from "../../Redux/features/projects/projectsApi";

import { showDeleteAlert } from "../../utils/deleteAlert";
import { successAlert } from "../../utils/alerts";
import type { projectSchema } from "../../types/projectAllTypes/projectSchema";
import type z from "zod";
import ProjectDetailsModal from "./SingleProjectDetails";

type ProjectForm = z.infer<typeof projectSchema>;

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [sharedProjectId, setSharedProjectId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryParams = new URLSearchParams(location.search);

  const statusFilter = queryParams.get("status") ?? "pending";
  const status = queryParams.get("status");
  const {
    data: projects = [],
    isLoading,
    refetch,
  } = useGetProjectsWithstatusQuery({
    status: statusFilter,
  });
  const [shareProject] = useShareProjectMutation();

  // const [unShareProject] = useUnShareProjectMutation();

  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const handleViewDetails = (id: string) => {
    setSelectedProjectId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProjectId(null);
    setIsModalOpen(false);
  };

  const handleDelete = (projectId: string) => {
    const projectToDelete = projects.find((p) => p._id === projectId);
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

  const handleMoreClick = (key: string, projectId: string) => {
    const selectedProject = projects.find((p) => p._id === projectId);
    switch (key) {
      case "view":
        handleViewDetails(projectId);

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

  if (isLoading) return <Spin />;

  return (
    <>
      <div className="w-full px-4 flex flex-col gap-4 bg-white min-h-screen pt-3">
        {status === "pending" ? (
          <h2 className="text-xl font-semibold px-4">Pending Projects</h2>
        ) : status === "ongoing" ? (
          <h2 className="text-xl font-semibold px-4">Ongoing Projects</h2>
        ) : status === "completed" ? (
          <h2 className="text-xl font-semibold px-4">Completed Projects</h2>
        ) : null}

        {statusFilter === "pending" && (
          <div className="w-full flex justify-end mt-3">
            <CustomCreateButton
              title="Create Project"
              onClick={() => setIsCreateOpen(true)}
            />
          </div>
        )}
        {projects.map((project) => (
          <div key={project._id} className="hover:bg-[#e6f4ea] bg-[#f1f1f1]">
            <div className="w-full px-4 py-2.5 flex items-center gap-2.5">
              <div className="w-6 h-6">
                {project.status === "pending" ? (
                  <HourglassIcon className="text-green-500" />
                ) : project.status === "ongoing" ? (
                  <RefreshCw className="text-green-500" />
                ) : (
                  <ShieldCheckIcon className="text-green-500" />
                )}
              </div>
              <div className="flex-1 text-base font-medium">
                {project.projectName}
              </div>
              <div className="text-xs text-[#457205]">{project.status}</div>
              <div
                className="cursor-pointer text-xs"
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                View details
              </div>
              <CustomViewMoreButton
                items={[
                  { key: "view", label: "View Project Details" },
                  { key: "edit", label: "Edit Project" },
                  { key: "share", label: "Share Project" },
                  { key: "delete", label: "Delete Project" },
                ]}
                onClick={(key) => handleMoreClick(key, project._id)}
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
          roles={["primeAdmin", "basicAdmin", "Client"]}
          onShare={async (selectedUsers) => {
            if (!selectedUsers.length || !sharedProjectId) return;
            try {
              console.log(selectedUsers, "selectedUsers payload");
              await shareProject({
                id: sharedProjectId,
                sharedWith: selectedUsers, // <-- array of { userId, role }
              }).unwrap();

              successAlert("Project shared successfully");
              setIsShareOpen(false);
              setSharedProjectId(null);
              refetch();
            } catch (error) {
              console.error("Share failed", error);
            }
          }}
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
          onSubmit={async (formData: ProjectForm) => {
            try {
              const body = new FormData();

              // Append file
              const fileObj = formData.contractFile?.originFileObj;
              if (fileObj) {
                body.append("file", fileObj); // 🟢 backend expects `file`
              }

              // Append rest of form data as JSON string
              const { contractFile, ...rest } = formData;
              body.append("data", JSON.stringify(rest)); // 🟢 backend middlewa
              await createProject(body).unwrap();
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
            key={editProject._id}
            defaultValues={editProject}
            isEdit
            submitText="Update Project"
            onSubmit={async (data) => {
              try {
                await updateProject({
                  id: editProject._id,
                  data,
                }).unwrap();
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

      <ProjectDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        projectId={selectedProjectId}
      />
    </>
  );
};

export default Projects;
