import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import MainLayout from "./layouts/MainLayout";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <MainLayout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/:id" element={<Homepage />} />
        </Routes>
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
