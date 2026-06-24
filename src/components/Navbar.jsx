// src/components/Navbar.jsx
'use client';
import { useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold flex items-center gap-2 whitespace-nowrap"
          >
            🍗 Crown Chicken
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <SearchBar />
          </div>

          {/* Account Button */}
          <div className="flex items-center gap-3 whitespace-nowrap">
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-1.5 bg-white text-blue-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
              Account
            </button>
          </div>

        </div>
      </nav>

      {/* Auth Modal OUTSIDE NAV (important) */}
      <AuthModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}