import React from 'react';

export enum MenuItemText {
  DASHBOARD = 'لوحة التحكم',
  STUDENTS = 'الطلاب',
  TEACHERS = 'المعلمون',
  CLASSES = 'الحلقات',
  ATTENDANCE = 'الحضور',
  HOMEWORK = 'الواجبات',
  SESSIONS = 'جلسات اليوم',
  PAYMENTS = 'الاشتراكات والمدفوعات',
  REPORTS = 'التقارير',
  SETTINGS = 'الإعدادات',
  LOGOUT = 'تسجيل الخروج',
  ENROLLMENTS = 'تسجيل الحلقات',
  STAFF = 'إدارة الموظفين',
}

export interface MenuItem {
  text: MenuItemText;
  icon: React.ReactNode;
  path: string;
  roles: string[]; // Roles allowed to see this
}