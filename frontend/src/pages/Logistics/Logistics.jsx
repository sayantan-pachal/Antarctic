import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { logisticsAPI } from "../../services/logistics";
import { Package, LayoutDashboard, ListTree } from "lucide-react";

import Skeleton from "../../components/context/Skeleton";
import LogisticsKpiGrid from "./components/LogisticsKpiGrid";
import FuelDepletionChart from "./components/FuelDepletionChart";
import FleetReadiness from "./components/FleetReadiness";
import InventoryTable from "./components/InventoryTable";
import LogisticsForecast from "./components/LogisticsForecast";
import PersonnelRoster from "./components/PersonnelRoster";

// --- HELPER: Safely clamp floating point numbers ---
const formatMetric = (val, decimals = 1) => {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return Number(val).toFixed(decimals);
};

export default function Logistics() {
  const { activeStation = "Maitri" } = useOutletContext() || {};
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // TOGGLE STATE
  const [viewMode, setViewMode] = useState("overview"); // "overview" | "inventory"

  useEffect(() => {
    let isMounted = true;
    const fetchLogistics = async () => {
      if (!data) setLoading(true);
      setError(null);
      try {
        const res = await logisticsAPI.getStationLogistics(activeStation);
        if (isMounted) setData(res.data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchLogistics();
    const intervalId = setInterval(fetchLogistics, 30000);
    
    return () => { 
      isMounted = false; 
      clearInterval(intervalId);
    };
  }, [activeStation]);

  if (loading && !data) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950 font-sans">
        <div className="mb-2 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-3.5 sm:p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-900/40">
              <Skeleton className="h-9 w-9 sm:h-12 sm:w-12 shrink-0 rounded-xl" />
              <div className="space-y-1.5 sm:space-y-2 flex-1 w-full">
                <Skeleton className="h-2.5 sm:h-3 w-16 sm:w-24" />
                <Skeleton className="h-4 sm:h-6 w-12 sm:w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex w-full p-6 text-red-500 font-sans font-semibold flex-col items-center">
        <h2 className="text-xl font-bold mb-2">Telemetry Lost</h2>
        <p>Failed to retrieve data: {error}</p>
      </div>
    );
  }

  // Safe extractions to prevent undefined errors
  const fuel = data?.fuel_reserves?.primary_tank || {};
  const emergencyFuel = data?.fuel_reserves?.emergency_reserve || {};
  const food = data?.supplies?.food || {};
  const backendLedger = data?.inventory_ledger || data?.items || [];

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      
      {/* PAGE HEADER & TOGGLE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-cyan-600 dark:text-cyan-500" />
            Logistics & Supply Chain
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {activeStation} Station · Resource tracking, shipments, and inventory
          </p>
        </div>

        {/* THE TOGGLE BUTTONS */}
        <div className="flex bg-white/70 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md w-full sm:w-auto">
          <button 
            onClick={() => setViewMode("overview")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${viewMode === "overview" ? "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </button>
          <button 
            onClick={() => setViewMode("inventory")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${viewMode === "inventory" ? "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <ListTree className="w-4 h-4" /> Ledger
          </button>
        </div>
      </div>

      {/* CONDITIONAL RENDERING */}
      {viewMode === "overview" ? (
        <div className="flex flex-col gap-4 lg:gap-6 animate-in fade-in duration-300">
          <LogisticsKpiGrid logisticsJson={data} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <FuelDepletionChart logisticsJson={data} />
            <FleetReadiness logisticsJson={data} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 flex flex-col">
              <InventoryTable logisticsJson={data} />
            </div>
            <div className="lg:col-span-1 flex flex-col">
              <LogisticsForecast logisticsJson={data} />
            </div>
          </div>

          <PersonnelRoster logisticsJson={data} />
        </div>
      ) : (
        // ---------------------------------------------------------------------
        // MODE 2: INVENTORY LEDGER (Dynamic mapping from Database + Core Items)
        // ---------------------------------------------------------------------
        <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 animate-in fade-in zoom-in-95 duration-300 overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="pb-3 px-4">Item / Category</th>
                <th className="pb-3 px-4">Current Stock</th>
                <th className="pb-3 px-4">Capacity / Max</th>
                <th className="pb-3 px-4">Burn Rate</th>
                <th className="pb-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              
              {/* Core Fuel Row */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100">
                  Primary Diesel Fuel
                  <span className="block text-[0.6rem] font-medium text-slate-500 mt-0.5">Energy / Consumable</span>
                </td>
                <td className="py-4 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {Math.round(fuel.current_level_liters || 0).toLocaleString()} L
                </td>
                <td className="py-4 px-4 font-mono text-slate-600 dark:text-slate-400">
                  {Math.round(fuel.total_capacity_liters || 50000).toLocaleString()} L
                </td>
                <td className="py-4 px-4 font-mono text-slate-600 dark:text-slate-400">
                  {formatMetric(fuel.consumption_rate_liters_per_day, 0)} L/day
                </td>
                <td className="py-4 px-4 text-right">
                  <span className={`inline-flex px-2 py-1 rounded-md text-[0.6rem] font-bold uppercase tracking-wider ${(fuel.current_level_percent || 100) > 30 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                    {(fuel.current_level_percent || 100) > 30 ? 'Adequate' : 'Low Warning'}
                  </span>
                </td>
              </tr>

              {/* Core Food Row */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100">
                  Standard Rations
                  <span className="block text-[0.6rem] font-medium text-slate-500 mt-0.5">Supplies / Food</span>
                </td>
                <td className="py-4 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                  {Math.round(food.current_stock_kg || 0).toLocaleString()} kg
                </td>
                <td className="py-4 px-4 font-mono text-slate-600 dark:text-slate-400">
                  4,000 kg
                </td>
                <td className="py-4 px-4 font-mono text-slate-600 dark:text-slate-400">
                  30 kg/day
                </td>
                <td className="py-4 px-4 text-right">
                  <span className={`inline-flex px-2 py-1 rounded-md text-[0.6rem] font-bold uppercase tracking-wider ${food.status === 'adequate' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                    {food.status || "Adequate"}
                  </span>
                </td>
              </tr>

              {/* Core Emergency Fuel Row */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100">
                  Emergency Fuel Reserve
                  <span className="block text-[0.6rem] font-medium text-slate-500 mt-0.5">Energy / Secured</span>
                </td>
                <td className="py-4 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round(emergencyFuel.current_level_liters || 0).toLocaleString()} L
                </td>
                <td className="py-4 px-4 font-mono text-slate-600 dark:text-slate-400">
                  {Math.round(emergencyFuel.total_capacity_liters || 10000).toLocaleString()} L
                </td>
                <td className="py-4 px-4 font-mono text-slate-600 dark:text-slate-400">
                  0 L/day (Locked)
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="inline-flex px-2 py-1 rounded-md text-[0.6rem] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Sealed
                  </span>
                </td>
              </tr>

              {/* DYNAMIC DATABASE ROWS (Mapped from backend inventory ledger) */}
              {backendLedger.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100">
                    {item.item_name || item.item || "Custom Item"}
                    <span className="block text-[0.6rem] font-medium text-slate-500 mt-0.5">{item.category || "General Supplies"}</span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {item.current_stock || item.qty || 0} Units
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {item.capacity_max || "N/A"}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {item.burn_rate || "Incidental"}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex px-2 py-1 rounded-md text-[0.6rem] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {item.status || "Adequate"}
                    </span>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}