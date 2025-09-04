// mockEarningsData.ts
export const dummyProjects = [
  { id: 'project1', name: 'Project Alpha' },
  { id: 'project2', name: 'Project Beta' },
  { id: 'project3', name: 'Project Gamma' },
];

export const dummyEarnings: Record<string, { month: string; earning: number }[]> = {
  project1: [
    { month: 'Feb', earning: 1200 },
    { month: 'Mar', earning: 1500 },
    { month: 'Apr', earning: 1800 },
    { month: 'May', earning: 2300 },
    { month: 'Jun', earning: 3200 },
    { month: 'Jul', earning: 2800 },
  ],
  project2: [
    { month: 'Feb', earning: 1000 },
    { month: 'Mar', earning: 1600 },
    { month: 'Apr', earning: 1100 },
    { month: 'May', earning: 2500 },
    { month: 'Jun', earning: 2000 },
    { month: 'Jul', earning: 1800 },
  ],
  project3: [
    { month: 'Feb', earning: 2000 },
    { month: 'Mar', earning: 2300 },
    { month: 'Apr', earning: 2100 },
    { month: 'May', earning: 2600 },
    { month: 'Jun', earning: 3100 },
    { month: 'Jul', earning: 3300 },
  ],
};
