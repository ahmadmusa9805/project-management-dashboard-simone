/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal, Spin, Card, Typography, Divider, Button } from "antd";
import {
  useGetSingleProjectQuery,
  useUnShareProjectMutation,
} from "../../Redux/features/projects/projectsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { successAlert } from "../../utils/alerts";

const { Title, Text } = Typography;

interface ProjectDetailsModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string | null;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  open,
  onClose,
  projectId,
}) => {
  // Fetch single project details
  const {
    data: project,
    isLoading,
    error,
    refetch,
  } = useGetSingleProjectQuery(projectId ? { id: projectId } : skipToken);

  // Unshare mutation hook
  const [unShareProject, { isLoading: isUnsharing }] =
    useUnShareProjectMutation();

  // Handle unshare action
  const handleUnshare = async (userId: string) => {
    if (!projectId) return;
    try {
      await unShareProject({ id: projectId, unShareWith: [userId] }).unwrap();
      successAlert("User unshared from project successfully.");
      refetch(); // Refresh project details after unsharing
    } catch (error) {
      console.error("Failed to unshare user", error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <Title level={4} style={{ marginBottom: 0 }}>
          📁 Project Details
        </Title>
      }
      centered
      width={600}
    >
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </div>
      ) : error || !project ? (
        <div style={{ textAlign: "center", color: "red" }}>
          ❌ Failed to load project details.
        </div>
      ) : (
        <Card
          bordered={false}
          style={{ backgroundColor: "#f9f9f9", borderRadius: 8 }}
        >
          <div style={{ padding: "12px 0" }}>
            <Text strong>📌 Project Name:</Text>{" "}
            <Text>{project.projectName}</Text>
            <Divider />
            <Text strong>📊 Status:</Text>{" "}
            <Text
              type={
                project.status.toLowerCase() === "completed"
                  ? "success"
                  : "warning"
              }
            >
              {project.status}
            </Text>
            <Divider />
            <Text strong>👤 Client:</Text> <Text>{project.clientName}</Text>
            <Divider />
            <Text strong>📧 Email:</Text> <Text>{project.clientEmail}</Text>
            <Divider />
            <Text strong>📝 Description:</Text>
            <p style={{ marginTop: 4 }}>{project.description}</p>
            <Divider />
            <Text strong>📅 Start Date:</Text> <Text>{project.startDate}</Text>
            <Divider />
            <Text strong>📅 End Date:</Text> <Text>{project.endDate}</Text>
            <Divider />
            <Text strong>💰 Value:</Text> <Text>${project.value}</Text>
            <Divider />
            <Text strong>📞 Contact:</Text> <Text>{project.contact}</Text>
            {project.sharedWith?.length > 0 && (
              <>
                <Divider />
                <Text strong>🤝 Shared With:</Text>
                <div style={{ marginTop: 8 }}>
                  {project.sharedWith.map((share: any) => {
                    const user =
                      typeof share.userId === "object"
                        ? share.userId
                        : { _id: share.userId };
                    const role = share?.role ?? "Unknown";

                    return (
                      <div
                        key={share._id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <span>
                          👤 User ID: {user._id} | Role: <strong>{role}</strong>
                        </span>
                        <Button
                          size="small"
                          danger
                          loading={isUnsharing}
                          onClick={() => handleUnshare(user._id)}
                        >
                          Unshare
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </Card>
      )}
    </Modal>
  );
};

export default ProjectDetailsModal;
