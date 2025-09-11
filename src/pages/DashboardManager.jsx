import { useState } from "react";
import MenuManager from "./components/MenusManajer";
import Transactions from "./components/Transactions";
import FinanceManager from "./components/FinanceManajer";
import ReviewsManager from "./components/ReviewsManajer";
import MenuStocksManager from "./components/MenuStokManajer";
import AccountsManager from "./components/AccountsManager";

export default function DashboardManager() {
  const [activeTab, setActiveTab] = useState("menu");

  const tabs = [
    { key: "menu", label: "Menu" },
    { key: "finance", label: "Keuangan" },
    { key: "transactions", label: "Transaksi" },
    { key: "menuStock", label: "Stok Menu" },
    { key: "reviews", label: "Review" },
    { key: "accounts", label: "Akun" },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white md:w-64 w-full flex md:flex-col flex-row">
        <h1 className="text-2xl font-bold p-4 border-b md:border-b-0 md:border-r text-center md:text-left">
          Dashboard
        </h1>
        <div className="flex md:flex-col flex-row w-full">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`p-4 hover:bg-gray-700 flex-1 text-center md:text-left ${
                activeTab === tab.key ? "bg-gray-700" : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === "menu" && <MenuManager />}
        {activeTab === "finance" && <FinanceManager />}
        {activeTab === "transactions" && <Transactions />}
        {activeTab === "menuStock" && <MenuStocksManager />}
        {activeTab === "reviews" && <ReviewsManager />}
        {activeTab === "accounts" && <AccountsManager />}
      </div>
    </div>
  );
}
