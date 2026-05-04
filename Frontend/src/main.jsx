import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async"; // ✅ Add this import
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient(); // Fixed typo: queryCLient -> queryClient

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <HelmetProvider> {/* ✅ Wrap with HelmetProvider */}
      <StrictMode>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    </HelmetProvider>
  </QueryClientProvider>
);