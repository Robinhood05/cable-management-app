"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserNavbar from "@/components/UserNavbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function UserDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    transactionId: "",
    month: "",
    amount: "",
    screenshotURL: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      router.push("/user/login");
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch("/api/user/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      } else if (res.status === 401) {
        router.push("/user/login");
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const res = await fetch("/api/payment-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
          village: userData.village,
          transactionId: paymentForm.transactionId,
          month: paymentForm.month,
          amount: parseFloat(paymentForm.amount),
          screenshotURL: paymentForm.screenshotURL,
        }),
      });

      if (res.ok) {
        alert("Payment request submitted successfully! Waiting for admin approval.");
        setShowPaymentForm(false);
        setPaymentForm({
          transactionId: "",
          month: "",
          amount: "",
          screenshotURL: "",
        });
      } else {
        alert("Failed to submit payment request");
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const chartData = dashboardData.last6Months?.map((item) => ({
    month: item.month,
    paid: item.status === "paid" ? dashboardData.customer.billAmount : 0,
    unpaid: item.status === "unpaid" ? dashboardData.customer.billAmount : 0,
  })) || [];

  // Get current month and next few months for dropdown
  const today = new Date();
  const monthOptions = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthOptions.push(monthStr);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome, {dashboardData.customer.name}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Due</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              ৳{dashboardData.totalDue?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Monthly Bill</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              ৳{dashboardData.customer.billAmount?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
            <button
              onClick={() => setShowPaymentForm(!showPaymentForm)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              {showPaymentForm ? "Cancel" : "Submit Payment"}
            </button>
          </div>

          {showPaymentForm && (
            <form onSubmit={handlePaymentSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month *
                </label>
                <select
                  value={paymentForm.month}
                  onChange={(e) => setPaymentForm({ ...paymentForm, month: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Month</option>
                  {monthOptions.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  bKash Transaction ID *
                </label>
                <input
                  type="text"
                  value={paymentForm.transactionId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Screenshot URL (Optional)
                </label>
                <input
                  type="url"
                  value={paymentForm.screenshotURL}
                  onChange={(e) => setPaymentForm({ ...paymentForm, screenshotURL: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="https://..."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Payment Request"}
              </button>
            </form>
          )}

          <div className="space-y-2">
            {dashboardData.allPayments?.map((payment) => (
              <div
                key={payment._id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <span className="font-medium">{payment.month}</span>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    payment.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {payment.status === "paid" ? "Paid" : "Unpaid"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6">
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
              <Bar dataKey="paid" fill="#10b981" name="Paid" />
              <Bar dataKey="unpaid" fill="#ef4444" name="Unpaid" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

