"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { api } from "@/src/lib/api";

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  const router = useRouter();
  const sp = useParams();
  const token = sp.token || "";
  // Optionally get access token from localStorage for Bearer auth
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<null | {
    type: "success" | "error";
    msg: string;
  }>(null);

  async function onReset(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setStatus({ type: "error", msg: "Invalid or missing reset token." });
      return;
    }
    if (password.length < 8) {
      setStatus({
        type: "error",
        msg: "Password must be at least 8 characters long.",
      });
      return;
    }
    if (password !== confirm) {
      setStatus({ type: "error", msg: "Passwords do not match" });
      return;
    }
    setStatus(null);
    try {
      // Send both password_reset_token and reset_token for backend compatibility
      const res = await api.post("/auth/reset-password", {
        password_reset_token: token,
        reset_token: token,
        new_password: password,
      });
      setStatus({ type: "success", msg: "Password reset. Please sign in." });
      setTimeout(() => router.push("/auth/signin"), 800);
    } catch (err: any) {
      setStatus({ type: "error", msg: err.message || "Reset failed" });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4 pt-32">
      <MotionWrapper animation="fadeInUp" delay={200}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <MotionWrapper animation="fadeInUp">
              <Link href="/" className="inline-block">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform overflow-hidden border border-muted shadow bg-background">
                  <img
                    src="/logo (1).svg"
                    alt="LawGen Logo"
                    width={56}
                    height={56}
                    className="h-14 w-14 object-cover rounded-full"
                  />
                </div>
              </Link>
            </MotionWrapper>
            <MotionWrapper animation="fadeInUp" delay={100}>
              <CardTitle className="text-2xl text-primary">
                Set a new password
              </CardTitle>
            </MotionWrapper>
            <MotionWrapper animation="fadeInUp" delay={200}>
              <p className="text-muted-foreground">
                Enter and confirm your new password
              </p>
            </MotionWrapper>
          </CardHeader>
          <CardContent>
            <form onSubmit={onReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pw">New Password</Label>
                <Input
                  id="pw"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpw">Confirm Password</Label>
                <Input
                  id="cpw"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
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
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
              <div className="text-center text-sm">
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
