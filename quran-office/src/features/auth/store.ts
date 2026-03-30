// store.ts - الحل النظيف

import { create } from "zustand";
import { supabase } from "@/shared/lib/supabase";
import type { AuthState, UserProfile } from "./types";

let initializationPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  signOut: async () => {
    set({ loading: true });
    await supabase.auth.signOut();
    set({ user: null, profile: null, loading: false, initialized: false });
    initializationPromise = null;
  },

  initialize: async () => {
    if (initializationPromise) return initializationPromise;
    if (get().initialized) return;

    initializationPromise = new Promise<void>((resolve) => {
      // ✅ الاعتماد على onAuthStateChange فقط للتهيئة الأولى
      // حدث INITIAL_SESSION يُطلق دائماً عند بداية التطبيق
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          // نتعامل فقط مع الحدث الأول (التهيئة)
          if (event === "INITIAL_SESSION") {
            try {
              set({ loading: true });

              if (session?.user) {
                set({ user: session.user });

                const { data: profile } = await supabase
                  .from("profiles")
                  .select("*")
                  .eq("id", session.user.id)
                  .single();

                if (profile) {
                  set({ profile: profile as UserProfile });
                }
              }
            } catch (error) {
              console.error("Auth Initialization Error:", error);
            } finally {
              set({ loading: false, initialized: true });
              subscription.unsubscribe(); // ✅ إلغاء هذا المستمع المؤقت
              resolve();
            }
          }
        }
      );
    });

    return initializationPromise;
  },
}));

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "INITIAL_SESSION") return;

  const store = useAuthStore.getState();

  if (session?.user) {
    if (store.user?.id !== session.user.id) {
      store.setUser(session.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile) store.setProfile(profile as UserProfile);
    }
  } else if (event === "SIGNED_OUT") {
    store.setUser(null);
    store.setProfile(null);
  }
});