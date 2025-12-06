"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import AdminNavbar from "@/components/AdminNavbar";
import { HiPencilAlt, HiTrash, HiEye, HiChevronDown, HiChevronRight } from "react-icons/hi";

const fetcher = async (url) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    throw new Error("No token");
  }
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  return res.json();
};

export default function CustomersPage() {
  const [expandedVillages, setExpandedVillages] = useState({});
  const router = useRouter();

  const { data, error, isLoading, mutate } = useSWR(
    "/api/customers",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    if (error && error.message === "Unauthorized") {
      router.push("/admin/login");
    }
  }, [error, router]);

  const customers = data?.customers || [];
  const loading = isLoading;

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        mutate(); // Revalidate SWR cache
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // Group customers by village (already sorted by due amount from API)
  const groupByVillage = (customers) => {
    const grouped = {};
    customers.forEach((customer) => {
      const village = customer.village || "Unknown";
      if (!grouped[village]) {
        grouped[village] = [];
      }
      grouped[village].push(customer);
    });
    // Sort customers within each village by totalDue (descending)
    Object.keys(grouped).forEach((village) => {
      grouped[village].sort((a, b) => (b.totalDue || 0) - (a.totalDue || 0));
    });
    return grouped;
  };

  const toggleVillage = (village) => {
    setExpandedVillages((prev) => ({
      ...prev,
      [village]: !prev[village],
    }));
  };

  const groupedCustomers = groupByVillage(customers);
  const villages = Object.keys(groupedCustomers).sort();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8 fade-in">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-blue-600">👥</span>
              Customers
            </h1>
            <p className="text-gray-600">Manage all your customers by village</p>
          </div>
          <Link
            href="/admin/customers/add"
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Customer
          </Link>
        </div>

        <div className="card overflow-hidden">
          {villages.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No customers yet</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first customer</p>
              <Link
                href="/admin/customers/add"
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add First Customer
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {villages.map((village) => {
                const villageCustomers = groupedCustomers[village];
                const isExpanded = expandedVillages[village];
                const customerCount = villageCustomers.length;

                return (
                  <div key={village} className="border-b border-gray-200">
                    {/* Village Header */}
                    <div
                      onClick={() => toggleVillage(village)}
                      className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 cursor-pointer flex items-center justify-between transition-all duration-300 border-l-4 border-blue-500 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {isExpanded ? (
                            <HiChevronDown className="text-blue-600" size={20} />
                          ) : (
                            <HiChevronRight className="text-blue-600" size={20} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <span>📍</span>
                            {village}
                          </h3>
                          <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                            {customerCount} {customerCount === 1 ? "customer" : "customers"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Customers List - Shown when expanded */}
                    {isExpanded && (
                      <div className="bg-white rounded-b-xl overflow-hidden slide-in">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                              <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                  Phone
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                  Bill Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                  Total Due
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                              {villageCustomers.map((customer, index) => (
                                <tr 
                                  key={customer._id} 
                                  className="hover:bg-blue-50/50 transition-colors duration-200 fade-in"
                                  style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                        {customer.name.charAt(0).toUpperCase()}
                                      </div>
                                      <span className="text-sm font-semibold text-gray-900">
                                        {customer.name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {customer.phone || <span className="text-gray-400">-</span>}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                                    ৳{customer.billAmount || 0}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                                      (customer.totalDue || 0) > 0 
                                        ? 'bg-red-100 text-red-700' 
                                        : 'bg-green-100 text-green-700'
                                    }`}>
                                      ৳{(customer.totalDue || 0).toLocaleString()}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-3">
                                      <Link
                                        href={`/admin/customers/${customer._id}`}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                        title="View Details"
                                      >
                                        <HiEye size={18} />
                                      </Link>
                                      <Link
                                        href={`/admin/customers/${customer._id}/edit`}
                                        className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                                        title="Edit"
                                      >
                                        <HiPencilAlt size={18} />
                                      </Link>
                                      <button
                                        onClick={() => handleDelete(customer._id)}
                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                        title="Delete"
                                      >
                                        <HiTrash size={18} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

