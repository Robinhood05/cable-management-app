"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function CustomerDetails() {
  const [customer, setCustomer] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      
      // Fetch customer
      const customerRes = await fetch(`/api/customers/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (customerRes.ok) {
        const customerData = await customerRes.json();
        setCustomer(customerData.customer);
      }

      // Fetch analytics
      const analyticsRes = await fetch(`/api/customers/${params.id}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
        setPayments(analyticsData.allPayments || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentToggle = async (month, currentStatus) => {
    const newStatus = currentStatus === "paid" ? "unpaid" : "paid";
    
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/payments`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: params.id,
          month,
          status: newStatus,
        }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!customer || !analytics) {
    return null;
  }

  const chartData = analytics.last6Months?.map((item) => ({
    month: item.month,
    paid: item.status === "paid" ? customer.billAmount : 0,
    unpaid: item.status === "unpaid" ? customer.billAmount : 0,
  })) || [];

  // Get all months for payment timeline
  const allMonths = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const payment = payments.find((p) => p.month === monthStr);
    allMonths.push({
      month: monthStr,
      payment: payment || null,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Customers
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
          <p className="text-gray-600 mt-2">
            {customer.phone && `${customer.phone} • `}
            {customer.village}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Due</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              ৳{analytics.totalDue?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Collected</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {analytics.totalCollected || 0} months
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Monthly Bill</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              ৳{customer.billAmount?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Last 6 Months History
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="paid" fill="#10b981" />
              <Bar dataKey="unpaid" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Timeline */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Timeline
          </h3>
          <div className="space-y-2">
            {allMonths.map((item) => (
              <div
                key={item.month}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <span className="font-medium">{item.month}</span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.payment?.status === "paid"}
                      onChange={() =>
                        handlePaymentToggle(
                          item.month,
                          item.payment?.status || "unpaid"
                        )
                      }
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span
                      className={`ml-2 px-3 py-1 rounded text-sm font-medium ${
                        item.payment?.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.payment?.status === "paid" ? "Paid" : "Unpaid"}
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

