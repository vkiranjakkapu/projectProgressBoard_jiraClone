import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthenticationContextProvider from "./context/AuthenticationContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthenticationContextProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthenticationContextProvider>
    </StrictMode>,
);
