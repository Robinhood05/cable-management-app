"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminNavbar() {
  const router = useRouter();
  const [adminData, setAdminData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/customers", label: "Customers", icon: "👥" },
    { href: "/admin/payment-requests", label: "Payments", icon: "💰" },
    { href: "/admin/change-password", label: "Settings", icon: "⚙️" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="w-full px-3 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link 
            href="/admin/dashboard" 
            className="text-lg sm:text-xl font-bold hover:text-blue-200 transition-colors duration-200 flex items-center gap-2 min-h-[44px] flex items-center"
          >
            <span className="text-2xl">📺</span>
            <span className="hidden sm:inline text-base sm:text-lg">SOHEL<span className="text-pink-300">❤️</span>SWEET</span>
            <span className="sm:hidden text-sm">SOHEL</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm min-h-[44px] flex items-center whitespace-nowrap"
              >
                <span className="text-lg">{link.icon}</span>
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Admin Info - Hidden on Mobile */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm min-h-[44px]">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium truncate">{adminData.name || adminData.email}</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 bg-red-500/90 hover:bg-red-600 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-1 sm:gap-2 min-h-[44px] active:scale-95"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 py-3 space-y-2 pb-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-200 flex items-center gap-3 active:bg-white/30 min-h-[44px]"
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="px-4 py-3 rounded-lg bg-white/10 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium truncate">{adminData.name || adminData.email}</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

