import { useState } from "react";
import MenuManager from "./components/MenuManajer";
import Transactions from "./components/Transactions";
import FinanceManager from "./components/FinanceManajer";

export default function DashboardManager() {
  const [activeTab, setActiveTab] = useState("menu");

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white md:w-64 w-full flex md:flex-col flex-row">
        <h1 className="text-2xl font-bold p-4 border-b md:border-b-0 md:border-r text-center md:text-left">
          Dashboard
        </h1>
        <div className="flex md:flex-col flex-row w-full">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === "menu" && <MenuManager />}
        {activeTab === "finance" && <FinanceManager />}
        {activeTab === "transactions" && <Transactions />}
      </div>
    </div>
  );
}
