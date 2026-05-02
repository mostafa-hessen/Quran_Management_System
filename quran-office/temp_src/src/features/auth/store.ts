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
    initializationPromise = null;
    set({ user: null, profile: null, loading: false }); 
  },

  initialize: async () => {
    if (initializationPromise) return initializationPromise;
    if (get().initialized) return Promise.resolve();

    initializationPromise = (async () => {
      set({ loading: true });
      try {
        const { data: { session } } = await supabase.auth.getSession();

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
      }
    })();

    return initializationPromise;
  },
}));

supabase.auth.onAuthStateChange(async (event, session) => {
  const store = useAuthStore.getState();
  if (!store.initialized) return;

  if (event === "SIGNED_IN" && session?.user) {
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