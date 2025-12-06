"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminNavbar() {
  const router = useRouter();
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("adminData");
    if (data) {
      setAdminData(JSON.parse(data));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    router.push("/admin/login");
  };

  if (!adminData) {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              href="/admin/dashboard" 
              className="text-xl font-bold hover:text-blue-200 transition-colors duration-200 flex items-center gap-2"
            >
              <span className="text-2xl">📺</span>
              <span className="hidden sm:inline">SOHEL<span className="text-pink-300">❤️</span>SWEET</span>
            </Link>
            <div className="hidden md:flex space-x-2">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
              <Link
                href="/admin/customers"
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Customers
              </Link>
              <Link
                href="/admin/payment-requests"
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Payments
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/change-password"
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-200 hidden sm:block"
            >
              🔒
            </Link>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">{adminData.name || adminData.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/90 hover:bg-red-600 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

