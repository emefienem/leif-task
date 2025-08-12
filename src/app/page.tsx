import React from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="bg-white text-gray-900">
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
        </div>
      </section>

      <section className="py-16 bg-white">
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

      <section className="py-20 bg-gradient-to-r from-blue-500 to-green-500">
        <div className="max-w-4xl mx-auto text-center text-white px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform?</h2>
          <p className="text-xl text-blue-300 mb-8">
            Join hundreds of healthcare organizations already using Lief Care.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
