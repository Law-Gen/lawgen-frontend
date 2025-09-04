"use client";

import { useState } from "react";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    // Dummy resend logic
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10 px-4">
      <MotionWrapper animation="fadeInUp">
        <div className="bg-background rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full border border-border/50 text-center">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-primary rounded-full">
            <span className="text-3xl text-primary-foreground">📧</span>
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4">
            Verify Your Email
          </h2>
          <p className="text-muted-foreground mb-6">
            We have sent a verification link to your email address. Please check
            your inbox and click the link to verify your account.
          </p>
          <Button
            size="lg"
            className="w-full mb-4"
            onClick={handleResend}
            disabled={resent}
          >
            {resent ? "Verification Email Sent!" : "Resend Email"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or
            <Button
              variant="link"
              size="sm"
              className="px-1"
              onClick={handleResend}
              disabled={resent}
            >
              resend
            </Button>
            .
          </p>
          <div className="mt-8">
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </MotionWrapper>
    </div>
  );
}
