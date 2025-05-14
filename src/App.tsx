import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import { ThemeProvider } from "./components/theme-provider";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState } from "react";
import type { User } from "./types";
import RegisterPage from "./pages/RegisterPage";
import GuestRoute from "./components/GuestRoute";

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
      </Routes>
    </ThemeProvider>
  );
}

export default App;
