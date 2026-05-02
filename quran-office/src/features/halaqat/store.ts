import { create } from 'zustand';
import type { Halaqa } from './types';

interface HalaqatUIState {
  // Modal states
  isFormModalOpen: boolean;
  isDeleteConfirmOpen: boolean;
  isStudentsDrawerOpen: boolean;
  
  // Selected item
  selectedHalaqa: Halaqa | null;
  
  // Actions
  openCreateForm: () => void;
  openEditForm: (halaqa: Halaqa) => void;
  closeFormModal: () => void;
  
  openDeleteConfirm: (halaqa: Halaqa) => void;
  closeDeleteConfirm: () => void;
  
  openStudentsDrawer: (halaqa: Halaqa) => void;
  closeStudentsDrawer: () => void;
}

export const useHalaqatStore = create<HalaqatUIState>((set) => ({
  isFormModalOpen: false,
  isDeleteConfirmOpen: false,
  isStudentsDrawerOpen: false,
  selectedHalaqa: null,

  openCreateForm: () => set({ 
    isFormModalOpen: true, 
    selectedHalaqa: null 
  }),
  
  openEditForm: (halaqa) => set({ 
    isFormModalOpen: true, 
    selectedHalaqa: halaqa 
  }),
  
  closeFormModal: () => set({ 
    isFormModalOpen: false, 
    selectedHalaqa: null 
  }),
  
  openDeleteConfirm: (halaqa) => set({ 
    isDeleteConfirmOpen: true, 
    selectedHalaqa: halaqa 
  }),
  
  closeDeleteConfirm: () => set({ 
    isDeleteConfirmOpen: false, 
    selectedHalaqa: null 
  }),
  
  openStudentsDrawer: (halaqa) => set({ 
    isStudentsDrawerOpen: true, 
    selectedHalaqa: halaqa 
  }),
  
  closeStudentsDrawer: () => set({ 
    isStudentsDrawerOpen: false, 
    selectedHalaqa: null 
  }),
}));
