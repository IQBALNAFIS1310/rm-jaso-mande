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

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white md:w-64 w-full flex md:flex-col flex-row">
        <h1 className="text-2xl font-bold p-4 border-b md:border-b-0 md:border-r text-center md:text-left">
          Founder Dashboard
        </h1>
        <div className="flex md:flex-col flex-row w-full">
          <button
            onClick={() => setActiveTab("overview")}
            className="p-4 hover:bg-gray-700 flex-1 text-center md:text-left"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className="p-4 hover:bg-gray-700 flex-1 text-center md:text-left"
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab("finance")}
            className="p-4 hover:bg-gray-700 flex-1 text-center md:text-left"
          >
            Keuangan
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className="p-4 hover:bg-gray-700 flex-1 text-center md:text-left"
          >
            Transaksi
          </button>
          <button
            onClick={() => setActiveTab("accounts")}
            className="p-4 hover:bg-gray-700 flex-1 text-center md:text-left"
          >
            Akun
          </button>
          <button
            onClick={() => setActiveTab("stocks")}
            className="p-4 hover:bg-gray-700 flex-1 text-center md:text-left"
          >
            Stok Menu
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className="p-4 hover:bg-gray-700 flex-1 text-center md:text-left"
          >
            Review
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className="p-4 hover:bg-gray-700 flex-1 text-center md:text-left"
          >
            Activity Logs
          </button>
          <button
            onClick={() => setActiveTab("reporting")}
            className="p-4 hover:bg-gray-700 flex-1 text-center md:text-left"
          >
            Reporting
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === "overview" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Overview</h1>
            <p>Ringkasan KPI, penjualan harian, laba/rugi, dsb...</p>
          </div>
        )}
        {activeTab==="overview"&& <Overview/>}
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
