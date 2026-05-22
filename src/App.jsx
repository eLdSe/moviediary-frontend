import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MoviesPage from "./pages/MoviesPage/MoviesPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import { authService } from "./services/authService";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import "./App.css";

const PrivateRoute = ({ children }) => {
  return authService.isLoggedIn() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MoviesPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
