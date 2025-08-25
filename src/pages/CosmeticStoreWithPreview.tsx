import React, { useEffect, useState } from "react";
import GLBPreviewModal from "../components/GLBPreviewModal";
import ParticlePreview from "../components/ParticlePreview";
import { useWallet } from "../contexts/WalletContext";

type Cosmetic = {
  sku: string;
  title: string;
  type: string;
  price_cents: number;
  rarity: string;
  asset: {
    model_url?: string;
    particle_config?: string;
    thumbnail: string;
  };
};

export default function CosmeticStoreWithPreview() {
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([]);
  const [previewGLB, setPreviewGLB] = useState<string | undefined>();
  const [previewParticle, setPreviewParticle] = useState<string | undefined>();
  const [particleConfig, setParticleConfig] = useState<any>(null);
  const wallet = useWallet();

  useEffect(() => {
    fetch("./assets/cosmetics/cosmetics.json")
      .then((r) => r.json())
      .then((data) => setCosmetics(data))
      .catch((err) => console.error(err));
  }, []);

  const openParticle = async (url?: string) => {
    if (!url) return;
    try {
      const res = await fetch(url);
      const json = await res.json();
      setParticleConfig(json);
      setPreviewParticle(url);
    } catch (e) {
      console.error("particle load err", e);
    }
  };

  const buy = async (c: Cosmetic) => {
    const res = await wallet.purchase(c);
    if (!res.success) {
      alert(res.message ?? "Could not purchase");
    } else {
      alert("Purchase successful — owned!");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Nebula Cosmetic Store</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm opacity-70">NebulaCoins</div>
            <div className="font-semibold">${(wallet.balance / 100).toFixed(2)}</div>
          </div>
          <button
            className="px-3 py-2 rounded bg-indigo-600 text-white"
            onClick={() => {
              const cents = 500; 
              wallet.addCoins(cents);
              alert("Credited $5 (500 NC) to your wallet (demo)");
            }}
          >
            Buy Coins
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cosmetics.map((c) => (
          <div key={c.sku} className="bg-white rounded-2xl p-4 shadow">
            <div className="flex items-center gap-3">
              <img src={c.asset.thumbnail} alt={c.title} className="w-20 h-20 object-contain" />
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm opacity-60">{c.type}</div>
                <div className="mt-2 font-bold">${(c.price_cents / 100).toFixed(2)}</div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              {c.asset.model_url && (
                <button className="px-3 py-1 rounded bg-slate-800 text-white"
                        onClick={() => setPreviewGLB(c.asset.model_url)}>Preview 3D</button>
              )}
              {c.asset.particle_config && (
                <button className="px-3 py-1 rounded bg-amber-600 text-white"
                        onClick={() => openParticle(c.asset.particle_config)}>Preview Particles</button>
              )}
              <button className="ml-auto px-3 py-1 rounded bg-green-600 text-white"
                      onClick={() => buy(c)}>
                {wallet.owns(c.sku) ? "
