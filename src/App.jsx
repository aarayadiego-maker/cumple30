import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicPage from "./pages/PublicPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<PublicPage />} />
      </Routes>
    </BrowserRouter>
  );
}
