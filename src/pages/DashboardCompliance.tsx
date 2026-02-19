import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const steps = [
  { label: "Business Info", done: true },
  { label: "Contact Details", active: true },
  { label: "KYC Documents", todo: true },
  { label: "Agreement", todo: true },
  { label: "Submit", todo: true },
];

const DashboardCompliance = () => {
  return (
    <div>
      {/* Warning Banner */}
      <div className="bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] rounded-[10px] px-4 py-3 mb-5 flex items-center justify-between">
        <span className="text-xs text-[#fbbf24]">
          ⚠️ Complete compliance to unlock LIVE mode and start accepting real payments.
        </span>
        <Button size="sm" className="bg-[rgba(245,158,11,0.2)] text-[#fbbf24] border border-[rgba(245,158,11,0.3)] text-xs">
          Go Live →
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-0 mb-6">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="text-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  step.done
                    ? "bg-primary text-primary-foreground"
                    : step.active
                    ? "bg-[#6c47ff] text-white"
                    : "bg-white/10 text-white/30"
                }`}
              >
                {step.done ? "✓" : i + 1}
              </div>
              <div className="text-[9px] text-white/30 mt-1 whitespace-nowrap">{step.label}</div>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${step.done ? "bg-primary" : "bg-white/[0.08]"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px] font-semibold text-white/50 mb-1.5 block">Director Full Name</Label>
              <Input defaultValue="James Mwangi" className="bg-white/[0.05] border-white/10 text-white text-xs rounded-lg" />
            </div>
            <div>
              <Label className="text-[11px] font-semibold text-white/50 mb-1.5 block">Phone Number</Label>
              <Input defaultValue="+254 712 345 678" className="bg-white/[0.05] border-white/10 text-white text-xs rounded-lg" />
            </div>
          </div>
          <div>
            <Label className="text-[11px] font-semibold text-white/50 mb-1.5 block">Physical Address</Label>
            <Input defaultValue="Westlands, Nairobi, Kenya" className="bg-white/[0.05] border-white/10 text-white text-xs rounded-lg" />
          </div>
          <div>
            <Label className="text-[11px] font-semibold text-white/50 mb-1.5 block">KRA PIN</Label>
            <Input defaultValue="A012345678B" className="bg-white/[0.05] border-white/10 text-white text-xs rounded-lg" />
          </div>
          <div>
            <Label className="text-[11px] font-semibold text-white/50 mb-1.5 block">Expected Monthly Volume</Label>
            <Input defaultValue="KSh 500K – 1M" className="bg-white/[0.05] border-white/10 text-white text-xs rounded-lg" />
          </div>
        </div>

        <div className="space-y-3">
          {/* Upload Zones */}
          <div className="border-2 border-dashed border-white/10 rounded-[10px] p-5 text-center text-white/30 text-xs">
            <div className="text-2xl mb-2">🪪</div>
            <div className="font-semibold text-white/50 mb-1">National ID / Passport</div>
            <div>Drag and drop or click to upload (JPG, PNG, PDF — Max 5MB)</div>
            <Button variant="outline" size="sm" className="mt-2.5 text-[11px] border-white/15 text-white/70 bg-transparent">
              Choose File
            </Button>
          </div>
          <div className="border-2 border-dashed border-white/10 rounded-[10px] p-5 text-center text-white/30 text-xs">
            <div className="text-2xl mb-2">📑</div>
            <div className="font-semibold text-white/50 mb-1">Business Registration Certificate</div>
            <div>Certificate of Incorporation or Business Name</div>
            <Button variant="outline" size="sm" className="mt-2.5 text-[11px] border-white/15 text-white/70 bg-transparent">
              Choose File
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-2.5 mt-5">
        <Button className="bg-[#6c47ff] text-white text-xs">Save & Continue →</Button>
        <Button variant="ghost" size="sm" className="text-white/60 text-xs bg-white/[0.05]">Save Draft</Button>
      </div>
    </div>
  );
};

export default DashboardCompliance;
