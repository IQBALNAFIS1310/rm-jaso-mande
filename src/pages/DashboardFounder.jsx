// src/pages/DashboardFounder.jsx
import { useState } from "react";
import MenuManager from "./components/MenusManajer";
import FinanceManager from "./components/FinanceManajer";
import TransactionsManager from "./components/Transactions";
import AccountsManager from "./components/AccountsManager";
import MenuStocksManager from "./components/MenuStokManajer";
import ReviewsManager from "./components/ReviewsManajer";
import Overview from "./components/Overview";
import Reporting from "./components/Reporting";
import ActivityLog from "./components/ActivityLog";

export default function DashboardFounder() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "menu", label: "Menu" },
    { key: "finance", label: "Keuangan" },
    { key: "transactions", label: "Transaksi" },
    { key: "accounts", label: "Akun" },
    { key: "stocks", label: "Stok Menu" },
    { key: "reviews", label: "Review" },
    { key: "logs", label: "Activity Logs" },
    { key: "reporting", label: "Reporting" },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white md:w-64 w-full flex md:flex-col md:h-screen">
        {/* Judul */}
        <h1 className="text-xl md:text-2xl font-bold p-4 border-b md:border-b-0 md:border-r text-center md:text-left">
          Admin
        </h1>

        {/* Tab Navigasi */}
        <div className="flex md:flex-col flex-row md:overflow-y-auto overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`p-3 md:p-4 flex-1 md:flex-none whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-gray-700 border-b-2 md:border-b-0 md:border-l-4 border-yellow-400"
                  : "hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50">
        {activeTab === "overview" && <Overview />}
        {activeTab === "menu" && <MenuManager />}
        {activeTab === "finance" && <FinanceManager />}
        {activeTab === "transactions" && <TransactionsManager />}
        {activeTab === "accounts" && <AccountsManager />}
        {activeTab === "stocks" && <MenuStocksManager />}
        {activeTab === "reviews" && <ReviewsManager />}
        {activeTab === "logs" && <ActivityLog />}
        {activeTab === "reporting" && <Reporting />}
      </div>
    </div>
  );
}
