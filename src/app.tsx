import React, { useState } from "react";
import CosmeticStoreWithPreview from "./pages/CosmeticStoreWithPreview";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  const [page, setPage] = useState<"store" | "admin">("store");

  return (
    <div>
      <div className="flex gap-4 p-3 bg-gray-800 text-white">
        <button onClick={()=>setPage("store")}>Store</button>
        <button onClick={()=>setPage("admin")}>Admin Panel</button>
      </div>
      {page === "store" ? <CosmeticStoreWithPreview /> : <AdminPanel />}
    </div>
  );
}
