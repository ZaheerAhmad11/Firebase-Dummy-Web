"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
export default function LoginForm({ setView, onClose }) {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const user = await loginUser(email, password);
            console.log("LOGIN SUCCESS:", user);
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                if (userData.role === "admin") {
                    router.push("/dashboard");
                } else { router.push("/"); }
            }
            onClose();
        } catch (error) {
            console.error(error);
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (

        <form onSubmit={handleLogin}>
            <h2 className="text-3xl font-bold mb-6">
                Login
            </h2>
            <input
                type="email"
                placeholder="Email"
                className="w-full border p-3 rounded-lg mb-4"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                } />
            <input
                type="password"
                placeholder="Password"
                className="w-full border p-3 rounded-lg mb-4"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                } />
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 text-white py-3 rounded-lg">
                {loading ? "Loading..." : "Login"}
            </button>
            <button
                type="button"
                onClick={() => setView("signup")}
                className="w-full mt-4 border py-3 rounded-lg" >
                Create Account
            </button>
            <button
                type="button"
                onClick={() => setView("forgot")}
                className="text-sm underline mt-4" >
                Forgot Password?
            </button>
        </form>
    );
}
