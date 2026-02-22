import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/useAccount";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, RefreshCw, Copy, ExternalLink, Check, QrCode, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const statusClass: Record<string, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-400",
  SUCCESS: "bg-primary/15 text-primary",
  FAILED: "bg-destructive/15 text-red-400",
  HELD: "bg-purple-500/15 text-purple-400",
  RELEASED: "bg-blue-500/15 text-blue-400",
  REFUNDED: "bg-orange-500/15 text-orange-400",
};

const formatKSh = (cents: number) =>
  `KSh ${(cents / 100).toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

export default function DashboardCollections() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<{ url: string; txnId: string; merchant: string } | null>(null);
  const [detailTxn, setDetailTxn] = useState<any>(null);
  const { data: account } = useAccount();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading, refetch } = useQuery({
    queryKey: ["transactions", account?.id, statusFilter, methodFilter],
    enabled: !!account?.id,
    queryFn: async () => {
      let q = (supabase as any)
        .from("transactions")
        .select("*")
        .eq("account_id", account!.id)
        .order("created_at", { ascending: false })
        .limit(100);
      if (statusFilter !== "ALL") q = q.eq("status", statusFilter);
      if (methodFilter !== "ALL") q = q.eq("payment_method", methodFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  // ── Realtime subscription for transaction status updates ──
  useEffect(() => {
    if (!account?.id) return;
    const channel = supabase
      .channel(`txn-status-${account.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "transactions",
          filter: `account_id=eq.${account.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["transactions", account.id] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [account?.id, queryClient]);

  const filtered = transactions.filter(
    (t: any) =>
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      (t.phone || "").includes(search) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
  );

  const copyUrl = (url: string, txnId: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(txnId);
    toast({ title: "Copied!", description: "Checkout URL copied to clipboard." });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportCSV = () => {
    const headers = ["ID", "Amount (KSh)", "Phone", "Method", "Status", "Description", "Date"];
    const rows = filtered.map((t: any) => [
      t.id,
      (t.amount / 100).toFixed(2),
      t.phone,
      t.payment_method,
      t.status,
      t.description,
      new Date(t.created_at).toLocaleString("en-KE"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paychain-collections-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display font-bold text-white text-lg">Collections</h2>
          <p className="text-white/40 text-xs mt-0.5">{filtered.length} transactions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="text-white/60 text-xs bg-white/[0.05]"
          >
            <RefreshCw className="w-3 h-3 mr-1.5" /> Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={exportCSV}
            className="text-white/60 text-xs bg-white/[0.05]"
          >
            <Download className="w-3 h-3 mr-1.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <Input
            placeholder="Search ID, phone, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 bg-white/[0.05] border-white/10 text-white text-xs rounded-lg h-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 bg-white/[0.05] border-white/10 text-white/70 text-xs h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#0d0d1a] border-white/10 text-white">
            {["ALL", "PENDING", "SUCCESS", "FAILED", "HELD", "RELEASED", "REFUNDED"].map((s) => (
              <SelectItem key={s} value={s} className="text-xs text-white/70 focus:bg-white/[0.08] focus:text-white">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-32 bg-white/[0.05] border-white/10 text-white/70 text-xs h-9">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent className="bg-[#0d0d1a] border-white/10 text-white">
            {["ALL", "MPESA", "AIRTEL", "CARD"].map((m) => (
              <SelectItem key={m} value={m} className="text-xs text-white/70 focus:bg-white/[0.08] focus:text-white">
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[10px] border border-white/[0.06]">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              {["ID", "Amount", "Phone", "Method", "Status", "Description", "Date", "Checkout", "Action"].map((h) => (
                <th key={h} className="text-left px-3 py-2.5 text-[10px] font-bold tracking-wider uppercase text-white/30">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-white/30 text-xs">
                  Loading transactions...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-16 text-white/30 text-xs">
                  <div className="text-2xl mb-2">📭</div>
                  <div>No transactions yet.</div>
                  <div className="text-white/20 mt-1">Transactions will appear here once you start collecting payments via the API.</div>
                </td>
              </tr>
            ) : (
              filtered.map((txn: any) => (
                <tr key={txn.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-3 py-2.5 text-white/30 font-mono text-[10px]">{txn.id}</td>
                  <td className="px-3 py-2.5 text-white/80 font-semibold">{formatKSh(txn.amount)}</td>
                  <td className="px-3 py-2.5 text-white/60">{txn.phone || "—"}</td>
                  <td className="px-3 py-2.5 text-white/60">{txn.payment_method}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                      statusClass[txn.status] ?? "bg-white/10 text-white/50"
                    } ${txn.status === "PENDING" ? "animate-pulse" : ""}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-white/50 max-w-[160px] truncate">{txn.description || "—"}</td>
                  <td className="px-3 py-2.5 text-white/40 text-[10px] whitespace-nowrap">
                    {new Date(txn.created_at).toLocaleDateString("en-KE")}
                  </td>
                  <td className="px-3 py-2.5">
                    {txn.checkout_url ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyUrl(txn.checkout_url, txn.id)}
                          className="p-1 rounded hover:bg-white/[0.08] text-white/40 hover:text-white/70 transition-colors"
                          title="Copy checkout URL"
                        >
                          {copiedId === txn.id ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => setQrModal({ url: txn.checkout_url, txnId: txn.id, merchant: txn.merchant_name || "Checkout" })}
                          className="p-1 rounded hover:bg-white/[0.08] text-white/40 hover:text-white/70 transition-colors"
                          title="Show QR code"
                        >
                          <QrCode className="w-3 h-3" />
                        </button>
                        <a
                          href={txn.checkout_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded hover:bg-white/[0.08] text-white/40 hover:text-white/70 transition-colors"
                          title="Open checkout"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDetailTxn(txn)}
                      className="text-[10px] px-2 py-1 h-auto border-white/15 text-white/60 bg-transparent hover:bg-white/[0.05]"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* QR Code Modal */}
      <Dialog open={!!qrModal} onOpenChange={(open) => !open && setQrModal(null)}>
        <DialogContent className="bg-[#0d0d1a] border-white/10 text-white max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-white">Checkout QR Code</DialogTitle>
          </DialogHeader>
          {qrModal && (
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="bg-white rounded-xl p-4">
                <QRCodeSVG
                  value={qrModal.url}
                  size={200}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-white/50 text-[10px] text-center font-mono break-all px-2">
                {qrModal.txnId}
              </p>
              <div className="flex gap-2 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-xs text-white/60 bg-white/[0.05]"
                  onClick={() => {
                    navigator.clipboard.writeText(qrModal.url);
                    toast({ title: "Copied!", description: "Checkout URL copied." });
                  }}
                >
                  <Copy className="w-3 h-3 mr-1.5" /> Copy Link
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-xs text-white/60 bg-white/[0.05]"
                  onClick={() => {
                    const svg = document.querySelector(".qr-download-target svg");
                    if (!svg) return;
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const canvas = document.createElement("canvas");
                    canvas.width = 400;
                    canvas.height = 400;
                    const ctx = canvas.getContext("2d")!;
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, 400, 400);
                    const img = new Image();
                    img.onload = () => {
                      ctx.drawImage(img, 50, 50, 300, 300);
                      const a = document.createElement("a");
                      a.download = `qr-${qrModal.txnId}.png`;
                      a.href = canvas.toDataURL("image/png");
                      a.click();
                    };
                    img.src = "data:image/svg+xml;base64," + btoa(svgData);
                  }}
                >
                  <Download className="w-3 h-3 mr-1.5" /> Save PNG
                </Button>
              </div>
              {/* Hidden SVG for download */}
              <div className="qr-download-target hidden">
                <QRCodeSVG value={qrModal.url} size={300} level="M" />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Transaction Detail Modal */}
      <Dialog open={!!detailTxn} onOpenChange={(open) => !open && setDetailTxn(null)}>
        <DialogContent className="bg-[#0d0d1a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-white">Transaction Details</DialogTitle>
          </DialogHeader>
          {detailTxn && (
            <div className="space-y-4 py-1">
              {/* Status badge */}
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusClass[detailTxn.status] ?? "bg-white/10 text-white/50"}`}>
                  {detailTxn.status}
                </span>
                <span className="font-display text-lg font-extrabold text-white">{formatKSh(detailTxn.amount)}</span>
              </div>

              {/* Detail rows */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                {[
                  ["Transaction ID", detailTxn.id],
                  ["Phone", detailTxn.phone || "—"],
                  ["Payment Method", detailTxn.payment_method || "—"],
                  ["Currency", detailTxn.currency || "KES"],
                  ["Description", detailTxn.description || "—"],
                  ["Merchant", detailTxn.merchant_name || "—"],
                  ["Fee", detailTxn.fee_amount != null ? formatKSh(detailTxn.fee_amount) : "—"],
                  ["Fee %", detailTxn.fee_percentage != null ? `${detailTxn.fee_percentage}%` : "—"],
                  ["Provider Ref", detailTxn.provider_ref || "—"],
                  ["External Ref", detailTxn.external_ref || "—"],
                  ["Created", new Date(detailTxn.created_at).toLocaleString("en-KE")],
                  ["Completed", detailTxn.completed_at ? new Date(detailTxn.completed_at).toLocaleString("en-KE") : "—"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">{label}</div>
                    <div className="text-white/70 font-mono text-[11px] break-all">{value}</div>
                  </div>
                ))}
              </div>

              {/* Metadata */}
              {detailTxn.metadata && Object.keys(detailTxn.metadata).length > 0 && (
                <div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Metadata</div>
                  <pre className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-2.5 text-[10px] text-white/60 overflow-x-auto font-mono">
                    {JSON.stringify(detailTxn.metadata, null, 2)}
                  </pre>
                </div>
              )}

              {/* Checkout URL */}
              {detailTxn.checkout_url && (
                <div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Checkout URL</div>
                  <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-lg p-2">
                    <span className="text-[10px] text-white/50 font-mono truncate flex-1">{detailTxn.checkout_url}</span>
                    <button
                      onClick={() => copyUrl(detailTxn.checkout_url, detailTxn.id)}
                      className="p-1 rounded hover:bg-white/[0.08] text-white/40 hover:text-white/70 shrink-0"
                    >
                      {copiedId === detailTxn.id ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <a href={detailTxn.checkout_url} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-white/[0.08] text-white/40 hover:text-white/70 shrink-0">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
