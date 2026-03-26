import React from 'react';

export enum MenuItemText {
  DASHBOARD = 'لوحة التحكم',
  STUDENTS = 'الطلاب',
  TEACHERS = 'المعلمون',
  CLASSES = 'الحلقات',
  ATTENDANCE = 'الحضور',
  HOMEWORK = 'الواجبات',
  SETTINGS = 'الإعدادات',
  SESSIONS = 'جلسات اليوم',
  PAYMENTS = 'الاشتراكات والمدفوعات',
  LOGOUT = 'تسجيل الخروج',
}
export interface MenuItem {
  text: MenuItemText;
  icon: React.ReactNode;
  path: string;
  roles: string[]; // Roles allowed to see this
}