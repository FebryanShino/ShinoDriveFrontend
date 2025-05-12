import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/:id" element={<Homepage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
