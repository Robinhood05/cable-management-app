"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserNavbar() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    router.push("/user/login");
  };

  if (!userData) {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="w-full px-3 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link 
            href="/user/dashboard" 
            className="text-lg sm:text-xl font-bold hover:text-green-200 transition-colors duration-200 flex items-center gap-2 min-h-[44px] flex items-center"
          >
            <span className="text-2xl">👤</span>
            <span className="hidden sm:inline text-base sm:text-lg">My Account</span>
            <span className="sm:hidden text-sm">Account</span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm min-h-[44px]">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium truncate">👋 {userData.name}</span>
            </div>

            {/* Mobile User Name */}
            <div className="sm:hidden flex items-center gap-2 text-xs truncate">
              <span className="truncate">{userData.name?.split(" ")[0]}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 bg-red-500/90 hover:bg-red-600 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-1 sm:gap-2 min-h-[44px] active:scale-95 whitespace-nowrap"
            >
              <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline text-sm">Logout</span>
              <span className="sm:hidden text-xs">Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

