import React, { createContext, useContext, useState, ReactNode } from "react";

type Cosmetic = {
  sku: string;
  title: string;
  price_cents: number;
};

type WalletCtx = {
  balance: number;
  purchases: string[];
  addCoins: (cents: number) => void;
  purchase: (c: Cosmetic) => Promise<{ success: boolean; message?: string }>;
  owns: (sku: string) => boolean;
};

const Wallet = createContext<WalletCtx | null>(null);
export const useWallet = () => {
  const ctx = useContext(Wallet);
  if (!ctx) throw new Error("useWallet must be within WalletProvider");
  return ctx;
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(() => {
    const raw = localStorage.getItem("nebula_balance");
    return raw ? parseInt(raw, 10) : 0;
  });
  const [purchases, setPurchases] = useState<string[]>(() => {
    const raw = localStorage.getItem("nebula_purchases");
    return raw ? JSON.parse(raw) : [];
  });

  const persist = (b: number, p: string[]) => {
    localStorage.setItem("nebula_balance", String(b));
    localStorage.setItem("nebula_purchases", JSON.stringify(p));
  };

  const addCoins = (cents: number) => {
    const nb = balance + cents;
    setBalance(nb);
    persist(nb, purchases);
  };

  const purchase = async (c: Cosmetic) => {
    if (purchases.includes(c.sku)) return { success: false, message: "Already owned" };
    if (balance < c.price_cents) return { success: false, message: "Insufficient funds" };
    const nb = balance - c.price_cents;
    const np = [...purchases, c.sku];
    setBalance(nb);
    setPurchases(np);
    persist(nb, np);
    return { success: true };
  };

  const owns = (sku: string) => purchases.includes(sku);

  return (
    <Wallet.Provider value={{ balance, purchases, addCoins, purchase, owns }}>
      {children}
    </Wallet.Provider>
  );
}
