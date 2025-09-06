"use client";

import type React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import dynamic from "next/dynamic";
const GoogleSignIn = dynamic(() => import("@/components/auth/GoogleSignIn"), {
  ssr: false,
});

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // No NextAuth session logic needed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    // Use NextAuth signIn with credentials provider
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      setError(
        result.error === "CredentialsSignin"
          ? "Invalid email or password"
          : result.error
      );
      setIsLoading(false);
      return;
    }
    // Fetch session to get user role and access token
    const res = await fetch("/api/auth/session");
    const session = await res.json();
    console.log("session", session);

    const role = session?.user?.role;
    const accessToken = session?.accessToken;
    const userId = session?.user?.id;
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }
    if (userId) {
      localStorage.setItem("user_id", userId);
    }
    if (role === "admin") {
      router.push("/admin");
    } else if (role === "user" || role === "enterprise_user") {
      router.push("/chat");
    } else {
      router.push("/");
    }
    setIsLoading(false);
  };

  // No NextAuth session redirect logic needed

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4">
      <MotionWrapper animation="scaleIn">
        <Card
          className="w-full max-w-md"
          style={{ width: "350px", maxWidth: "90vw" }}
        >
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
                Welcome Back
              </CardTitle>
            </MotionWrapper>
            <MotionWrapper animation="fadeInUp" delay={200}>
              <p className="text-muted-foreground">
                Sign in to your LegalAid account
              </p>
              <div className="mt-2">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:underline transition-colors"
                >
                  &larr; Back to Home
                </Link>
              </div>
              <div className="mt-4 flex justify-center">
                <GoogleSignIn />
              </div>
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
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="transition-all duration-200 focus:scale-[1.02]"
                  />
                </div>
              </MotionWrapper>

              {error && (
                <MotionWrapper animation="fadeInUp">
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </MotionWrapper>
              )}

              <MotionWrapper animation="fadeInUp" delay={500}>
                <Button
                  type="submit"
                  className="w-full hover:scale-105 transition-transform"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </MotionWrapper>

              <MotionWrapper animation="fadeInUp" delay={600}>
                <div className="text-center space-y-2">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:underline transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </MotionWrapper>

              <MotionWrapper animation="fadeInUp" delay={700}>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      href="/auth/signup"
                      className="text-primary hover:underline transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </MotionWrapper>
            </form>
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  );
}
