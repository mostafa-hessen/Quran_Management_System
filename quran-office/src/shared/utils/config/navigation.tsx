import { MenuItemText, type MenuItem} from "../../types/menu.types"

import { 
  DashboardRounded, 
  PeopleRounded, 
  SchoolRounded, 
  AutoStoriesRounded,
  AssignmentTurnedInRounded,
  PaymentsRounded,
  NotificationsRounded,
} from '@mui/icons-material';


export const menuItems: MenuItem[] = [
  { text: MenuItemText.DASHBOARD, icon: <DashboardRounded />, path: '/', roles: ['admin', 'supervisor', 'teacher'] },
  { text:MenuItemText.TEACHERS, icon: <PeopleRounded />, path: '/teachers', roles: ['admin', 'supervisor'] },
  { text: MenuItemText.STUDENTS, icon: <SchoolRounded />, path: '/students', roles: ['admin', 'supervisor', 'teacher'] },
  { text: MenuItemText.CLASSES, icon: <AutoStoriesRounded />, path: '/halaqat', roles: ['admin', 'supervisor', 'teacher'] },
  { text: MenuItemText.SESSIONS, icon: <NotificationsRounded />, path: '/sessions', roles: ['admin', 'supervisor', 'teacher'] },
  { text: MenuItemText.ATTENDANCE, icon: <AssignmentTurnedInRounded />, path: '/attendance', roles: ['admin', 'supervisor', 'teacher'] },
  { text: MenuItemText.PAYMENTS, icon: <PaymentsRounded />, path: '/payments', roles: ['admin', 'supervisor'] },
];