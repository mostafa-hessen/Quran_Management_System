import { MenuItemText, type MenuItem } from "../../types/menu.types"

import {
  DashboardRounded,
  PeopleRounded,
  SchoolRounded,
  AutoStoriesRounded,
  AssignmentTurnedInRounded,
  PaymentsRounded,
  NotificationsRounded,
  BadgeRounded,
  BarChartRounded,
} from '@mui/icons-material';


export const menuItems: MenuItem[] = [
  {
    text: MenuItemText.DASHBOARD,
    icon: <DashboardRounded />,
    path: '/',
    roles: ['admin', 'supervisor', 'teacher'],
  },
  {
    text: MenuItemText.TEACHERS,
    icon: <SchoolRounded />,
    path: '/teachers',
    roles: ['admin', 'supervisor'],
  },
  {
    text: MenuItemText.STUDENTS,
    icon: <PeopleRounded />,
    path: '/students',
    roles: ['admin', 'supervisor', 'teacher'],
  },
  {
    text: MenuItemText.CLASSES,
    icon: <AutoStoriesRounded />,
    path: '/halaqat',
    roles: ['admin', 'supervisor', 'teacher'],
  },
  {
    text: MenuItemText.ENROLLMENTS,
    icon: <NotificationsRounded />,
    path: '/enrollments',
    roles: ['admin', 'supervisor'],
  },
  {
    text: MenuItemText.SESSIONS,
    icon: <NotificationsRounded />,
    path: '/sessions',
    roles: ['admin', 'supervisor', 'teacher'],
  },
  {
    text: MenuItemText.ATTENDANCE,
    icon: <AssignmentTurnedInRounded />,
    path: '/attendance',
    roles: ['admin', 'supervisor', 'teacher'],
  },
  {
    text: MenuItemText.PAYMENTS,
    icon: <PaymentsRounded />,
    path: '/payments',
    roles: ['admin', 'supervisor'],
  },
  {
    text: MenuItemText.REPORTS,
    icon: <BarChartRounded />,
    path: '/reports',
    roles: ['admin', 'supervisor'],
  },
  // ─── Admin-only ──────────────────────────────
  {
    text: MenuItemText.STAFF,
    icon: <BadgeRounded />,
    path: '/staff',
    roles: ['admin', 'supervisor'],   // visible to admins and supervisors (secretaries)
  },
  {
    text: MenuItemText.AUDIT_LOGS,
    icon: <AssignmentTurnedInRounded />,
    path: '/audit-logs',
    roles: ['admin'], // Admin only
  },
];