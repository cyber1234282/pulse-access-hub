import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import { Toolkit } from "@/pages/Toolkit";

createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/toolkit" element={<Toolkit />} />
    </Routes>
  </Router>
);
