/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const buildFormData = (
  data: Record<string, any>,
  fileKey: string = "file"
) => {
  const formData = new FormData();

  // If file exists (can be single file or array)
  if (data[fileKey]) {
    if (Array.isArray(data[fileKey])) {
      data[fileKey].forEach((file: File) => formData.append(fileKey, file));
    } else {
      formData.append(fileKey, data[fileKey]);
    }
  }

  // Append everything else inside "data"
  const { [fileKey]: _, ...rest } = data;
  formData.append("data", JSON.stringify(rest));

  return formData;
};
