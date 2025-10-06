/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Drawer, Spin } from "antd";
import type {
  ExpenseItem,
  ExpenseType,
} from "../types/projectAllTypes/expense";

import CustomViewMoreButton from "./CustomViewMoreButton";
import CustomCreateButton from "./CustomCreateButton";
import ExpenseForm, { type ExpenseFormValues } from "./ExpenseForm";

import {
  useCreateLabourExpenseMutation,
  useUpdateLabourExpenseMutation,
  useDeleteLabourExpenseMutation,
  useLazyGetSingleLabourExpenseQuery,
} from "../Redux/features/projects/project/costManagenent/labourExpensesApi";

import {
  useCreateMaterialExpenseMutation,
  useUpdateMaterialExpenseMutation,
  useDeleteMaterialExpenseMutation,
  useLazyGetSingleMaterialExpenseQuery,
} from "../Redux/features/projects/project/costManagenent/materialExpensesApi";

import {
  useCreateSubContractorMutation,
  useUpdateSubContractorMutation,
  useDeleteSubContractorMutation,
  useLazyGetSingleSubContractorQuery,
} from "../Redux/features/projects/project/costManagenent/subContractorExpensesApi";
import { showDeleteAlert } from "../utils/deleteAlert";
import { errorAlert, successAlert } from "../utils/alerts";
import { useParams } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

interface ExpenseTableProps {
  expenses: ExpenseItem[];
  title: ExpenseType;
  isLoading?: boolean;
  refetch?: () => void;
}

const ExpenseTable = ({
  expenses,
  title,
  isLoading = false,
  refetch,
}: ExpenseTableProps) => {
  const { projectId } = useParams();
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("edit");

  const [createLabourExpense, { isLoading: creatingLabour }] =
    useCreateLabourExpenseMutation();
  const [updateLabourExpense, { isLoading: updatingLabour }] =
    useUpdateLabourExpenseMutation();
  const [deleteLabourExpense] = useDeleteLabourExpenseMutation();
  const [getSingleLabourExpense] = useLazyGetSingleLabourExpenseQuery();

  const [createMaterialExpense, { isLoading: creatingMaterial }] =
    useCreateMaterialExpenseMutation();
  const [updateMaterialExpense, { isLoading: updatingMaterial }] =
    useUpdateMaterialExpenseMutation();
  const [deleteMaterialExpense] = useDeleteMaterialExpenseMutation();
  const [getSingleMaterialExpense] = useLazyGetSingleMaterialExpenseQuery();

  const [createSubContractor, { isLoading: creatingSub }] =
    useCreateSubContractorMutation();
  const [updateSubContractor, { isLoading: updatingSub }] =
    useUpdateSubContractorMutation();
  const [deleteSubContractor] = useDeleteSubContractorMutation();
  const [getSingleSubContractor] = useLazyGetSingleSubContractorQuery();

  const totalPages = Math.ceil((expenses.length || 0) / ITEMS_PER_PAGE);

  const handleEdit = async (item: ExpenseItem) => {
    setMode("edit");
    // console.log(item);
    setEditingItem(item);

    try {
      let fetchedData: ExpenseItem = item;
      if (title === "Labour") {
        fetchedData = await getSingleLabourExpense(item._id!).unwrap();
      } else if (title === "Material") {
        fetchedData = await getSingleMaterialExpense(item._id!).unwrap();
      } else if (title === "Subcontractor") {
        fetchedData = await getSingleSubContractor(item._id!).unwrap();
      }
      setEditingItem(fetchedData);
    } catch (error) {
      console.error("Failed to fetch expense details:", error);
      errorAlert("Failed to load expense details");
    }

    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setMode("create");
    setEditingItem(null);
    setDrawerOpen(true);
  };

  const handleDelete = (id: string) => {
    showDeleteAlert({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this expense?",
      confirmText: "Yes, delete it!",
      cancelText: "No",
      onConfirm: async () => {
        try {
          if (title === "Labour") {
            await deleteLabourExpense(id).unwrap();
          } else if (title === "Material") {
            await deleteMaterialExpense(id).unwrap();
          } else {
            await deleteSubContractor(id).unwrap();
          }

          // successAlert("Expense deleted");
          refetch?.();
        } catch {
          errorAlert("Failed to delete expense");
        }
      },
    });
  };

  const handleSubmit = async (data: ExpenseFormValues) => {
    try {
      const formData = new FormData();
      const { file, _id, ...restData } = data;

      const dataToSend = {
        ...restData,
        projectId: projectId!,
        days: Number(restData.days) || 0,
        ratePerDay: Number(restData.ratePerDay) || 0,
        // vat: restData.vat !== undefined ? Number(restData.vat) : 0,
        amount: restData.amount !== undefined ? Number(restData.amount) : 0,
        unitPrice:
          restData.unitPrice !== undefined ? Number(restData.unitPrice) : 0,
        quantity:
          restData.quantity !== undefined ? Number(restData.quantity) : 0,
        name: restData.name?.trim() || "",
      };

      if (_id && _id !== "") {
        (dataToSend as any)._id = _id;
      }

      if (file && file instanceof File) {
        formData.append("file", file);
      }

      formData.append("data", JSON.stringify(dataToSend));

      if (mode === "edit") {
        console.log(dataToSend);
        if (title === "Labour") {
          await updateLabourExpense({ id: data._id!, data: formData }).unwrap();
        } else if (title === "Material") {
          await updateMaterialExpense({
            id: data._id!,
            data: formData,
          }).unwrap();
        } else if (title === "Subcontractor") {
          console.log("editing subcontractor", data._id, formData);
          await updateSubContractor({ id: data._id!, data: formData }).unwrap();
        }
      } else {
        if (title === "Labour") {
          await createLabourExpense(formData).unwrap();
        } else if (title === "Material") {
          await createMaterialExpense(formData).unwrap();
        } else if (title === "Subcontractor") {
          await createSubContractor(formData).unwrap();
        }
      }

      successAlert(
        `Expense ${mode === "create" ? "created" : "updated"} successfully`
      );
      setDrawerOpen(false);
      refetch?.();
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} expense:`,
        error
      );
      errorAlert(
        `Failed to ${mode === "create" ? "create" : "update"} expense`
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <h2 className="text-xl font-semibold">{title} Expenses</h2>
        <CustomCreateButton title={`Create expense`} onClick={handleCreate} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr className="bg-[#e6f4ea] border-b border-gray-300">
                <th className="text-left px-4 py-2 text-gray-700">Name</th>
                <th className="text-left px-4 py-2 text-gray-700">
                  Expense Type
                </th>
                <th className="text-left px-4 py-2 text-gray-700">Quantity</th>
                <th className="text-left px-4 py-2 text-gray-700">Cost</th>
                <th className="text-left px-4 py-2 text-gray-700">Date</th>
                <th className="text-left px-4 py-2 text-gray-700">Vat</th>
                <th className="text-left px-4 py-2 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No expenses found.
                  </td>
                </tr>
              ) : (
                expenses.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-100 hover:bg-[#e6f4ea] transition"
                  >
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.type}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">£ {item.amount}</td>
                    <td className="px-4 py-2">{item.date}</td>
                    <td className="px-4 py-2">{item.vat}</td>
                    <td className="px-4 py-2">
                      <CustomViewMoreButton
                        items={[
                          { key: "edit", label: "Edit Expense" },
                          { key: "delete", label: "Delete Expense" },
                        ]}
                        onClick={(key) => {
                          if (key === "edit") handleEdit(item);
                          if (key === "delete") handleDelete(item._id!);
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 border rounded ${
                page === 1
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-blue-600 border-blue-600 hover:bg-blue-50"
              }`}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 border rounded ${
                page === totalPages
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-blue-600 border-blue-600 hover:bg-blue-50"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={mode === "edit" ? `Edit ${title}` : `Create ${title}`}
        width={720}
        destroyOnClose
      >
        <ExpenseForm
          mode={mode}
          creating={
            title === "Labour"
              ? creatingLabour
              : title === "Material"
              ? creatingMaterial
              : creatingSub
          }
          updating={
            title === "Labour"
              ? updatingLabour
              : title === "Material"
              ? updatingMaterial
              : updatingSub
          }
          title={title}
          defaultValues={
            editingItem
              ? { ...editingItem }
              : {
                  _id: "",
                  type: title as ExpenseType,
                  name: "",
                  days: 0,
                  ratePerDay: 0,
                  quantity: 1,
                  amount: 0,
                  vat: 20,
                  date: "",
                  description: "",
                  file: "",
                }
          }
          onSubmit={handleSubmit}
          onCancel={() => setDrawerOpen(false)}
        />
      </Drawer>
    </div>
  );
};

export default ExpenseTable;
