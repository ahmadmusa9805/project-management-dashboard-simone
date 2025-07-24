// dashbordSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { dummyProjects, dummyEarnings } from '../../../data/mockEarningsData';
import type { EarningsState } from './dashbord.types';

const initialState: EarningsState = {
  projects: [],
  selectedProject: '',
  earningsData: [],
};

const earningsSlice = createSlice({
  name: 'earnings',
  initialState,
  reducers: {
    fetchProjects(state) {
      state.projects = dummyProjects;
      state.selectedProject = dummyProjects[0].id;
      state.earningsData = dummyEarnings[dummyProjects[0].id]; // 👈
    },
    selectProject(state, action: PayloadAction<string>) {
      state.selectedProject = action.payload;
      state.earningsData = dummyEarnings[action.payload]; // 👈
    },
  },
});

export const { fetchProjects, selectProject } = earningsSlice.actions;
export default earningsSlice.reducer;
