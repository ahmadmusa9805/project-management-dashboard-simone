import { Modal, Spin, Card, Typography, Divider } from "antd";
import { useGetSingleProjectQuery } from "./projectsApi";
import { skipToken } from "@reduxjs/toolkit/query";

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
  const {
    data: project,
    isLoading,
    error,
  } = useGetSingleProjectQuery(projectId ? { id: projectId } : skipToken);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={<Title level={4} style={{ marginBottom: 0 }}>📁 Project Details</Title>}
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
        <Card bordered={false} style={{ backgroundColor: "#f9f9f9", borderRadius: 8 }}>
          <div style={{ padding: "12px 0" }}>
            <Text strong>📌 Project Name:</Text> <Text>{project.projectName}</Text>
            <Divider />
            <Text strong>📊 Status:</Text>{" "}
            <Text type={project.status === "Completed" ? "success" : "warning"}>
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
          </div>
        </Card>
      )}
    </Modal>
  );
};

export default ProjectDetailsModal;
