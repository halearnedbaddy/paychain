import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DashboardSettings = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* API Credentials */}
      <div>
        <h3 className="text-[11px] font-bold text-white/30 tracking-[2px] uppercase mb-4">
          API Credentials
        </h3>

        {/* Sandbox Key */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-[10px] p-4 mb-3">
          <div className="text-[11px] font-semibold text-white/40 tracking-wider uppercase mb-2">
            Sandbox Key
          </div>
          <div className="flex items-center justify-between bg-black/30 rounded-md px-3 py-2.5 mb-3 font-mono text-[13px] text-white">
            <span>sk_test_kzh_a1b2c3d4e5f6g7h8</span>
            <Button variant="ghost" size="sm" className="text-white/60 text-xs bg-white/[0.05] h-auto py-1">
              Copy
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-white/60 text-xs bg-white/[0.05]">
              📋 Copy
            </Button>
            <Button variant="ghost" size="sm" className="text-[#fb7185] text-xs bg-[rgba(244,63,94,0.2)] border border-[rgba(244,63,94,0.3)]">
              ↺ Regenerate
            </Button>
          </div>
        </div>

        {/* Live Key */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-[10px] p-4">
          <div className="text-[11px] font-semibold text-white/40 tracking-wider uppercase mb-2">
            Live Key <span className="text-primary">● Active</span>
          </div>
          <div className="flex items-center justify-between bg-black/30 rounded-md px-3 py-2.5 mb-3 font-mono text-[13px]">
            <span className="text-white/20 tracking-[3px]">sk_live_kzh_••••••••••••••••</span>
            <Button size="sm" className="bg-[#6c47ff] text-white text-[10px] h-auto py-1 px-2 rounded-[5px]">
              🔓 Reveal (2FA)
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-white/60 text-xs bg-white/[0.05]">
              📋 Copy
            </Button>
            <Button variant="ghost" size="sm" className="text-[#fb7185] text-xs bg-[rgba(244,63,94,0.2)] border border-[rgba(244,63,94,0.3)]">
              ↺ Regenerate
            </Button>
          </div>
        </div>
      </div>

      {/* URLs & Configuration */}
      <div>
        <h3 className="text-[11px] font-bold text-white/30 tracking-[2px] uppercase mb-4">
          URLs &amp; Configuration
        </h3>

        <div className="space-y-4">
          <div>
            <Label className="text-[11px] font-semibold text-white/50 tracking-[0.5px] mb-1.5 block">
              Live Callback URL
            </Label>
            <Input
              defaultValue="https://kazihub.co.ke/api/payment-confirm"
              className="bg-white/[0.05] border-white/10 text-white text-xs rounded-lg"
            />
          </div>

          <div>
            <Label className="text-[11px] font-semibold text-white/50 tracking-[0.5px] mb-1.5 block">
              Webhook URL
            </Label>
            <div className="flex gap-2">
              <Input
                defaultValue="https://kazihub.co.ke/webhooks/paychain"
                className="bg-white/[0.05] border-white/10 text-white text-xs rounded-lg flex-1"
              />
              <Button size="sm" className="bg-[rgba(245,158,11,0.2)] text-[#fbbf24] border border-[rgba(245,158,11,0.3)] text-xs whitespace-nowrap">
                Test Webhook
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-[11px] font-semibold text-white/50 tracking-[0.5px] mb-1.5 block">
              Minimum Payout Amount (KSh)
            </Label>
            <Input
              defaultValue="100"
              className="bg-white/[0.05] border-white/10 text-white text-xs rounded-lg"
            />
          </div>

          <div>
            <Label className="text-[11px] font-semibold text-white/50 tracking-[0.5px] mb-1.5 block">
              Payout Account (M-Pesa)
            </Label>
            <div className="flex gap-2">
              <Input
                defaultValue="0712 ••• 678 ✓ Verified"
                className="bg-white/[0.05] border-white/10 text-white text-xs rounded-lg flex-1"
                readOnly
              />
              <Button size="sm" className="bg-primary text-primary-foreground text-xs">
                Change
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="bg-[#6c47ff] text-white text-xs">Save Settings</Button>
            <Button variant="ghost" size="sm" className="text-white/60 text-xs bg-white/[0.05]">
              + Add IP Whitelist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
