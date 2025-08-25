import React, { useEffect, useState } from "react";

type Cosmetic = {
  sku: string;
  title: string;
  type: string;
  price_cents: number;
  rarity: string;
  asset: { model_url?: string; particle_config?: string; thumbnail: string };
};

export default function AdminPanel() {
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([]);
  const [form, setForm] = useState<Partial<Cosmetic>>({});

  useEffect(() => {
    fetch("./assets/cosmetics/cosmetics.json")
      .then((r) => r.json())
      .then((data) => setCosmetics(data))
      .catch(console.error);
  }, []);

  const addCosmetic = () => {
    if (!form.sku || !form.title) return alert("SKU & Title required");
    setCosmetics((prev) => [...prev, form as Cosmetic]);
    setForm({});
    alert("Cosmetic added locally. In a real deployment, push JSON to server/CDN.");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel (Demo)</h1>
      <div className="grid grid-cols-2 gap-4 max-w-xl">
        <input type="text" placeholder="SKU" value={form.sku || ""} onChange={(e)=>setForm({...form, sku:e.target.value})} className="p-2 border rounded"/>
        <input type="text" placeholder="Title" value={form.title || ""} onChange={(e)=>setForm({...form, title:e.target.value})} className="p-2 border rounded"/>
        <input type="text" placeholder="Type" value={form.type || ""} onChange={(e)=>setForm({...form, type:e.target.value})} className="p-2 border rounded"/>
        <input type="number" placeholder="Price cents" value={form.price_cents||""} onChange={(e)=>setForm({...form, price_cents:parseInt(e.target.value)})} className="p-2 border rounded"/>
        <input type="text" placeholder="Rarity" value={form.rarity || ""} onChange={(e)=>setForm({...form, rarity:e.target.value})} className="p-2 border rounded"/>
        <input type="text" placeholder="Thumbnail URL" value={form.asset?.thumbnail||""} onChange={(e)=>setForm({...form, asset:{thumbnail:e.target.value}})} className="p-2 border rounded"/>
        <input type="text" placeholder="Model URL (.glb)" value={form.asset?.model_url||""} onChange={(e)=>setForm({...form, asset:{...form.asset, model_url:e.target.value}})} className="p-2 border rounded"/>
      </div>
      <button onClick={addCosmetic} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Add Cosmetic</button>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Existing Cosmetics</h2>
        <ul className="list-disc pl-6">
          {cosmetics.map((c) => (
            <li key={c.sku}>{c.title} ({c.sku})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
