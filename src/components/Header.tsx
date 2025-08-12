// import React from "react";
// import Link from "next/link";
// import { useUser } from "@auth0/nextjs-auth0/client";
// import { login, logout, signup } from "@/actions/auth";

// export default function Header() {
//   const { user } = useUser();
//   return (
//     <nav className="bg-white fixed w-full z-50 top-0 shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
//         <div className="flex items-center space-x-2">
//           <i className="fas fa-heart-pulse text-healthcare-green text-2xl"></i>
//           <span className="text-2xl font-bold">Lief Care</span>
//         </div>
//         <div className="hidden md:flex items-center space-x-8">
//           <Link href="#features" className="hover:text-lief-blue">
//             Features
//           </Link>
//           {!user ? (
//             <>
//               <form action={login}>
//                 <button className="hover:text-blue-500 cursor-pointer">
//                   Log in
//                 </button>
//               </form>
//               <form action={signup}>
//                 <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
//                   Get Started
//                 </button>
//               </form>
//             </>
//           ) : (
//             <>
//               <Link href={"/dashboard"}>
//                 <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
//                   Dashboard
//                 </button>
//               </Link>
//               <form action={logout}>
//                 <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700 cursor-pointer">
//                   {" "}
//                   Logout
//                 </button>
//               </form>
//             </>
//           )}
//         </div>
//         <div className="md:hidden">
//           <button className="mobile-menu-button">
//             <i className="fas fa-bars text-gray-700"></i>
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { login, logout, signup } from "@/actions/auth";

export default function Header() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

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
          {!user ? (
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
              <Link href={"/dashboard"}>
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
            className="mobile-menu-button"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className="fas fa-bars text-gray-700 text-xl"></i>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 flex flex-col space-y-4">
            <Link
              href="#features"
              className="hover:text-lief-blue"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            {!user ? (
              <>
                <form action={login}>
                  <button
                    className="hover:text-blue-500 text-left"
                    onClick={() => setIsOpen(false)}
                  >
                    Log in
                  </button>
                </form>
                <form action={signup}>
                  <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full text-left"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href={"/dashboard"}>
                  <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full text-left"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </button>
                </Link>
                <form action={logout}>
                  <button
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700 w-full text-left"
                    onClick={() => setIsOpen(false)}
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
