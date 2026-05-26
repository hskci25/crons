import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import DashboardPage from "./pages/DashboardPage";
import QuestionsPage from "./pages/QuestionsPage";
import QuestionWorkspacePage from "./pages/QuestionWorkspacePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/questions"
        element={
          <ProtectedRoute>
            <QuestionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/questions/two-sum"
        element={<Navigate to="/questions/pair-match-service" replace />}
      />
      <Route
        path="/questions/:slug"
        element={
          <ProtectedRoute>
            <QuestionWorkspacePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
