// features/students/store/useStudentUIStore.ts

import { create } from "zustand";
import type { Student, StudentUIState } from "../types";

export const useStudentUIStore = create<StudentUIState>((set) => ({
  isAddOpen: false,
  isEditOpen: false,
  selectedStudent: null,

  openAdd: () => set({ isAddOpen: true }),
  closeAdd: () => set({ isAddOpen: false }),

  openEdit: (student) => set({ isEditOpen: true, selectedStudent: student }),
  closeEdit: () => set({ isEditOpen: false, selectedStudent: null }),
}));