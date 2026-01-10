
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Tracker } from './pages/Tracker';
import { Narrative } from './pages/Narrative';
import { ParkingLot } from './pages/ParkingLot';
import { Publisher } from './pages/Publisher';
import { Community } from './pages/Community';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { Settings } from './pages/Settings';

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-primary">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if trying to access protected app routes without a profile
  // Allow access to /app/onboarding to prevent loop
  /* 
     NOTE: Logic to checking profile existence would go here.
     For now, we rely on the user flow or Layout to redirect if needed, 
     or handle it inside Layout. 
  */

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route path="/app/onboarding" element={
            <RequireAuth>
              <Onboarding />
            </RequireAuth>
          } />

          <Route path="/app/*" element={
            <RequireAuth>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/tracker" element={<Tracker />} />
                  <Route path="/narrative" element={<Narrative />} />
                  <Route path="/ideas" element={<ParkingLot />} />
                  <Route path="/publisher" element={<Publisher />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/app" replace />} />
                </Routes>
              </Layout>
            </RequireAuth>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
