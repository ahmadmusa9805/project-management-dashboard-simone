export interface Project {
  id: string;
  name: string;
}

export interface EarningsState {
  projects: Project[];
  selectedProject: string;
   earningsData: { month: string; earning: number }[];
}
