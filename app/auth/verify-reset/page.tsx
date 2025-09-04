"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { api } from "@/src/lib/api";

export default function VerifyResetOTPPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const emailParam = sp.get("email") || "";
  const email = emailParam;
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<null | {
    type: "success" | "error";
    msg: string;
  }>(null);

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    // Dummy OTP check: accept 123456 as valid
    if (otp === "123456") {
      // Simulate a reset token
      const token = "dummy-reset-token";
      router.push(`/auth/reset-password?token=${encodeURIComponent(token)}`);
    } else {
      setStatus({ type: "error", msg: "Invalid or expired code (try 123456)" });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4 pt-32">
      <MotionWrapper animation="fadeInUp" delay={200}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <MotionWrapper animation="fadeInUp">
              <Link href="/" className="inline-block">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform">
                  <span className="text-2xl text-primary-foreground">⚖️</span>
                </div>
              </Link>
            </MotionWrapper>
            <MotionWrapper animation="fadeInUp" delay={100}>
              <CardTitle className="text-2xl text-primary">
                Verify OTP
              </CardTitle>
            </MotionWrapper>
            <MotionWrapper animation="fadeInUp" delay={200}>
              <p className="text-muted-foreground">
                Enter the 6-digit code sent to your email
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Dummy OTP:{" "}
                <span className="font-mono font-bold text-primary">123456</span>
              </p>
            </MotionWrapper>
          </CardHeader>
          <CardContent>
            <form onSubmit={onVerify} className="space-y-4">
              <div className="space-y-2">
                <Label>OTP Code</Label>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  containerClassName="justify-center"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="text-center text-lg font-mono"
                  autoFocus
                  required
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTP>
                <div className="text-xs text-muted-foreground text-center mt-2">
                  Enter the 6-digit code sent to your email.
                </div>
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
              <Button type="submit" className="w-full">
                Continue
              </Button>
              <div className="text-center text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="text-primary hover:underline"
                >
                  Back
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  );
}
