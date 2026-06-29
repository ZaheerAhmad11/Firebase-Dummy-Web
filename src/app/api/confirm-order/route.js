import Stripe from "stripe";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Initialize Firebase client SDK (server-side safe — no browser APIs used)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Use a named app so it doesn't conflict with the client-side instance
const serverApp =
  getApps().find((a) => a.name === "server") ||
  initializeApp(firebaseConfig, "server");

const db = getFirestore(serverApp);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { paymentIntentId, userId, cartItems, total } = await request.json();

    if (!paymentIntentId) {
      return Response.json({ error: "Missing paymentIntentId" }, { status: 400 });
    }

    // Verify with Stripe that payment actually succeeded (never trust the client)
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return Response.json({ error: "Payment not confirmed by Stripe" }, { status: 400 });
    }

    // Save order to Firestore orders collection
    const orderRef = await addDoc(collection(db, "orders"), {
      paymentIntentId,
      userId: userId || "guest",
      items: cartItems,
      total: Number(total),
      currency: "gbp",
      status: "paid",
      createdAt: new Date().toISOString(),
    });

    return Response.json({ success: true, orderId: orderRef.id });
  } catch (err) {
    console.error("confirm-order error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
