import { useEffect, useState } from "react";

const CART_KEY = "kinetis-cart";
const MAX_QTY = 10;

function readCart(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return 0;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? Math.min(n, MAX_QTY) : 0;
  } catch {
    return 0;
  }
}

function writeCart(qty: number) {
  if (typeof window === "undefined") return;
  try {
    if (qty <= 0) window.localStorage.removeItem(CART_KEY);
    else window.localStorage.setItem(CART_KEY, String(Math.min(qty, MAX_QTY)));
  } catch {
    /* ignore */
  }
}

/**
 * Panier pour le produit unique Kinetis Brush.
 * Persiste la quantité dans localStorage. `mounted` permet d'éviter
 * tout mismatch d'hydratation SSR (la quantité est lue côté client).
 */
export function useCart() {
  const [quantity, setQuantityState] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setQuantityState(readCart());
    setMounted(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) setQuantityState(readCart());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function setQuantity(qty: number) {
    const clamped = Math.max(0, Math.min(qty, MAX_QTY));
    setQuantityState(clamped);
    writeCart(clamped);
  }

  function addToCart(qty = 1) {
    setQuantity(quantity + qty);
  }

  function clearCart() {
    setQuantity(0);
  }

  return { quantity, addToCart, setQuantity, clearCart, mounted, maxQty: MAX_QTY };
}
