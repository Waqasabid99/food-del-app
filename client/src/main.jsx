import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Main from "./admin/pages/Main.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem>
      <BrowserRouter>
        <CartProvider>
          <Routes>
            <Route path="/*" element={<App />} />
            <Route path="/admin/*" element={<Main />} />
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
