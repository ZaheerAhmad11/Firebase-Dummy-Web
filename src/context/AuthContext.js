// src/context/AuthContext.js
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";

// existing onAuthStateChanged listener ke andar:
useEffect(() => {
  const unsub = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      setUser(firebaseUser);
    } else {
      // koi user nahi -> guest ko anonymous uid de do (cart ke liye)
      signInAnonymously(auth).catch((err) =>
        console.error("Anonymous auth failed:", err)
      );
    }
    setAuthLoading(false);
  });
  return () => unsub();
}, []);