import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleSelectionPage } from './components/auth/RoleSelectionPage';
import { AuthPage } from './components/auth/AuthPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { PublicRegistration } from './components/auth/PublicRegistration';

type UserRole = 'admin' | 'teacher' | 'parent' | 'student';

function getSessionUser() {
  try {
    const raw = sessionStorage.getItem('authUser') || localStorage.getItem('authUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function handleLogout() {
  sessionStorage.clear();
  localStorage.removeItem('authUser');
  // Use replace to prevent the logout action from being in history
  window.location.replace('/app/role-selection');
}

/** Guard: redirect to role-selection if not authenticated */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = getSessionUser();
  if (!user) {
    return <Navigate to="/role-selection" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const user = getSessionUser();

  return (
    <BrowserRouter basename="/app">
      <Routes>
        {/* Default: if logged in, go to their dashboard; otherwise role selection */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={`/${user.role}/dashboard`} replace />
            ) : (
              <Navigate to="/role-selection" replace />
            )
          }
        />

        {/* Auth flow */}
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Guest Registration Flow */}
        <Route path="/register/students" element={<PublicRegistration />} />

        {/* Role-based dashboards */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard
                userName={user?.name ?? 'Admin'}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute>
              <TeacherDashboard
                userName={user?.name ?? 'Teacher'}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/dashboard"
          element={
            <ProtectedRoute>
              <ParentDashboard
                userName={user?.name ?? 'Parent'}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard
                userName={user?.name ?? 'Student'}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/role-selection" replace />} />
      </Routes>
    </BrowserRouter>
  );
}