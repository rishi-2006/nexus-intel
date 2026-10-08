import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import InvestigationsPage from '../pages/InvestigationsPage';
import EntitiesPage from '../pages/EntitiesPage';
import RelationshipsPage from '../pages/RelationshipsPage';
import EvidencePage from '../pages/EvidencePage';
import NetworkExplorerPage from '../pages/NetworkExplorerPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import AnomaliesPage from '../pages/AnomaliesPage';
import TimelinePage from '../pages/TimelinePage';
import DataSourcesPage from '../pages/DataSourcesPage';
import NexusAIPage from '../pages/NexusAIPage';
import ReportsPage from '../pages/ReportsPage';
import UsersPage from '../pages/UsersPage';
import AuditLogsPage from '../pages/AuditLogsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes wrapped with MainLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />

        <Route
          path="cases"
          element={
            <RoleGuard allowedRoles={['ADMIN', 'INVESTIGATOR']}>
              <InvestigationsPage />
            </RoleGuard>
          }
        />

        <Route path="entities" element={<EntitiesPage />} />
        <Route path="relationships" element={<RelationshipsPage />} />
        <Route path="evidence" element={<EvidencePage />} />
        <Route path="network" element={<NetworkExplorerPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="anomalies" element={<AnomaliesPage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="data-sources" element={<DataSourcesPage />} />
        <Route path="nexus-ai" element={<NexusAIPage />} />
        <Route path="reports" element={<ReportsPage />} />

        {/* Admin only views */}
        <Route
          path="users"
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <UsersPage />
            </RoleGuard>
          }
        />
        <Route
          path="audit-logs"
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AuditLogsPage />
            </RoleGuard>
          }
        />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
