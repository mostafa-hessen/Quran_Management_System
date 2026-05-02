import { create } from 'zustand';

interface PaymentState {
  isAddPaymentModalOpen: boolean;
  isSubscriptionFormOpen: boolean;
  isHistoryModalOpen: boolean;
  isEditSubscriptionOpen: boolean;
  selectedSubscription: any | null;
  activeTab: number;
  filters: {
    status: string;
    method: string;
    search: string;
    startDate: string | null;
    endDate: string | null;
    phoneSearch: string;
  };
  setAddPaymentModal: (isOpen: boolean, subscription?: any | null) => void;
  setSubscriptionForm: (isOpen: boolean) => void;
  setHistoryModal: (isOpen: boolean, subscription?: any | null) => void;
  setEditSubscriptionModal: (isOpen: boolean, subscription?: any | null) => void;
  setActiveTab: (tab: number) => void;
  setFilters: (filters: Partial<PaymentState['filters']>) => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  isAddPaymentModalOpen: false,
  isSubscriptionFormOpen: false,
  isHistoryModalOpen: false,
  isEditSubscriptionOpen: false,
  selectedSubscription: null,
  activeTab: 0,
  filters: {
    status: 'all',
    method: 'all',
    search: '',
    startDate: null,
    endDate: null,
    phoneSearch: '',
  },
  setAddPaymentModal: (isOpen, subscription = null) => 
    set({ isAddPaymentModalOpen: isOpen, selectedSubscription: subscription }),
  setSubscriptionForm: (isOpen) => 
    set({ isSubscriptionFormOpen: isOpen }),
  setHistoryModal: (isOpen, subscription = null) =>
    set({ isHistoryModalOpen: isOpen, selectedSubscription: subscription }),
  setEditSubscriptionModal: (isOpen, subscription = null) =>
    set({ isEditSubscriptionOpen: isOpen, selectedSubscription: subscription }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setFilters: (newFilters) => 
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
}));

