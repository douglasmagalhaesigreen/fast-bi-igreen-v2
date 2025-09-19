import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

// Layouts e Páginas com os caminhos JÁ CORRIGIDOS
import MainLayout from './components/layout/MainLayout'; 
import Login from './features/auth/Login';
import DashboardTV from './pages/DashboardTV'; // Assumindo que este ainda não foi movido
import ProtectedRoute from './features/auth/components/ProtectedRoute'; // Caminho corrigido

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
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;