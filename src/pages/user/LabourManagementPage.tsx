/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Input, Drawer, Spin } from "antd";
import type { GetProps } from "antd";

import CustomSearchInput from "../../components/CustomSearchInput";
import CustomCreateButton from "../../components/CustomCreateButton";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";
import LaborCreateEdit from "./LaborCreateEdit";
import LaborDetailModal from "./LaborDetailModal";

import {
  useGetAllLaboursQuery,
  useCreateLabourMutation,
  useUpdateLabourMutation,
  useDeleteLabourMutation,
} from "../../Redux/features/labour/labourApi";
import { errorAlert, successAlert } from "../../utils/alerts";
import { showDeleteAlert } from "../../utils/deleteAlert";

interface LaborItem {
  id: string;
  name: string;
  description?: string;
  address?: string;
  position: string;
  dayRate: number;
  UtrNinAddress: string;
  file: string;
}

const ITEMS_PER_PAGE = 10;
type SearchProps = GetProps<typeof Input.Search>;

const LaborTable: React.FC = () => {
  const { data, isLoading, error, refetch } = useGetAllLaboursQuery();
  const [createLabour, { isLoading: creating }] = useCreateLabourMutation();
  const [updateLabour, { isLoading: updating }] = useUpdateLabourMutation();
  const [deleteLabour, { isLoading: deleting }] = useDeleteLabourMutation();

  const [laborData, setLaborData] = useState<LaborItem[]>([]);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<LaborItem | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [viewItem, setViewItem] = useState<LaborItem | null>(null);

  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      const mapped = data.data.map((labor: any) => ({
        id: labor._id,
        name: labor.name,
        description: labor.description ?? "",
        address: labor.address ?? "",
        position: labor.position ?? "",
        dayRate: labor.dayRate ?? 0,
        UtrNinAddress: labor.UtrNinAddress ?? "",
        file: labor.file,
      }));

      setLaborData(mapped);
    }
  }, [data]);

  const filteredData = laborData.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const currentData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearchText(value);
    setPage(1);
  };

  const handleSubmitSuccess = () => {
    setDrawerOpen(false);
    refetch();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLabour(String(id)).unwrap();
      successAlert("Labour deleted successfully");
      refetch();
    } catch {
      errorAlert("Failed to delete labour");
    }
  };

  return (
    <>
      <div className="bg-white min-h-screen mx-auto w-full p-4">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-semibold">Manage Labor Entries</h1>
          <CustomSearchInput onSearch={onSearch} />
        </div>
        <div className="flex justify-end mb-2">
          <CustomCreateButton
            title="Add Entry"
            onClick={() => {
              setMode("create");
              setSelected(null);
              setDrawerOpen(true);
            }}
          />
        </div>

        {isLoading || creating || updating || deleting ? (
          <div className="text-center my-8">
            <Spin size="large" />
          </div>
        ) : error ? (
          <p className="text-red-600">Failed to load labor data</p>
        ) : (
          <>
            <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-[#e6f4ea] border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Position</th>
                  <th className="px-4 py-2 text-left">Rate</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-[#e6f4ea]"
                  >
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.position}</td>
                    <td className="px-4 py-3">{item.dayRate}</td>

                    <td className="px-4 py-3">
                      <CustomViewMoreButton
                        items={[
                          { key: "view", label: "View Details" },
                          { key: "edit", label: "Edit Entry" },
                          { key: "delete", label: "Delete Entry" },
                        ]}
                        onClick={async (key) => {
                          if (key === "view") {
                            setViewItem(item);
                            setDetailOpen(true);
                          } else if (key === "edit") {
                            setMode("edit");
                            setSelected(item);
                            setDrawerOpen(true);
                          } else if (key === "delete") {
                            showDeleteAlert({
                              title: "Are you sure to delete this labour?",
                              onConfirm: async () => {
                                await handleDelete(item.id);
                              },
                            });
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-evenly items-center mt-4">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className={`px-4 py-2 rounded border ${
                  page <= 1
                    ? "text-gray-400 border-gray-300"
                    : "text-blue-600 border-blue-600 hover:bg-blue-50"
                }`}
              >
                Previous
              </button>
              <div className="text-gray-700">
                Page {page} of {totalPages}
              </div>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className={`px-4 py-2 rounded border ${
                  page >= totalPages
                    ? "text-gray-400 border-gray-300"
                    : "text-blue-600 border-blue-600 hover:bg-blue-50"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={mode === "create" ? "Add Labor Entry" : "Edit Labor Entry"}
        width={720}
        destroyOnClose
      >
        <LaborCreateEdit
          mode={mode}
          defaultValues={selected ?? undefined}
          onSubmitSuccess={handleSubmitSuccess}
          onCancel={() => setDrawerOpen(false)}
          creating={creating}
          updating={updating}
          createLabor={createLabour}
          updateLabor={updateLabour}
        />
      </Drawer>

      {viewItem && (
        <LaborDetailModal
          visible={detailOpen}
          onClose={() => {
            setDetailOpen(false);
            setViewItem(null);
          }}
          item={viewItem}
        />
      )}
    </>
  );
};

export default LaborTable;
