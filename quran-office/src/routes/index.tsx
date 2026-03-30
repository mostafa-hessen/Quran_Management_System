import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout   from '@/shared/layout/MainLayout';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';
import TeachersPage from '@/pages/TeachersPage';
import StudentsPage from '@/pages/StudentsPage';
import EnrollmentsPage from '@/pages/EnrollmentsPage';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';


// سنقوم بإنشاء هذه الصفحات لاحقاً، حالياً سنضيف Placeholder
const Placeholder = ({ title }: { title: string }) => (
  <div>
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
    ), // Protected Layout

    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'teachers',
        element: <TeachersPage />
      },
      {
        path: 'students',
        element: <StudentsPage />
      },
      {
        path: 'halaqat',
        element: <Placeholder title="الحلقات" />
      },
      {
        path: 'enrollments',
        element: <EnrollmentsPage />
      },
      {
        path: 'sessions',
        element: <Placeholder title="الجلسات والحضور" />
      },
      {
        path: 'attendance',
        element: <Placeholder title="الحضور والغياب" />
      },
      {
        path: 'payments',
        element: <Placeholder title="الاشتراكات والمدفوعات" />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
