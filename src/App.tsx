import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import FileItemDetailPage from "./pages/FileItemDetailPage";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import type { User } from "./types";

function App() {
  const [user, setUser] = useState<User>();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />{" "}
            </GuestRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute
              onCheckSuccess={(authorizedUser) => setUser(authorizedUser)}
            >
              <Homepage user={user as User} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:id"
          element={
            <ProtectedRoute
              onCheckSuccess={(authorizedUser) => setUser(authorizedUser)}
            >
              <Homepage user={user as User} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:id/detail"
          element={
            <ProtectedRoute
              onCheckSuccess={(authorizedUser) => setUser(authorizedUser)}
            >
              <FileItemDetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
