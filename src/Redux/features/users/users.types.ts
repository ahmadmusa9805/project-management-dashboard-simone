

export interface User {
 _id: string;
    name: string;
    email: string;
    contactNo: string;
    role: "superAdmin" | "primeAdmin" | "basicAdmin" | "client" | "labor";
    profileImg: string;
    status: string;
    otpVerified: boolean;
    isDeleted: boolean;
    createdAt: string;
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
