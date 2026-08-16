import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute, RoleProtectedRoute } from './ProtectedRoute'
import { PageLoader } from '@/components/loaders/PageLoader'

// ─── Layouts ──────────────────────────────────────────────────────────────────
const PublicLayout = lazy(() => import('@/layouts/PublicLayout'))
const CitizenLayout = lazy(() => import('@/layouts/CitizenLayout'))
const OfficerLayout = lazy(() => import('@/layouts/OfficerLayout'))
const SupervisorLayout = lazy(() => import('@/layouts/SupervisorLayout'))
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'))

// ─── Public pages ─────────────────────────────────────────────────────────────
const HomePage = lazy(() => import('@/pages/public/HomePage'))
const AboutPage = lazy(() => import('@/pages/public/AboutPage'))
const ContactPage = lazy(() => import('@/pages/public/ContactPage'))
const FaqPage = lazy(() => import('@/pages/public/FaqPage'))
const PrivacyPage = lazy(() => import('@/pages/public/PrivacyPage'))
const TermsPage = lazy(() => import('@/pages/public/TermsPage'))
const ReportCrimePage = lazy(() => import('@/pages/public/ReportCrimePage'))
const AnonymousReportPage = lazy(() => import('@/pages/public/AnonymousReportPage'))
const TrackReportPage = lazy(() => import('@/pages/public/TrackReportPage'))

// ─── Auth pages ───────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))

// ─── Citizen pages ────────────────────────────────────────────────────────────
const CitizenDashboard = lazy(() => import('@/pages/citizen/DashboardPage'))
const CitizenReports = lazy(() => import('@/pages/citizen/MyReportsPage'))
const CitizenCreateReport = lazy(() => import('@/pages/citizen/CreateReportPage'))
const CitizenReportDetail = lazy(() => import('@/pages/citizen/ReportDetailPage'))
const CitizenMessages = lazy(() => import('@/pages/citizen/MessagesPage'))
const CitizenNotifications = lazy(() => import('@/pages/citizen/NotificationsPage'))
const CitizenProfile = lazy(() => import('@/pages/citizen/ProfilePage'))

// ─── Officer pages ────────────────────────────────────────────────────────────
const OfficerDashboard = lazy(() => import('@/pages/officer/DashboardPage'))
const OfficerCases = lazy(() => import('@/pages/officer/AssignedCasesPage'))
const OfficerCaseDetail = lazy(() => import('@/pages/officer/CaseDetailPage'))
const OfficerMessages = lazy(() => import('@/pages/officer/MessagesPage'))
const OfficerNotifications = lazy(() => import('@/pages/officer/NotificationsPage'))
const OfficerProfile = lazy(() => import('@/pages/officer/ProfilePage'))

// ─── Supervisor pages ─────────────────────────────────────────────────────────
const SupervisorDashboard = lazy(() => import('@/pages/supervisor/DashboardPage'))
const SupervisorAssignments = lazy(() => import('@/pages/supervisor/AssignmentsPage'))
const SupervisorReports = lazy(() => import('@/pages/supervisor/ReportsPage'))
const SupervisorCaseDetails = lazy(() => import('@/pages/supervisor/CaseDetailsPage'))
const SupervisorAnalytics = lazy(() => import('@/pages/supervisor/AnalyticsPage'))
const SupervisorNotifications = lazy(() => import('@/pages/supervisor/NotificationsPage'))
const SupervisorProfile = lazy(() => import('@/pages/supervisor/ProfilePage'))

// ─── Admin pages ──────────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import('@/pages/admin/DashboardPage'))
const AdminUsers = lazy(() => import('@/pages/admin/UsersPage'))
const AdminRoles = lazy(() => import('@/pages/admin/RolesPage'))
const AdminCategories = lazy(() => import('@/pages/admin/CategoriesPage'))
const AdminReports = lazy(() => import('@/pages/admin/ReportsPage'))
const AdminAnalytics = lazy(() => import('@/pages/admin/AnalyticsPage'))
const AdminActivityLogs = lazy(() => import('@/pages/admin/ActivityLogsPage'))
const AdminNotifications = lazy(() => import('@/pages/admin/NotificationsPage'))
const AdminSettings = lazy(() => import('@/pages/admin/SettingsPage'))
const AdminWantedPersons = lazy(() => import('@/pages/admin/WantedPersonsPage'))
const AdminReportDetails = lazy(() => import('@/pages/admin/ReportDetailsPage'))

// ─── Error pages ──────────────────────────────────────────────────────────────
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'))
const UnauthorizedPage = lazy(() => import('@/pages/public/UnauthorizedPage'))
const ServerErrorPage = lazy(() => import('@/pages/public/ServerErrorPage'))

import type { ReactNode } from 'react'

const wrap = (element: ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
)

const router = createBrowserRouter([
  // ── Public ─────────────────────────────────────────────────────────────────
  {
    element: wrap(<PublicLayout />),
    errorElement: wrap(<ServerErrorPage />),
    children: [
      { path: '/', element: wrap(<HomePage />) },
      { path: '/about', element: wrap(<AboutPage />) },
      { path: '/contact', element: wrap(<ContactPage />) },
      { path: '/faq', element: wrap(<FaqPage />) },
      { path: '/privacy', element: wrap(<PrivacyPage />) },
      { path: '/terms', element: wrap(<TermsPage />) },
      { path: '/report-crime', element: wrap(<ReportCrimePage />) },
      { path: '/anonymous-report', element: wrap(<AnonymousReportPage />) },
      { path: '/track', element: wrap(<TrackReportPage />) },
    ],
  },

  // ── Auth ───────────────────────────────────────────────────────────────────
  { path: '/login', element: wrap(<LoginPage />), errorElement: wrap(<ServerErrorPage />) },
  { path: '/register', element: wrap(<RegisterPage />), errorElement: wrap(<ServerErrorPage />) },
  { path: '/forgot-password', element: wrap(<ForgotPasswordPage />), errorElement: wrap(<ServerErrorPage />) },

  // ── Citizen ────────────────────────────────────────────────────────────────
  {
    path: '/citizen',
    element: (
      <ProtectedRoute>
        <RoleProtectedRoute allowedRoles={['Citizen']}>
          {wrap(<CitizenLayout />)}
        </RoleProtectedRoute>
      </ProtectedRoute>
    ),
    errorElement: wrap(<ServerErrorPage />),
    children: [
      { index: true, element: wrap(<CitizenDashboard />) },
      { path: 'reports', element: wrap(<CitizenReports />) },
      { path: 'reports/create', element: wrap(<CitizenCreateReport />) },
      { path: 'reports/:id', element: wrap(<CitizenReportDetail />) },
      { path: 'messages', element: wrap(<CitizenMessages />) },
      { path: 'notifications', element: wrap(<CitizenNotifications />) },
      { path: 'profile', element: wrap(<CitizenProfile />) },
    ],
  },

  // ── Officer ────────────────────────────────────────────────────────────────
  {
    path: '/officer',
    element: (
      <ProtectedRoute>
        <RoleProtectedRoute allowedRoles={['Officer']}>
          {wrap(<OfficerLayout />)}
        </RoleProtectedRoute>
      </ProtectedRoute>
    ),
    errorElement: wrap(<ServerErrorPage />),
    children: [
      { index: true, element: wrap(<OfficerDashboard />) },
      { path: 'cases', element: wrap(<OfficerCases />) },
      { path: 'cases/:id', element: wrap(<OfficerCaseDetail />) },
      { path: 'messages', element: wrap(<OfficerMessages />) },
      { path: 'notifications', element: wrap(<OfficerNotifications />) },
      { path: 'profile', element: wrap(<OfficerProfile />) },
    ],
  },

  // ── Supervisor ─────────────────────────────────────────────────────────────
  {
    path: '/supervisor',
    element: (
      <ProtectedRoute>
        <RoleProtectedRoute allowedRoles={['Supervisor']}>
          {wrap(<SupervisorLayout />)}
        </RoleProtectedRoute>
      </ProtectedRoute>
    ),
    errorElement: wrap(<ServerErrorPage />),
    children: [
      { index: true, element: wrap(<SupervisorDashboard />) },
      { path: 'assignments', element: wrap(<SupervisorAssignments />) },
      { path: 'reports', element: wrap(<SupervisorReports />) },
      { path: 'reports/:id', element: wrap(<SupervisorCaseDetails />) },
      { path: 'analytics', element: wrap(<SupervisorAnalytics />) },
      { path: 'notifications', element: wrap(<SupervisorNotifications />) },
      { path: 'profile', element: wrap(<SupervisorProfile />) },
    ],
  },

  // ── Admin ──────────────────────────────────────────────────────────────────
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleProtectedRoute allowedRoles={['Admin']}>
          {wrap(<AdminLayout />)}
        </RoleProtectedRoute>
      </ProtectedRoute>
    ),
    errorElement: wrap(<ServerErrorPage />),
    children: [
      { index: true, element: wrap(<AdminDashboard />) },
      { path: 'users', element: wrap(<AdminUsers />) },
      { path: 'roles', element: wrap(<AdminRoles />) },
      { path: 'categories', element: wrap(<AdminCategories />) },
      { path: 'reports', element: wrap(<AdminReports />) },
      { path: 'reports/:id', element: wrap(<AdminReportDetails />) },
      { path: 'analytics', element: wrap(<AdminAnalytics />) },
      { path: 'activity-logs', element: wrap(<AdminActivityLogs />) },
      { path: 'notifications', element: wrap(<AdminNotifications />) },
      { path: 'settings', element: wrap(<AdminSettings />) },
      { path: 'wanted-persons', element: wrap(<AdminWantedPersons />) },
    ],
  },

  // ── Error pages ────────────────────────────────────────────────────────────
  { path: '/unauthorized', element: wrap(<UnauthorizedPage />) },
  { path: '/500', element: wrap(<ServerErrorPage />) },
  { path: '*', element: wrap(<NotFoundPage />) },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
