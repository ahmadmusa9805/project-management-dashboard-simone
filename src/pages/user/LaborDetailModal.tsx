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
  <Modal open={visible} title="Labor Details" footer={null} onCancel={onClose}>
    <Descriptions bordered column={1}>
     
      <Descriptions.Item label="Name">{item.name}</Descriptions.Item>
      <Descriptions.Item label="Position">{item.position}</Descriptions.Item>
      <Descriptions.Item label="Address">{item.address}</Descriptions.Item>
      <Descriptions.Item label="UtrNinAddress">{item.UtrNinAddress}</Descriptions.Item>

      <Descriptions.Item label="Rate">{item.dayRate}</Descriptions.Item>
      <Descriptions.Item label="Description">
        {item.description || "-"}
      </Descriptions.Item>
      <Descriptions.Item label="Uploaded File">
        {item.file? (
          <a>{item.file}</a>
        ) : (
          "None"
        )}
      </Descriptions.Item>
    </Descriptions>
  </Modal>
);

export default LaborDetailModal;
