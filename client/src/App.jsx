import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import MyEventsPage from './pages/MyEventsPage';
import EventSubmissionPage from './pages/EventSubmissionPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProblemStatements from './pages/admin/AdminProblemStatements';
import AdminSchedule from './pages/admin/AdminSchedule';
import AdminSubmissions from './pages/admin/AdminSubmissions';
import AdminSettings from './pages/admin/AdminSettings';

import { UserProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoute';

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-dark">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public / Participant Routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <LandingPage />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <LoginPage />
          </PublicLayout>
        }
      />
      <Route
        path="/admin/login"
        element={
          <PublicLayout>
            <AdminLoginPage />
          </PublicLayout>
        }
      />
      <Route
        path="/events"
        element={
          <PublicLayout>
            <EventsPage />
          </PublicLayout>
        }
      />
      <Route
        path="/events/:id"
        element={
          <PublicLayout>
            <EventDetailPage />
          </PublicLayout>
        }
      />

      {/* Protected Participant Routes */}
      <Route
        path="/my-events"
        element={
          <UserProtectedRoute>
            <PublicLayout>
              <MyEventsPage />
            </PublicLayout>
          </UserProtectedRoute>
        }
      />
      <Route
        path="/events/:eventId/submissions"
        element={
          <UserProtectedRoute>
            <PublicLayout>
              <EventSubmissionPage />
            </PublicLayout>
          </UserProtectedRoute>
        }
      />

      {/* Protected Admin Console Routes */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="problem-statements" element={<AdminProblemStatements />} />
        <Route path="schedule" element={<AdminSchedule />} />
        <Route path="submissions" element={<AdminSubmissions />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
