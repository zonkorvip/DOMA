/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ExamPage from './pages/ExamPage';
import SettingsPage from './pages/SettingsPage';
import { useUserStore } from './store/userStore';
import { useSettingsStore } from './store/settingsStore';
import { useEffect } from 'react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  const { theme, language } = useSettingsStore();

  useEffect(() => {
    // Theme application
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Language and RTL application
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [theme, language]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/levels/:levelId" 
          element={
            <ProtectedRoute>
              <ExamPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

