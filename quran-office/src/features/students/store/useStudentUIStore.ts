import { create } from "zustand";
import type { StudentUIState } from "../types";

/**
 * Zustand store for Student UI state only.
 * No server data stored here as per instructions.
 */
export const useStudentUIStore = create<StudentUIState>((set) => ({
  isAddOpen: false,
  selectedStudent: null,
  isEditOpen: false,
  isProfileOpen: false,

  openAdd: () => set({ isAddOpen: true }),
  closeAdd: () => set({ isAddOpen: false }),

  openEdit: (student) => set({ isEditOpen: true, selectedStudent: student }),
  closeEdit: () => set({ isEditOpen: false, selectedStudent: null }),

  openProfile: (student) => set({ isProfileOpen: true, selectedStudent: student }),
  closeProfile: () => set({ isProfileOpen: false, selectedStudent: null }),
}));

