/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Spin, Drawer, Tooltip, Modal } from "antd";
import { useSelector } from "react-redux";

// Components
import CustomCreateButton from "../../components/CustomCreateButton";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";
import CustomPagination from "../../components/CustomPagination";
import { CustomSearchInput } from "../../components/CustomSearchInput";
import OverheadCostDetailsModal from "../../components/OverheadCostDetailsModal";
import OverheadCostCreateEditForm from "../../components/OverheadCostsCreateAndEditForm";
import CustomShareSelector, {
  type SharedUser,
} from "../../components/CustomShareSelector";
import CustomUnshareSelector from "../../components/CustomUnshareSelector";

// Utils
import { showDeleteAlert } from "../../utils/deleteAlert";
import { errorAlert, successAlert } from "../../utils/alerts";

// API Hooks
import {
  useGetAllOverheadCostQuery,
  useDeleteOverheadCostMutation,
  useShareOverheadCostMutation,
  useUnShareOverheadCostMutation,
  useGetSingleOverheadCostQuery,
} from "../../Redux/features/overheadCosts/overheadCostsApi";

// Types
import type { RootState } from "../../Redux/app/store";
import { USER_ROLE } from "../../types/userAllTypes/user";

const ITEMS_PER_PAGE = 10;

export default function OverheadCostsPage() {
  // Global State (User Role)
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  // Local State
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  // Drawer & Modal States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewItemId, setViewItemId] = useState<string | null>(null);

  // Share / Unshare States
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [sharedItemId, setSharedItemId] = useState<string | null>(null);

  const [isUnshareOpen, setIsUnshareOpen] = useState(false);
  const [unshareItemId, setUnshareItemId] = useState<string | null>(null);

  // 1. Get All Costs
  const { data, isLoading, refetch } = useGetAllOverheadCostQuery({
    page,
    limit: ITEMS_PER_PAGE,
    searchTerm: debouncedSearchText,
  });

  const costData = data?.data || [];
  const meta = data?.meta;

  // 2. Get Single Cost (Only when Unsharing to populate the list)
  const { data: singleCostItem } = useGetSingleOverheadCostQuery(
    unshareItemId!,
    { skip: !unshareItemId }
  );

  // 3. Mutations
  const [deleteOverheadCost] = useDeleteOverheadCostMutation();
  const [shareOverheadCost, { isLoading: isShareLoading }] =
    useShareOverheadCostMutation();
  const [unShareOverheadCost, { isLoading: isUnshareLoading }] =
    useUnShareOverheadCostMutation();

  // Debounce Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // --- Handlers ---

  const handleDelete = async (id: string) => {
    try {
      await deleteOverheadCost(id).unwrap();
      refetch();
    } catch {
      errorAlert("Failed to delete cost");
    }
  };

  const handleSuccess = () => {
    setDrawerOpen(false);
    refetch();
  };

  const handleShareConfirm = async (selectedUsers: SharedUser[]) => {
    if (!selectedUsers.length || !sharedItemId) return;
    try {
      await shareOverheadCost({
        id: sharedItemId,
        sharedWith: selectedUsers,
      }).unwrap();
      successAlert("Overhead cost shared successfully");
      setIsShareOpen(false);
      setSharedItemId(null);
      refetch();
    } catch (error) {
      console.error("Share failed", error);
      errorAlert("Failed to share cost");
    }
  };

  const handleUnshareConfirm = async (selectedUsers: any[]) => {
    const userIds = selectedUsers.map((u) =>
      typeof u.userId === "object" ? u.userId._id : u.userId
    );

    if (!unshareItemId || userIds.length === 0) return;

    try {
      await unShareOverheadCost({
        id: unshareItemId,
        unShareWith: userIds,
      }).unwrap();
      successAlert("User(s) unshared successfully!");
      setIsUnshareOpen(false);
      setUnshareItemId(null);
      refetch();
    } catch (err) {
      console.error(err);
      errorAlert("Failed to unshare users");
    }
  };

  return (
    <>
      <div className="bg-white min-h-screen mx-auto w-full p-4">
        {/* Header */}
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-semibold">Overhead Costs</h1>
          <CustomSearchInput
            onSearch={(val) => {
              setSearchText(val);
              setDebouncedSearchText(val);
            }}
            onChange={(val) => setSearchText(val)}
          />
        </div>

        {/* Create Button */}
        <div className="flex justify-end mb-2">
          <CustomCreateButton
            title="Create Cost"
            onClick={() => {
              setMode("create");
              setSelectedItem(null);
              setDrawerOpen(true);
            }}
          />
        </div>

        {/* Table Structure */}
        <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-[#e6f4ea] border-b border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Project Name</th>
              <th className="px-4 py-2 text-left">Reference</th>
              {/* --- New Columns --- */}
              <th className="px-4 py-2 text-left">Value</th>
              <th className="px-4 py-2 text-left">VAT (%)</th>
              <th className="px-4 py-2 text-left">VAT Amount</th>
              {/* ------------------- */}
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <Spin size="large" />
                </td>
              </tr>
            ) : costData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No overhead costs found.
                </td>
              </tr>
            ) : (
              costData.map((item: any) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-100 hover:bg-[#e6f4ea]"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {item.name}
                  </td>

                  {/* Project Name Display */}
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    {typeof item.projectId === "object" &&
                    item.projectId?.projectName ? (
                      <span className="font-medium text-[#0d542b]">
                        {item.projectId.projectName}
                      </span>
                    ) : (
                      <Tooltip title={item.projectId}>
                        <span className="text-gray-400">
                          ID: {String(item.projectId).substring(0, 8)}...
                        </span>
                      </Tooltip>
                    )}
                  </td>

                  {/* Reference */}
                  <td className="px-4 py-3">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium border border-gray-200">
                      {item.reference}
                    </span>
                  </td>

                  {/* --- NEW: Value Column --- */}
                  <td className="px-4 py-3 font-medium text-gray-700">
                    ${item.value?.toLocaleString()}
                  </td>

                  {/* --- NEW: VAT Rate Column --- */}
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                      {item.vat}%
                    </span>
                  </td>

                  {/* --- NEW: VAT Amount Column --- */}
                  <td className="px-4 py-3 font-medium text-orange-600">
                    +${item.vatAmount?.toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <CustomViewMoreButton
                      items={[
                        { key: "view", label: "👁️ View Details" },
                        ...(userRole !== USER_ROLE.basicAdmin
                          ? [{ key: "edit", label: "✏️ Edit Cost" }]
                          : []),
                        ...(userRole !== USER_ROLE.basicAdmin
                          ? [
                              { key: "share", label: "🔗 Share Cost" },
                              { key: "unshare", label: "🚫 Unshare Cost" },
                            ]
                          : []),
                        ...(userRole !== USER_ROLE.basicAdmin
                          ? [{ key: "delete", label: "🗑️ Delete Cost" }]
                          : []),
                      ]}
                      onClick={(key) => {
                        if (key === "view") {
                          setViewItemId(item._id);
                          setDetailModalOpen(true);
                        } else if (key === "edit") {
                          setMode("edit");
                          setSelectedItem(item);
                          setDrawerOpen(true);
                        } else if (key === "share") {
                          setSharedItemId(item._id);
                          setIsShareOpen(true);
                        } else if (key === "unshare") {
                          setUnshareItemId(item._id);
                          setIsUnshareOpen(true);
                        } else if (key === "delete") {
                          showDeleteAlert({
                            title: "Are you sure you want to delete this cost?",
                            onConfirm: async () => handleDelete(item._id),
                          });
                        }
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!isLoading && meta && meta.totalPage > 1 && (
          <CustomPagination
            page={page}
            totalPages={meta.totalPage}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      {/* --- Drawers & Modals --- */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={
          mode === "create" ? "Create Overhead Cost" : "Edit Overhead Cost"
        }
        width={720}
        destroyOnClose
      >
        <OverheadCostCreateEditForm
          mode={mode}
          defaultValues={selectedItem}
          onSubmitSuccess={handleSuccess}
          onCancel={() => setDrawerOpen(false)}
        />
      </Drawer>

      <Modal
        open={isShareOpen}
        footer={null}
        onCancel={() => {
          setIsShareOpen(false);
          setSharedItemId(null);
        }}
        destroyOnClose
      >
        <CustomShareSelector
          title="Share Overhead Cost"
          roles={["primeAdmin", "basicAdmin", "Client"]}
          shareing={isShareLoading}
          onShare={handleShareConfirm}
        />
      </Modal>

      <Modal
        title="Unshare Overhead Cost"
        open={isUnshareOpen}
        onCancel={() => {
          setIsUnshareOpen(false);
          setUnshareItemId(null);
        }}
        footer={null}
        width={500}
        destroyOnClose
      >
        <CustomUnshareSelector
          unsharing={isUnshareLoading}
          title="Remove access from users"
          sharedUsers={(singleCostItem?.sharedWith || [])
            .map((u: any) => ({
              userId: u.userId?._id,
              name: u.userId?.name,
              role: u.userId?.role,
              email: u.userId?.email || "",
              profileImg: u.userId?.profileImg,
            }))
            .filter((u: any) => u.userId)}
          onUnshare={handleUnshareConfirm}
        />
      </Modal>

      {viewItemId && (
        <OverheadCostDetailsModal
          open={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setViewItemId(null);
          }}
          itemId={viewItemId}
        />
      )}
    </>
  );
}
