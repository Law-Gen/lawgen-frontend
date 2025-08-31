"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { api } from "@/src/lib/api";

export default function VerifyEmailPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const emailParam = sp.get("email") || "";
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<null | {
    type: "success" | "error";
    msg: string;
  }>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const canResend = resendCooldown === 0;

  useEffect(() => {
    setEmail(emailParam);
  }, [emailParam]);

  useEffect(() => {
    let t: any;
    if (resendCooldown > 0) {
      t = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    }
    return () => t && clearInterval(t);
  }, [resendCooldown]);

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    try {
      await api.post("/auth/verify-email", { email, otp_code: otp });
      setStatus({
        type: "success",
        msg: "Email verified 🎉 You can sign in now.",
      });
      setTimeout(() => router.push("/auth/signin"), 800);
    } catch (err: any) {
      setStatus({ type: "error", msg: err.message || "Verification failed" });
    }
  }

  async function onResend() {
    try {
      await api.post("/auth/send-email-otp", { email });
      setStatus({ type: "success", msg: "OTP sent again. Check your inbox." });
      setResendCooldown(60);
    } catch (err: any) {
      setStatus({ type: "error", msg: err.message || "Could not resend OTP" });
    }
  }

  return (
    <div className="min-h-[80vh] grid place-items-center p-4">
      <MotionWrapper animation="fadeInUp" delay={200}>
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Verify your email</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter the 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              {status && (
                <p
                  className={
                    status.type === "success"
                      ? "text-green-600 text-sm"
                      : "text-red-600 text-sm"
                  }
                >
                  {status.msg}
                </p>
              )}

              <div className="flex items-center justify-between gap-2">
                <Button type="submit" className="w-full">
                  Verify Email
                </Button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={onResend}
                  disabled={!canResend}
                  className="text-primary disabled:opacity-60"
                >
                  {canResend ? "Resend OTP" : `Resend in ${resendCooldown}s`}
                </button>
                <Link
                  href="/auth/signin"
                  className="text-primary hover:underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  );
}
