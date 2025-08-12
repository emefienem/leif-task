"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { login, logout, signup } from "@/actions/auth";
import { MenuOutlined } from "@ant-design/icons";

export default function Header() {
  const { user, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white fixed w-full z-50 top-0 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <i className="fas fa-heart-pulse text-healthcare-green text-2xl"></i>
          <span className="text-2xl font-bold">Lief Care</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/feature" className="hover:text-lief-blue">
            Features
          </Link>

          {isLoading ? null : !user ? (
            <>
              <form action={login}>
                <button className="hover:text-blue-500 cursor-pointer">
                  Log in
                </button>
              </form>
              <form action={signup}>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
                  Get Started
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
                  Dashboard
                </button>
              </Link>
              <form action={logout}>
                <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700 cursor-pointer">
                  Logout
                </button>
              </form>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            className="mobile-menu-button"
            onClick={handleToggle}
          >
            <MenuOutlined style={{ fontSize: 24 }} />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/feature"
              className="hover:text-lief-blue"
              onClick={closeMenu}
            >
              Features
            </Link>

            {isLoading ? null : !user ? (
              <>
                <form action={login}>
                  <button
                    className="hover:text-blue-500 text-left w-full"
                    onClick={closeMenu}
                  >
                    Log in
                  </button>
                </form>
                <form action={signup}>
                  <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full text-left"
                    onClick={closeMenu}
                  >
                    Get Started
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full text-left"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </button>
                </Link>
                <form action={logout}>
                  <button
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700 w-full text-left"
                    onClick={closeMenu}
                  >
                    Logout
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
