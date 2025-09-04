import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DocumentState {
  currentFile: string | null;
}

const initialState: DocumentState = {
  currentFile: null,
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setCurrentFile: (state, action: PayloadAction<string>) => {
      state.currentFile = action.payload;
    },
    clearCurrentFile: (state) => {
      state.currentFile = null;
    },
  },
});

export const { setCurrentFile, clearCurrentFile } = documentSlice.actions;
export default documentSlice.reducer;
