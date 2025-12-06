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
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/user/dashboard" className="text-xl font-bold">
              My Account
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {userData.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

