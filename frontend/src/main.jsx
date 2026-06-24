import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import StandingsPage from './pages/StandingsPage.jsx';
import SchedulePage from './pages/SchedulePage.jsx';
import MatchDetailPage from './pages/MatchDetailPage.jsx';
import SquadsPage from './pages/SquadsPage.jsx';
import ReservationsPage from './pages/ReservationsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PreviewPage from './pages/PreviewPage.jsx';
import { api } from './api/client.js';
import './styles.css';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('worldcup-session');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem('worldcup-session', JSON.stringify(session));
    } else {
      localStorage.removeItem('worldcup-session');
    }
  }, [session]);

  const value = useMemo(() => ({
    session,
    async login(email, password) {
      const next = await api.login(email, password);
      setSession(next);
      return next;
    },
    async register(name, email, password) {
      const next = await api.register(name, email, password);
      setSession(next);
      return next;
    },
    logout() {
      setSession(null);
    }
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function PrivateRoute({ children }) {
  const { session } = useAuth();
  return session ? children : <Navigate to="/login" replace />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/standings" element={<StandingsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/matches/:id" element={<MatchDetailPage />} />
            <Route path="/squads" element={<SquadsPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/reservations" element={<PrivateRoute><ReservationsPage /></PrivateRoute>} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
