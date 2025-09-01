/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { successAlert, errorAlert } from "../utils/alerts";

interface UseCustomHookSubmitEntityProps {
  createMutation: any;
  updateMutation: any;
  entityName: string; // just for messages, e.g., "Quote" or "Snagging"
}

export function useCustomHookSubmitEntity({
  createMutation,
  updateMutation,
  entityName,
}: UseCustomHookSubmitEntityProps) {
  const [loading, setLoading] = useState(false);

  const submitEntity = async (
    mode: "create" | "edit",
    data: any,
    editEntity?: any,
    afterSubmit?: () => void
  ) => {
    setLoading(true);
    try {
      let result;
      if (mode === "create") {
        result = await createMutation(data).unwrap();
        successAlert(result?.message || `${entityName} created successfully!`);
      } else if (mode === "edit" && editEntity?._id) {
        result = await updateMutation({ id: editEntity._id, data }).unwrap();
        successAlert(result?.message || `${entityName} updated successfully!`);
      }
      afterSubmit?.(); // e.g., close drawer, refetch
    } catch (err: any) {
      errorAlert(
        "Submission Error",
        err?.data?.message || `Failed to submit ${entityName}.`
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitEntity,
  };
}
