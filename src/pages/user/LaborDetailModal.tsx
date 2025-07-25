/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/LaborManagement/LaborDetailModal.tsx
import React from "react";
import { Modal, Descriptions } from "antd";

interface Props {
  visible: boolean;
  item: any;
  onClose: () => void;
}

const LaborDetailModal: React.FC<Props> = ({ visible, item, onClose }) => (
  <Modal open={visible} title="Entry Details" footer={null} onCancel={onClose}>
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Type">{item.type}</Descriptions.Item>
      <Descriptions.Item label="Name">{item.name}</Descriptions.Item>
      <Descriptions.Item label="Rate">{item.rate}</Descriptions.Item>
      <Descriptions.Item label="Quantity">{item.quantity}</Descriptions.Item>
      <Descriptions.Item label="Date">{item.date}</Descriptions.Item>
      <Descriptions.Item label="VAT Rate">{item.vatRate}%</Descriptions.Item>
      <Descriptions.Item label="Description">
        {item.description || "-"}
      </Descriptions.Item>
      <Descriptions.Item label="Uploaded File">
        {item.uploadedFile?.file?.name ? (
          <a>{item.uploadedFile.file.name}</a>
        ) : (
          "None"
        )}
      </Descriptions.Item>
    </Descriptions>
  </Modal>
);

export default LaborDetailModal;
