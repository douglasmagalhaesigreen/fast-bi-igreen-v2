import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';

// Layouts e Páginas
import MainLayout from './components/layout/MainLayout';
import Login from './features/auth/Login';
import DashboardTV from './pages/DashboardTV';
import AreaSelection from './pages/AreaSelection';
import ProtectedRoute from './features/auth/components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SettingsProvider>
            <Router>
              <Toaster
                position="top-right"
                reverseOrder={false}
              />
              
              <Routes>
                {/* Rota Pública */}
                <Route path="/login" element={<Login />} />

                {/* Rotas Protegidas */}
                <Route
                  path="/area-selection"
                  element={
                    <ProtectedRoute>
                      <AreaSelection />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard-tv"
                  element={
                    <ProtectedRoute>
                      <DashboardTV />
                    </ProtectedRoute>
                  }
                />

                {/* Redirecionamentos */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;