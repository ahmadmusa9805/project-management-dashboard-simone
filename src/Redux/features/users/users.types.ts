import type { UploadFile } from "antd";

export interface User {
  id: number;
  name: string;
  email?: string;
  contact?: string;
  address?: string;
  postalCode?: string;
  password?: string;
  role: string; // e.g. "prime-admin", "basic-admin", "client", "labor", etc.
  photo?: string;

  // Client-specific fields
  estimateNumber?: string;
  projectType?: string;

  // Labor/Subcontractor specific fields
  type?: "Labor" | "SubContractor" | "Material";
  rate?: number;
  quantity?: number;
  date?: string;
  vatRate?: number;
  description?: string;

  // uploadedFile in your original example is a URL string here:
  uploadedFile?: string | UploadFile;
}

export interface UserApiResponse {
  success: boolean;
  message: string;
  data: User[];
}

export interface SingleUserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UpdateResponse {
  success: boolean;
  message: string;
  data: User;
}
