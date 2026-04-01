import { create } from "zustand";

type NotificationSeverity = "success" | "error" | "warning" | "info";

interface NotificationState {
  open: boolean;
  message: string;
  severity: NotificationSeverity;
  notify: (message: string, severity?: NotificationSeverity) => void;
  close: () => void;
}

export const useNotification = create<NotificationState>((set) => ({
  open: false,
  message: "",
  severity: "success",

  notify: (message, severity = "success") =>
    set({ open: true, message, severity }),

  close: () => set({ open: false }),
}));
