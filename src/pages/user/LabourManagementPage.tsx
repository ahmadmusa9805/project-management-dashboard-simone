// src/pages/LaborManagement/LaborTable.tsx
import React, { useState } from "react";
import { Input } from "antd";
import CustomSearchInput from "../../components/CustomSearchInput";
import CustomCreateButton from "../../components/CustomCreateButton";
import CustomViewMoreButton from "../../components/CustomViewMoreButton";
import { Drawer } from "antd";
import LaborCreateEdit from "./LaborCreateEdit";
import LaborDetailModal from "./LaborDetailModal";
import type { GetProps } from "antd";
import type { UploadFile } from "antd";

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
}

const initialData: LaborItem[] = [
  {
    id: 1,
    type: "Labor",
    name: "John Doe",
    rate: 200,
    quantity: 2,
    date: "2025‑01‑26",
    vatRate: 20,
    description: "Site labor",
  },
  {
    id: 2,
    type: "Material",
    name: "Cement Bags",
    rate: 5,
    quantity: 50,
    date: "2025‑01‑27",
    vatRate: 15,
  },
];

const ITEMS_PER_PAGE = 5;
type SearchProps = GetProps<typeof Input.Search>;

const LaborTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<LaborItem | null>(null);
  const [laborData, setLaborData] = useState<LaborItem[]>(initialData);
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
      <div className="max-w-7xl mx-auto p-4">
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

        <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-50 border-b border-gray-200">
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
                className="border-b border-gray-100 hover:bg-gray-50"
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

        <div className="flex justify-between items-center mt-4">
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
