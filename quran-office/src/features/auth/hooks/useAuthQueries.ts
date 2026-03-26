import { useMutation } from '@tanstack/react-query';
import { signInWithEmail, signUpWithEmail } from '../api/authApi';
import type { Role } from '../types';

export const useSignIn = () => {
  return useMutation({
    mutationFn: ({ email, password }: any) => signInWithEmail(email, password),
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: ({ email, password, role, fullName }: any) => 
      signUpWithEmail(email, password, role as Role, fullName),
  });
};
