import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/Login.jsx';
import ForgotPasswordPage from './pages/ForgotPassword.jsx';
import { ApplicationLayout } from './layout/ApplicationLayout';
import Dashboard from './pages/Dashboard';
import GetStartedFormsPage from './pages/GetStartedForms/GetStartedFormsPage';
import JoinTeamPage from './pages/JoinTeam/JoinTeamPage';
import AgencyPartnershipPage from './pages/AgencyPartnership/AgencyPartnershipPage';
import SubscriptionsPage from './pages/Subscriptions/SubscriptionsPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route
            path="/*"
            element={
              <PrivateRoute>
                <ApplicationLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/get-started-forms" element={<GetStartedFormsPage />} />
                    <Route path="/join-team" element={<JoinTeamPage />} />
                    <Route path="/agency-partnership" element={<AgencyPartnershipPage />} />
                    <Route path="/subscriptions" element={<SubscriptionsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ApplicationLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
