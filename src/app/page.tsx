// import { auth0 } from "@/lib/auth0";
// import "./globals.css";

// export default async function Home() {
//   // Fetch the user session
//   const session = await auth0.getSession();

//   // If no session, show sign-up and login buttons
//   if (!session) {
//     return (
//       <main>
//         <a href="/auth/login?screen_hint=signup">
//           <button>Sign up</button>
//         </a>
//         <a href="/auth/login">
//           <button>Log in</button>
//         </a>
//       </main>
//     );
//   }

//   // If session exists, show a welcome message and logout button
//   return (
//     <main>
//       <h1>Welcome, {session.user.name}!</h1>
//       <p>
//         <a href="/auth/logout">
//           <button>Log out</button>
//         </a>
//       </p>
//     </main>
//   );
// }

"use client";
import React, { useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

import { useQuery, gql } from "@apollo/client";

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      role
    }
  }
`;

// export default function DashboardPage() {
//   const { data, loading, error } = useQuery(ME_QUERY);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div>
//       <h1>Welcome {data.me.name || data.me.email}</h1>
//       {/* rest of your dashboard */}
//     </div>
//   );
// }

export default function Home() {
  const { data, loading, error } = useQuery(ME_QUERY);
  useEffect(() => {
    if (data?.me) {
      console.log("User info from backend:", data.me);
    }
  }, [data]);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="bg-white text-gray-900">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-lief-light via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-on-scroll">
            Smart Clock-In System for{" "}
            <span className="text-healthcare-green">Healthcare Workers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-on-scroll">
            Streamline workforce management with location-based clock-in/out,
            real-time dashboards, and comprehensive analytics. Built for
            hospitals, clinics, and healthcare organizations.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-on-scroll">
            <button className="bg-healthcare-green text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transform hover:scale-105 shadow-lg transition-all">
              <i className="fas fa-play mr-2"></i> Start Free Trial
            </button>
            <button className="border-2 border-lief-blue text-lief-blue px-8 py-4 rounded-lg text-lg font-semibold hover:bg-lief-blue hover:text-white transition-all">
              <i className="fas fa-calendar mr-2"></i> Schedule Demo
            </button>
          </div> */}
        </div>
      </section>

      {/* Example Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 animate-on-scroll">
            Complete Workforce Management Solution
          </h2>
          <p className="text-xl text-gray-600 mb-12 animate-on-scroll">
            Everything you need to manage your healthcare workforce efficiently
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-green-50 to-white p-8 rounded-2xl border border-green-100 hover:shadow-xl transition-all animate-on-scroll"
              >
                <div className="w-16 h-16 bg-healthcare-green rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-map-marker-alt text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">
                  Location-Based Security
                </h3>
                <p className="text-gray-600">
                  Ensure staff can only clock in within designated perimeters.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-green-500">
        <div className="max-w-4xl mx-auto text-center text-white px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform?</h2>
          <p className="text-xl text-blue-300 mb-8">
            Join hundreds of healthcare organizations already using Lief Care.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-lief-blue px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 shadow-lg transition-all">
              <i className="fas fa-rocket mr-2"></i> Start Free 30-Day Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-lief-blue transition-all">
              <i className="fas fa-phone mr-2"></i> Contact Sales
            </button>
          </div> */}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
