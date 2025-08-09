import React from "react";
import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import { login, logout, signup } from "@/actions/auth";

export default async function Header() {
  const session = await auth0.getSession();
  return (
    <nav className="bg-white fixed w-full z-50 top-0 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="fas fa-heart-pulse text-healthcare-green text-2xl"></i>
          <span className="text-2xl font-bold">Lief Care</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="hover:text-lief-blue">
            Features
          </Link>
          {/* Auth buttons */}
          {/* <AuthButtons /> */}
          {!session ? (
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
            <form action={logout}>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
                {" "}
                Logout
              </button>
            </form>
          )}
        </div>
        <div className="md:hidden">
          <button className="mobile-menu-button">
            <i className="fas fa-bars text-gray-700"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}

// This is a CLIENT component
const AuthButtons = () => {
  return (
    <>
      <a href="/auth/login" className="hover:text-lief-blue cursor-pointer">
        <button>Log in</button>
      </a>
      <a
        href="/auth/login?screen_hint=signup"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
      >
        <button>Get Started</button>
      </a>
    </>
  );
};
