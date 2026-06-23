"use client";

import { useState } from "react";
import { signupUser } from "@/lib/auth";
export default function SignupForm({ setView, onClose }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await signupUser(name, email, password);
            alert("Account created");
            onClose();
        } catch (error) {
            console.error(error); alert("Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <h2 className="text-3xl font-bold mb-6">
                Create Account
            </h2>

            <input
                type="text"
                placeholder="Name"
                className="w-full border p-3 rounded-lg mb-4"
                value={name}
                onChange={(e) =>
                    setName(e.target.value)
                }
            />

            <input
                type="email"
                placeholder="Email"
                className="w-full border p-3 rounded-lg mb-4"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />

            <input
                type="password"
                placeholder="Password"
                className="w-full border p-3 rounded-lg mb-4"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 text-white py-3 rounded-lg"
            >
                {loading ? "Creating..." : "Signup"}
            </button>

            <button
                type="button"
                onClick={() =>
                    setView("login")
                }
                className="w-full mt-4 border py-3 rounded-lg"
            >
                Back To Login
            </button>

        </form>


    );
}
