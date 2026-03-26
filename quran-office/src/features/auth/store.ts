import { create } from 'zustand';
import { supabase } from '@/shared/lib/supabase';
import type { AuthState, UserProfile } from './types';

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
  },

  initialize: async () => {
    if (get().initialized) return;
    
    try {
      set({ loading: true });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        set({ user: session.user });
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          set({ profile: profile as UserProfile });
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ loading: false, initialized: true });
    }
  }
}));

// Setup auth listener with guards to prevent redundant updates
supabase.auth.onAuthStateChange(async (event, session) => {
  const store = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' && session) {
    if (store.user?.id === session.user.id && store.profile) return;
    
    store.setUser(session.user);
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    if (profile) store.setProfile(profile as UserProfile);
  } else if (event === 'SIGNED_OUT') {
    if (!store.user && !store.profile) return;
    store.setUser(null);
    store.setProfile(null);
  }
});
