import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RouteGuard } from './components/RouteGuard';
import { Layout } from './components/Layout';

// Import Pages
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Directory } from './pages/Directory';
import { Profile } from './pages/Profile';
import { Missions } from './pages/Missions';
import { MissionDetail } from './pages/MissionDetail';
import { MissionCreateEdit } from './pages/MissionCreateEdit';
import { Teams } from './pages/Teams';
import { DemoSubmission } from './pages/DemoSubmission';
import { Review } from './pages/Review';
import { Badges } from './pages/Badges';
import { CubeVault } from './pages/CubeVault';
import { DemoDays } from './pages/DemoDays';
import { AdminUsers } from './pages/AdminUsers';
import { AdminApplications } from './pages/AdminApplications';
import { ChangePassword } from './pages/ChangePassword';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Welcome Landing Route */}
          <Route path="/" element={<Welcome />} />

          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Secure App Routes */}
          <Route
            element={
              <RouteGuard>
                <Layout />
              </RouteGuard>
            }
          >
            {/* Dashboard Router */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="change-password" element={<ChangePassword />} />

            {/* Cube Directory & Profile */}
            <Route path="directory" element={<Directory />} />
            <Route path="cubes/:id" element={<Profile />} />

            {/* Missions List & Details */}
            <Route path="missions" element={<Missions />} />
            <Route path="missions/:id" element={<MissionDetail />} />
            
            {/* Mission Create/Edit (Admins & Mentors) */}
            <Route
              path="missions/new"
              element={
                <RouteGuard allowedRoles={['ADMIN', 'MENTOR']}>
                  <MissionCreateEdit />
                </RouteGuard>
              }
            />
            <Route
              path="missions/:id/edit"
              element={
                <RouteGuard allowedRoles={['ADMIN', 'MENTOR']}>
                  <MissionCreateEdit />
                </RouteGuard>
              }
            />
            <Route
              path="missions/:id/review"
              element={
                <RouteGuard allowedRoles={['ADMIN', 'MENTOR']}>
                  <Review />
                </RouteGuard>
              }
            />

            {/* Teams Management (Admins & Mentors) */}
            <Route
              path="teams"
              element={
                <RouteGuard allowedRoles={['ADMIN', 'MENTOR']}>
                  <Teams />
                </RouteGuard>
              }
            />

            {/* Demo Submissions (Cubes only) */}
            <Route
              path="submit-demo"
              element={
                <RouteGuard allowedRoles={['CUBE']}>
                  <DemoSubmission />
                </RouteGuard>
              }
            />

            {/* Badges Overview & Allocation */}
            <Route path="badges" element={<Badges />} />

            {/* Cube Vault (Archive) */}
            <Route path="vault" element={<CubeVault />} />

            {/* Demo Days Scheduling (Admins & Mentors) */}
            <Route
              path="demodays"
              element={
                <RouteGuard allowedRoles={['ADMIN', 'MENTOR']}>
                  <DemoDays />
                </RouteGuard>
              }
            />

            {/* Admin-only User Administration */}
            <Route
              path="admin/users"
              element={
                <RouteGuard allowedRoles={['ADMIN']}>
                  <AdminUsers />
                </RouteGuard>
              }
            />

            {/* Admin-only Recruitment Applications */}
            <Route
              path="admin/applications"
              element={
                <RouteGuard allowedRoles={['ADMIN']}>
                  <AdminApplications />
                </RouteGuard>
              }
            />
          </Route>

          {/* Fallback Catch-all redirecting to Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
