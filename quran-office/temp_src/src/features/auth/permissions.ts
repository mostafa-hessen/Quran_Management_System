import { Role } from './types';

export enum Permission {
  // Students Module
  STUDENT_CREATE = 'student:create',
  STUDENT_READ = 'student:read',
  STUDENT_UPDATE = 'student:update',
  STUDENT_DELETE = 'student:delete',

  // Teachers Module
  TEACHER_CREATE = 'teacher:create',
  TEACHER_READ = 'teacher:read',
  TEACHER_UPDATE = 'teacher:update',
  TEACHER_DELETE = 'teacher:delete',

  // Halaqat Module
  HALAQA_CREATE = 'halaqa:create',
  HALAQA_READ = 'halaqa:read',
  HALAQA_UPDATE = 'halaqa:update',
  HALAQA_DELETE = 'halaqa:delete',

  // Attendance Module
  ATTENDANCE_RECORD = 'attendance:record',
  ATTENDANCE_READ = 'attendance:read',

  // Financial Module
  PAYMENT_CREATE = 'payment:create',
  PAYMENT_READ = 'payment:read',
  SUBSCRIPTION_MANAGE = 'subscription:manage',

  // Reports Module
  REPORTS_VIEW = 'reports:view',

  // System Settings
  SETTINGS_MANAGE = 'settings:manage',

  // Staff Management (Admin only)
  STAFF_MANAGE = 'staff:manage',
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission), // Admin has all permissions
  [Role.SUPERVISOR]: [
    Permission.STUDENT_CREATE,
    Permission.STUDENT_READ,
    Permission.STUDENT_UPDATE,
    Permission.TEACHER_READ,
    Permission.HALAQA_READ,
    Permission.ATTENDANCE_READ,
    Permission.PAYMENT_READ,
    Permission.REPORTS_VIEW,
  ],
  [Role.TEACHER]: [
    Permission.STUDENT_READ,
    Permission.HALAQA_READ,
    Permission.ATTENDANCE_RECORD,
    Permission.ATTENDANCE_READ,
  ],
};
