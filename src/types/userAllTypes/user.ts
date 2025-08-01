export type StatusType = 'Active' | 'In pipeline' | 'Disable' | 'Suspended';
export type TRole = "superAdmin" | "primeAdmin" | "basicAdmin" | "client";

export const USER_ROLE: { [key in TRole]: TRole } = {
  superAdmin: "superAdmin",
  primeAdmin: "primeAdmin",
  basicAdmin: "basicAdmin",
  client: "client",
} as const;
