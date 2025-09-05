"use client";

import type React from "react";

import { useState } from "react";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { api } from "@/src/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const [status, setStatus] = useState<null | {
    type: "success" | "error";
    msg: string;
  }>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setStatus({
        type: "success",
        msg: res.message || "OTP sent to your email.",
      });
      setTimeout(() => {
        router.push(`/auth/verify-reset?email=${encodeURIComponent(email)}`);
      }, 1200);
    } catch (err: any) {
      setStatus({ type: "error", msg: err.message || "Failed to send OTP." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4">
      <MotionWrapper animation="scaleIn">
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
                Reset Password
              </CardTitle>
            </MotionWrapper>
            <MotionWrapper animation="fadeInUp" delay={200}>
              <p className="text-muted-foreground">
                Enter your email to receive a reset link
              </p>
            </MotionWrapper>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <MotionWrapper animation="fadeInUp" delay={300}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-200 focus:scale-[1.02]"
                  />
                </div>
              </MotionWrapper>

              <MotionWrapper animation="fadeInUp" delay={400}>
                {status && (
                  <div
                    className={`text-center text-sm mb-2 ${
                      status.type === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {status.msg}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full hover:scale-105 transition-transform"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              </MotionWrapper>

              <MotionWrapper animation="fadeInUp" delay={500}>
                <div className="text-center">
                  <Link
                    href="/auth/signin"
                    className="text-sm text-primary hover:underline transition-colors"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </MotionWrapper>
            </form>
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  );
}

// After submit, navigate to verify-reset?email=...
