import { create } from "zustand";
import { toast } from "react-hot-toast";

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

  notify: (message, severity = "success") => {
    set({ open: true, message, severity });
    
    if (severity === "success") {
      toast.success(message);
    } else if (severity === "error") {
      toast.error(message);
    } else {
      toast(message);
    }
  },

  close: () => set({ open: false }),
}));
