import { useCallback } from 'react';
import { Role } from '../types';
import { useAuthStore } from '../store';
import { Permission, ROLE_PERMISSIONS } from '../permissions';

export const usePermissions = () => {
  const { profile, user } = useAuthStore();
  
  const role = profile?.role;
  
  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!role) return false;
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
  }, [role]);

  const hasAnyPermission = useCallback((...perms: Permission[]) => {
    return perms.some(hasPermission);
  }, [hasPermission]);

  const isAdmin = role === Role.ADMIN;
  const isSupervisor = role === Role.SUPERVISOR;
  const isTeacher = role === Role.TEACHER;

  // Grouped permissions logic
  const isStaff = isAdmin || isSupervisor;

  return {
    role,
    user,
    profile,
    hasPermission,
    hasAnyPermission,
    isAdmin,
    isSupervisor,
    isTeacher,
    isStaff,
    // Backward compatibility for existing components
    canManageTeachers: isStaff,
    canManagePayments: isStaff,
    canViewAllHalaqat: isStaff,
    canManageSettings: isAdmin,
  };
};
