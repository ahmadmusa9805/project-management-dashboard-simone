/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Input, Drawer, Spin } from "antd";
import type { GetProps } from "antd";
import type { UploadFile } from "antd";

import CustomSearchInput from "../../components/CustomSearchInput";
import CustomCreateButton from "../../components/CustomCreateButton";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";
import LaborCreateEdit from "./LaborCreateEdit";
import LaborDetailModal from "./LaborDetailModal";
import { useGetAllUsersQuery } from "../../Redux/features/users/usersApi";

interface LaborItem {
  id: number;
  type: "Labor" | "SubContractor" | "Material";
  name: string;
  rate: number;
  quantity: number;
  date: string;
  vatRate: number;
  description?: string;
  uploadedFile?: UploadFile;
  role?: string;
}

const ITEMS_PER_PAGE = 10;
type SearchProps = GetProps<typeof Input.Search>;

const LaborTable: React.FC = () => {
  const { data, isLoading, error } = useGetAllUsersQuery({});
  console.log("data in labor components after call hook", data?.data[0]);
  // const rowDataByUserRole = data?.data.filter((user) => user.role === "labor");
  // console.log(rowDataByUserRole);
  const [laborData, setLaborData] = useState<LaborItem[]>([]);
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      const filteredLabor = data.data
        .filter((user: any) => user.role === "labor")
        .map((user: any) => ({
          id: user.id,
          type: user.type,
          name: user.name,
          rate: user.rate ?? 0,
          quantity: user.quantity ?? 0,
          date: user.date ?? "",
          vatRate: user.vatRate ?? 0,
          description: user.description,
          uploadedFile: user.uploadedFile,
          role: user.role,
        }));
      setLaborData(filteredLabor);
    }
  }, [data]);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<LaborItem | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [viewItem, setViewItem] = useState<LaborItem | null>(null);

  const filteredData = laborData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.type.toLowerCase().includes(searchText.toLowerCase())
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

        {isLoading ? (
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
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Rate</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">VAT%</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-[#e6f4ea]"
                  >
                    <td className="px-4 py-3">{item.type}</td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.rate}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">{item.date}</td>
                    <td className="px-4 py-3">{item.vatRate}%</td>
                    <td className="px-4 py-3">
                      <CustomViewMoreButton
                        items={[
                          { key: "view", label: "View Details" },
                          { key: "edit", label: "Edit Entry" },
                        ]}
                        onClick={(key) => {
                          if (key === "view" && item) {
                            setViewItem(item);
                            setDetailOpen(true);
                          } else if (key === "edit") {
                            setMode("edit");
                            setSelected(item);
                            setDrawerOpen(true);
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
      >
        <LaborCreateEdit
          mode={mode}
          defaultValues={selected ?? undefined}
          onSubmitSuccess={(updated) => {
            if (mode === "create") setLaborData((prev) => [...prev, updated]);
            else
              setLaborData((prev) =>
                prev.map((i) => (i.id === updated.id ? updated : i))
              );
            setDrawerOpen(false);
          }}
          onCancel={() => setDrawerOpen(false)}
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
