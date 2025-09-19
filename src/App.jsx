import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

// Layouts & Pages
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import DashboardTV from './pages/DashboardTV';
import ProtectedRoute from './components/auth/ProtectedRoute'; // Usando o ProtectedRoute mais robusto

// Crie o cliente React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Toaster position="top-right" />
            <Routes>
              {/* Rota de Login (Pública) */}
              <Route path="/login" element={<Login />} />

              {/* Rota do Dashboard TV (Protegida) */}
              <Route
                path="/dashboard-tv"
                element={
                  <ProtectedRoute>
                    <DashboardTV />
                  </ProtectedRoute>
                }
              />
              
              {/* Rotas principais protegidas com o MainLayout */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              />
              
              {/* Redirecionamento padrão */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;