import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import logo from "@/assets/logo.jpeg";
import { Check, Loader2, X, Copy, ExternalLink } from "lucide-react";

type Screen = "enter" | "waiting" | "success" | "failed";
type PaymentMethod = "mpesa" | "airtel";

const formatKSh = (cents: number) =>
  `KSh ${(cents / 100).toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

const maskPhone = (phone: string) => {
  const clean = phone.replace(/\D/g, "");
  if (clean.length < 6) return phone;
  return clean.slice(0, 4) + " ***" + clean.slice(-3);
};

const validateKenyanPhone = (phone: string): boolean => {
  const clean = phone.replace(/[\s-]/g, "");
  return /^(\+254|254|0)(7|1)\d{8}$/.test(clean);
};

const formatPhoneForAPI = (phone: string): string => {
  let cleaned = phone.replace(/[\s-]/g, "");
  if (cleaned.startsWith("+254")) cleaned = cleaned.slice(1);
  else if (cleaned.startsWith("0")) cleaned = "254" + cleaned.slice(1);
  return cleaned;
};

export default function CheckoutPage() {
  const [params] = useSearchParams();
  const txnId = params.get("txn") || "";
  const amount = parseInt(params.get("amount") || "0", 10);
  const merchant = decodeURIComponent(params.get("merchant") || "Merchant");
  const desc = decodeURIComponent(params.get("desc") || "");
  const redirectUrl = params.get("redirect") || "";
  const cancelUrl = params.get("cancel") || "";
  const mode = params.get("mode") || "sandbox";
  const apiKey = params.get("key") || "";

  const [screen, setScreen] = useState<Screen>("enter");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [processing, setProcessing] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [providerRef, setProviderRef] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [autoRedirect, setAutoRedirect] = useState(5);

  const timersRef = useRef<number[]>([]);
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearInterval);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const isSandbox = mode === "sandbox";

  // ── Screen 2: countdown + polling ──
  const startWaiting = useCallback(() => {
    clearTimers();
    setScreen("waiting");
    setCountdown(60);
    setResendCooldown(30);

    const countdownTimer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearTimers();
          setErrorMessage("Payment request timed out. Please try again.");
          setScreen("failed");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    timersRef.current.push(countdownTimer);

    const resendTimer = window.setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(resendTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    timersRef.current.push(resendTimer);

    if (isSandbox) {
      const delay = (Math.random() * 3 + 5) * 1000; // 5-8s
      const sandboxTimer = window.setTimeout(() => {
        const success = Math.random() > 0.2;
        if (success) {
          setProviderRef(`SANDBOX_${Date.now()}`);
          clearTimers();
          setScreen("success");
        } else {
          setErrorMessage("Payment was cancelled by user.");
          clearTimers();
          setScreen("failed");
        }
      }, delay);
      timersRef.current.push(sandboxTimer as unknown as number);
    } else {
      // Poll transactions table
      const pollTimer = window.setInterval(async () => {
        const { data } = await supabase
          .from("transactions")
          .select("status, provider_ref")
          .eq("id", txnId)
          .single();
        if (data?.status === "SUCCESS") {
          setProviderRef(data.provider_ref || "");
          clearTimers();
          setScreen("success");
        } else if (data?.status === "FAILED") {
          setErrorMessage("Payment failed. Please try again.");
          clearTimers();
          setScreen("failed");
        }
      }, 3000);
      timersRef.current.push(pollTimer);
    }
  }, [isSandbox, txnId, clearTimers]);

  // ── Screen 3: auto-redirect countdown ──
  useEffect(() => {
    if (screen !== "success" || !redirectUrl) return;
    setAutoRedirect(5);
    const timer = window.setInterval(() => {
      setAutoRedirect((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = `${redirectUrl}${redirectUrl.includes("?") ? "&" : "?"}txn=${txnId}&status=success`;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [screen, redirectUrl, txnId]);

  // ── Pay handler ──
  const handlePay = async () => {
    setPhoneError("");
    if (!validateKenyanPhone(phone)) {
      setPhoneError("Enter a valid Kenyan phone number (07xx / 01xx / +254)");
      return;
    }
    setProcessing(true);

    if (isSandbox) {
      await new Promise((r) => setTimeout(r, 1200));
      setProcessing(false);
      startWaiting();
      return;
    }

    // Live: call charge function
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/charge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify({
            amount,
            phone: formatPhoneForAPI(phone),
            currency: "KES",
            description: desc,
            payment_method: paymentMethod.toUpperCase(),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Payment initiation failed.");
        setProcessing(false);
        setScreen("failed");
        return;
      }
      setProcessing(false);
      startWaiting();
    } catch {
      setErrorMessage("Network error. Please try again.");
      setProcessing(false);
      setScreen("failed");
    }
  };

  const handleResend = () => {
    setResendCooldown(30);
    startWaiting();
  };

  const handleCancel = () => {
    if (cancelUrl) {
      window.location.href = cancelUrl;
    }
  };

  const handleRetry = () => {
    clearTimers();
    setPhoneError("");
    setErrorMessage("");
    setProcessing(false);
    setScreen("enter");
  };

  return (
    <div className="min-h-screen bg-[#f0faf4]" style={{
      backgroundImage: "radial-gradient(circle, hsl(155 40% 80% / 0.4) 1px, transparent 1px)",
      backgroundSize: "20px 20px",
    }}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-[420px] rounded-2xl overflow-hidden shadow-xl bg-white">
          {/* ── HEADER ── */}
          <div className="bg-gradient-to-br from-primary to-green-dark p-6 text-white">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <img src={logo} alt="PayLoom" className="h-[32px] w-[32px] rounded-[8px] object-cover" />
                <span className="font-display font-bold text-sm">PayLoom Instants</span>
              </div>
              <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                🔒 Secure
              </span>
            </div>
            <p className="text-white/70 text-xs">{merchant}</p>
            <p className="text-3xl font-display font-bold mt-1">{formatKSh(amount)}</p>
            {desc && <p className="text-white/60 text-xs mt-1">{desc}</p>}
          </div>

          {/* ── BODY ── */}
          <div className="p-6">
            {screen === "enter" && (
              <ScreenEnter
                isSandbox={isSandbox}
                phone={phone}
                setPhone={setPhone}
                phoneError={phoneError}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                amount={amount}
                processing={processing}
                onPay={handlePay}
                onCancel={handleCancel}
                cancelUrl={cancelUrl}
              />
            )}
            {screen === "waiting" && (
              <ScreenWaiting
                phone={formatPhoneForAPI(phone)}
                paymentMethod={paymentMethod}
                countdown={countdown}
                resendCooldown={resendCooldown}
                onResend={handleResend}
              />
            )}
            {screen === "success" && (
              <ScreenSuccess
                amount={amount}
                providerRef={providerRef}
                merchant={merchant}
                redirectUrl={redirectUrl}
                autoRedirect={autoRedirect}
                txnId={txnId}
              />
            )}
            {screen === "failed" && (
              <ScreenFailed
                errorMessage={errorMessage}
                onRetry={handleRetry}
                onCancel={handleCancel}
                cancelUrl={cancelUrl}
              />
            )}
          </div>

          {/* ── FOOTER ── */}
          <div className="border-t border-border px-6 py-3 text-center">
            <p className="text-[10px] text-muted-foreground">
              🔒 Secured by PayLoom Instants · Privacy · Help
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════ Screen 1: Enter Details ═════════ */
function ScreenEnter({
  isSandbox, phone, setPhone, phoneError, paymentMethod, setPaymentMethod,
  amount, processing, onPay, onCancel, cancelUrl,
}: {
  isSandbox: boolean;
  phone: string;
  setPhone: (v: string) => void;
  phoneError: string;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (v: PaymentMethod) => void;
  amount: number;
  processing: boolean;
  onPay: () => void;
  onCancel: () => void;
  cancelUrl: string;
}) {
  return (
    <div className="space-y-5">
      {isSandbox && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800 flex items-center gap-2">
          🧪 <span className="font-semibold">Sandbox Mode</span> — No real money will be charged
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-foreground mb-1.5 block">Mobile Number</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">📱</span>
          <Input
            placeholder="0712 345 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pl-9 font-mono text-sm h-11 border-border"
            disabled={processing}
          />
        </div>
        {phoneError && <p className="text-xs text-destructive mt-1">{phoneError}</p>}
      </div>

      <div>
        <label className="text-xs font-medium text-foreground mb-1.5 block">Payment Method</label>
        <div className="grid grid-cols-2 gap-3">
          {(["mpesa", "airtel"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setPaymentMethod(m)}
              disabled={processing}
              className={`relative flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all text-left ${
                paymentMethod === m
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <span className="text-xl">{m === "mpesa" ? "📱" : "🔴"}</span>
              <span className="text-sm font-semibold text-foreground">
                {m === "mpesa" ? "M-Pesa" : "Airtel Money"}
              </span>
              {paymentMethod === m && (
                <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={onPay}
        disabled={processing}
        className="w-full h-12 bg-gradient-to-br from-primary to-green-dark text-white font-bold text-sm rounded-xl shadow-[0_4px_14px_hsl(155_100%_42%/0.25)]"
      >
        {processing ? (
          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
        ) : (
          <>Pay {formatKSh(amount)} →</>
        )}
      </Button>

      {cancelUrl && (
        <button onClick={onCancel} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
          Cancel & go back
        </button>
      )}
    </div>
  );
}

/* ═════════ Screen 2: Waiting ═════════ */
function ScreenWaiting({
  phone, paymentMethod, countdown, resendCooldown, onResend,
}: {
  phone: string;
  paymentMethod: PaymentMethod;
  countdown: number;
  resendCooldown: number;
  onResend: () => void;
}) {
  const providerName = paymentMethod === "mpesa" ? "M-Pesa" : "Airtel Money";
  const progressPercent = (countdown / 60) * 100;

  return (
    <div className="space-y-5 text-center">
      {/* Pulsing icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-3xl">📲</span>
          </div>
          <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" style={{ animationDuration: "2s" }} />
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-lg text-foreground">Check Your Phone</h3>
        <p className="text-sm text-muted-foreground mt-1">
          We've sent an STK Push request to
        </p>
        <span className="inline-block mt-2 px-3 py-1 bg-muted rounded-full font-mono text-sm text-foreground">
          {maskPhone(phone)}
        </span>
      </div>

      <div className="bg-muted rounded-xl p-4 text-left space-y-2.5">
        <div className="flex items-start gap-2.5">
          <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">1</span>
          <p className="text-xs text-muted-foreground">A prompt has appeared on your phone</p>
        </div>
        <div className="flex items-start gap-2.5">
          <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">2</span>
          <p className="text-xs text-muted-foreground">Enter your {providerName} PIN when prompted</p>
        </div>
        <div className="flex items-start gap-2.5">
          <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">3</span>
          <p className="text-xs text-muted-foreground">Wait for confirmation — do not close this page</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <Progress
          value={progressPercent}
          className={`h-2 ${countdown <= 10 ? "[&>div]:bg-destructive" : ""}`}
        />
        <p className={`text-xs mt-1.5 ${countdown <= 10 ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
          Expires in {countdown}s
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onResend}
        disabled={resendCooldown > 0}
        className="text-xs"
      >
        {resendCooldown > 0
          ? `Resend STK Push (wait ${resendCooldown}s)`
          : "Resend STK Push"}
      </Button>
    </div>
  );
}

/* ═════════ Screen 3: Success ═════════ */
function ScreenSuccess({
  amount, providerRef, merchant, redirectUrl, autoRedirect, txnId,
}: {
  amount: number;
  providerRef: string;
  merchant: string;
  redirectUrl: string;
  autoRedirect: number;
  txnId: string;
}) {
  return (
    <div className="space-y-5 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-[scaleIn_0.4s_ease-out]">
          <Check className="w-10 h-10 text-primary" />
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-lg text-foreground">Payment Successful!</h3>
        <p className="text-2xl font-display font-bold text-primary mt-2">{formatKSh(amount)}</p>
        <p className="text-sm text-muted-foreground mt-1">Your payment has been received and confirmed.</p>
      </div>

      <div className="bg-muted rounded-xl p-4 flex items-center justify-between text-xs">
        <div className="text-left">
          <p className="text-muted-foreground">Transaction Ref</p>
          <p className="font-mono font-semibold text-foreground mt-0.5">{providerRef || txnId}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground">Status</p>
          <p className="text-primary font-semibold mt-0.5 flex items-center gap-1 justify-end">
            <Check className="w-3 h-3" /> Confirmed
          </p>
        </div>
      </div>

      {redirectUrl && (
        <>
          <Button
            onClick={() => {
              window.location.href = `${redirectUrl}${redirectUrl.includes("?") ? "&" : "?"}txn=${txnId}&status=success`;
            }}
            className="w-full h-11 bg-gradient-to-br from-primary to-green-dark text-white font-bold text-sm rounded-xl"
          >
            Return to {merchant} →
          </Button>
          <p className="text-xs text-muted-foreground">
            Auto-redirecting in {autoRedirect}s...
          </p>
        </>
      )}
    </div>
  );
}

/* ═════════ Screen 4: Failed ═════════ */
function ScreenFailed({
  errorMessage, onRetry, onCancel, cancelUrl,
}: {
  errorMessage: string;
  onRetry: () => void;
  onCancel: () => void;
  cancelUrl: string;
}) {
  return (
    <div className="space-y-5 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center animate-[scaleIn_0.4s_ease-out]">
          <X className="w-10 h-10 text-destructive" />
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-lg text-foreground">Payment Failed</h3>
        <p className="text-sm text-muted-foreground mt-1">{errorMessage}</p>
      </div>

      <Button
        onClick={onRetry}
        className="w-full h-11 bg-gradient-to-br from-primary to-green-dark text-white font-bold text-sm rounded-xl"
      >
        Try Again
      </Button>

      {cancelUrl && (
        <button onClick={onCancel} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
          Cancel & go back
        </button>
      )}
    </div>
  );
}
