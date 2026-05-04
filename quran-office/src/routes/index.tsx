import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/shared/layout/MainLayout';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';
import TeachersPage from '@/pages/TeachersPage';
import StudentsPage from '@/pages/StudentsPage';
import EnrollmentsPage from '@/pages/EnrollmentsPage';
import HalaqatPage from '@/pages/HalaqatPage';
import StaffPage from '@/pages/StaffPage';
import PaymentsPage from '@/pages/PaymentsPage';
import ReportsPage from '@/pages/ReportsPage';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import AdminRoute from '@/features/auth/components/AdminRoute';
import AuditLogsPage from '@/pages/AuditLogsPage';
import HalaqaDetailsPage from '@/pages/HalaqaDetailsPage';

// Placeholder for under-construction pages
const Placeholder = ({ title }: { title: string }) => (
  <div style={{ padding: 32 }}>
    <h2>{title}</h2>
    <p>تحت الإنشاء...</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { 
        path: 'teachers', 
        element: (
          <AdminRoute>
            <TeachersPage />
          </AdminRoute>
        ) 
      },
      { path: 'students', element: <StudentsPage /> },
      { path: 'halaqat', element: <HalaqatPage /> },
      { path: 'halaqat/:id', element: <HalaqaDetailsPage /> },
      // { path: 'enrollments', element: <EnrollmentsPage /> },
      { path: 'sessions', element: <Placeholder title="الجلسات والحضور" /> },
      { path: 'attendance', element: <Placeholder title="الحضور والغياب" /> },
      { 
        path: 'payments', 
        element: (
          <AdminRoute>
            <PaymentsPage />
          </AdminRoute>
        ) 
      },
      // { path: 'reports', element: <ReportsPage /> },
      {
        // Staff management — admin only
        path: 'staff',
        element: (
          <AdminRoute>
            <StaffPage />
          </AdminRoute>
        ),
      },
      {
        path: 'audit-logs',
        element: (
          <AdminRoute>
            <AuditLogsPage />
          </AdminRoute>
        ),
      },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);
