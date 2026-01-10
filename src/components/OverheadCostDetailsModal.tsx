/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal, Spin, Card, Typography, Divider, Button } from "antd";

import { skipToken } from "@reduxjs/toolkit/query";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/app/store";
import {
  useGetSingleOverheadCostQuery,
  useUnShareOverheadCostMutation,
} from "../Redux/features/overheadCosts/overheadCostsApi";
import { successAlert } from "../utils/alerts";
import { USER_ROLE } from "../types/userAllTypes/user";

const { Title, Text } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  itemId: string | null;
}

const OverheadCostDetailsModal: React.FC<Props> = ({
  open,
  onClose,
  itemId,
}) => {
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  // Fetch single cost details
  const {
    data: costItem,
    isLoading,
    error,
    refetch,
  } = useGetSingleOverheadCostQuery(itemId ? itemId : skipToken);

  // Unshare mutation hook
  const [unShareCost, { isLoading: isUnsharing }] =
    useUnShareOverheadCostMutation();

  const handleUnshare = async (userId: string) => {
    if (!itemId) return;
    try {
      await unShareCost({ id: itemId, unShareWith: [userId] }).unwrap();
      successAlert("User unshared successfully.");
      refetch();
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
          📄 Overhead Cost Details
        </Title>
      }
      centered
      width={600}
    >
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </div>
      ) : error || !costItem ? (
        <div style={{ textAlign: "center", color: "red" }}>
          ❌ Failed to load details.
        </div>
      ) : (
        <Card
          bordered={false}
          style={{ backgroundColor: "#f9f9f9", borderRadius: 8 }}
        >
          <div style={{ padding: "12px 0" }}>
            <Text strong>📌 Name:</Text> <Text>{costItem.name}</Text>
            <Divider />
            <Text strong>🏗️ Project:</Text>{" "}
            <Text>
              {typeof costItem.projectId === "object"
                ? costItem.projectId?.projectName
                : "N/A"}
            </Text>
            <Divider />
            <div className="flex justify-between">
              <div>
                <Text strong>🔖 Reference:</Text>{" "}
                <Text>{costItem.reference}</Text>
              </div>
              <div>
                <Text strong>💰 Value:</Text> <Text>£ {costItem.value}</Text>
              </div>

              <div>
                <Text strong>VAT Amount:</Text>{" "}
                <Text>+£{costItem.vatAmount}</Text>
              </div>

              <div>
                <Text strong>VAT:</Text> <Text>{costItem.vat}%</Text>
              </div>
            </div>
            <Divider />
            <Text strong>📝 Description:</Text>
            <p style={{ marginTop: 4, color: "#666" }}>
              {costItem.description || "No description provided."}
            </p>
            <Divider />
            {/* Shared With Section */}
            {costItem.sharedWith && costItem.sharedWith.length > 0 && (
              <>
                <Text strong>🤝 Shared With:</Text>
                <div style={{ marginTop: 8 }}>
                  {costItem.sharedWith.map((share: any, idx: number) => {
                    if (!share?.userId) return null;

                    const user =
                      typeof share.userId === "object"
                        ? share.userId
                        : { _id: share.userId };

                    const role = share?.role ?? "Unknown";

                    return (
                      <div
                        key={share._id || idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 6,
                          background: "white",
                          padding: "8px",
                          borderRadius: "4px",
                        }}
                      >
                        <span className="text-sm">
                          👤 {user.name || user.email || user._id}{" "}
                          <span className="text-gray-400 text-xs">
                            ({role})
                          </span>
                        </span>

                        {/* Only show Unshare button for admins */}
                        {userRole !== USER_ROLE.basicAdmin && (
                          <Button
                            size="small"
                            danger
                            loading={isUnsharing}
                            onClick={() => handleUnshare(user._id)}
                          >
                            Unshare
                          </Button>
                        )}
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

export default OverheadCostDetailsModal;
