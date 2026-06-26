// src/context/CartContext.js
"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { doc, onSnapshot, runTransaction, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [uid, setUid] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // current uid pakdo (anonymous ya logged-in, dono)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  // cart doc ko real-time listen karo
  useEffect(() => {
    if (!uid) return;
    const cartRef = doc(db, "carts", uid);
    const unsub = onSnapshot(cartRef, (snap) => {
      setItems(snap.exists() ? snap.data().items || [] : []);
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  const addToCart = useCallback(async (food, qty = 1) => {
    if (!uid) return;
    const cartRef = doc(db, "carts", uid);
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(cartRef);
      const current = snap.exists() ? snap.data().items || [] : [];
      const idx = current.findIndex((i) => i.foodId === food.id);
      let updated;
      if (idx > -1) {
        updated = [...current];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty };
      } else {
        updated = [
          ...current,
          { foodId: food.id, name: food.name, price: Number(food.price), image: food.image || null, qty },
        ];
      }
      tx.set(cartRef, { items: updated, updatedAt: serverTimestamp() });
    });
  }, [uid]);

  const updateQty = useCallback(async (foodId, qty) => {
    if (!uid) return;
    const cartRef = doc(db, "carts", uid);
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(cartRef);
      const current = snap.exists() ? snap.data().items || [] : [];
      const updated = qty <= 0
        ? current.filter((i) => i.foodId !== foodId)
        : current.map((i) => (i.foodId === foodId ? { ...i, qty } : i));
      tx.set(cartRef, { items: updated, updatedAt: serverTimestamp() });
    });
  }, [uid]);

  const removeFromCart = useCallback((foodId) => updateQty(foodId, 0), [updateQty]);

  const clearCart = useCallback(async () => {
    if (!uid) return;
    await runTransaction(db, async (tx) => {
      tx.set(doc(db, "carts", uid), { items: [], updatedAt: serverTimestamp() });
    });
  }, [uid]);

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ items, loading, addToCart, updateQty, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);