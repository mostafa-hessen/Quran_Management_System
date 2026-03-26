import { Role } from '../types';
import { useAuthStore } from '../store';

export const usePermissions = () => {
  const { profile, user } = useAuthStore();
  
  const role = profile?.role;
  
  const isAdmin = role === Role.ADMIN;
  const isSupervisor = role === Role.SUPERVISOR;
  const isTeacher = role === Role.TEACHER;

  // Grouped permissions logic
  const isStaff = isAdmin || isSupervisor;

  return {
    role,
    user,
    profile,
    isAdmin,
    isSupervisor,
    isTeacher,
    isStaff,
    canManageTeachers: isStaff,
    canManagePayments: isStaff,
    canViewAllHalaqat: isStaff,
    canManageSettings: isAdmin,
  };
};
