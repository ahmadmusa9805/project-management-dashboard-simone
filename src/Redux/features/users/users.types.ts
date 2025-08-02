import type { TRole } from "../../../types/userAllTypes/user";


export interface User {
 _id: string;
    name: string;
    email: string;
    contactNo: string;
    role: TRole
    profileImg: string;
    status: string;
    postCode:string;
    address:string;
    region:string;
    otpVerified: boolean;
    isDeleted: boolean;
    createdAt: string;
    estimateNumber:string;
    projectType:string;
    updatedAt: string;
    __v: number;
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
