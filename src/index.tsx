import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { WalletProvider } from "./contexts/WalletContext";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  <WalletProvider>
    <App />
  </WalletProvider>
);
