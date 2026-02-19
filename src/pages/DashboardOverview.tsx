import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const metrics = [
  { label: "Total Collected", value: "KSh 847K", change: "↑ 23% this month", up: true },
  { label: "Funds in Escrow", value: "KSh 124K", change: "● 3 active holds", color: "text-[#a78bfa]" },
  { label: "Disbursed", value: "KSh 692K", change: "↑ 18% this month", up: true },
  { label: "Failed Txns", value: "12", change: "↑ 3 today", up: false },
];

const transactions = [
  { id: "txn_a1b2c3", amount: "KSh 50,000", phone: "0712 ••• 678", method: "M-Pesa", status: "In Escrow", statusClass: "bg-[rgba(108,71,255,0.15)] text-[#a78bfa]", action: "View" },
  { id: "txn_d4e5f6", amount: "KSh 12,500", phone: "0733 ••• 221", method: "Airtel", status: "Disbursed", statusClass: "bg-primary/15 text-primary", action: "View" },
  { id: "txn_g7h8i9", amount: "KSh 8,000", phone: "VISA ••4521", method: "Card", status: "Disbursed", statusClass: "bg-primary/15 text-primary", action: "View" },
  { id: "txn_j1k2l3", amount: "KSh 3,200", phone: "0714 ••• 099", method: "M-Pesa", status: "Failed", statusClass: "bg-destructive/15 text-[#fb7185]", action: "Retry" },
];

const DashboardOverview = () => {
  return (
    <div>
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white/[0.04] border border-white/[0.07] rounded-[10px] p-4"
          >
            <div className="text-[10px] text-white/40 mb-1.5 font-medium">{m.label}</div>
            <div className="font-display text-xl font-extrabold text-white">{m.value}</div>
            <div className={`text-[10px] mt-1 ${m.color || (m.up ? "text-primary" : "text-[#fb7185]")}`}>
              {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* Table Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
          Recent Transactions
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-white/60 text-xs bg-white/[0.05] hover:bg-white/[0.08]">
            Filter
          </Button>
          <Button variant="ghost" size="sm" className="text-white/60 text-xs bg-white/[0.05] hover:bg-white/[0.08]">
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["ID", "Amount", "Phone", "Method", "Status", "Action"].map((h) => (
                <th key={h} className="text-left px-3 py-2 text-[10px] font-bold tracking-wider uppercase text-white/30">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="border-b border-white/[0.04]">
                <td className="px-3 py-2.5 text-white/30 font-mono text-[10px]">{txn.id}</td>
                <td className="px-3 py-2.5 text-white/70">{txn.amount}</td>
                <td className="px-3 py-2.5 text-white/70">{txn.phone}</td>
                <td className="px-3 py-2.5 text-white/70">{txn.method}</td>
                <td className="px-3 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${txn.statusClass}`}>
                    {txn.status}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`text-[11px] px-2.5 py-1 h-auto border-white/15 text-white/70 bg-transparent hover:bg-white/[0.05] ${
                      txn.action === "Retry" ? "border-[#fbbf24]/30 text-[#fbbf24] bg-[rgba(245,158,11,0.2)]" : ""
                    }`}
                  >
                    {txn.action}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardOverview;
