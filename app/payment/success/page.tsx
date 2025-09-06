"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/src/lib/api";
import { useSession } from "next-auth/react";

type Status = "idle" | "subscribing" | "success" | "failed";

export default function SuccessPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  console.log("session", session);

  useEffect(() => {
    const planId = localStorage.getItem("selected_plan");
    console.log("selected_plan", planId);
    const tx_ref = searchParams.get("tx_ref");
    const chapaStatus = searchParams.get("status");

    if (!planId) {
      setError("Could not find the selected plan. Please try again.");
      setStatus("failed");
      return;
    }

    if (
      chapaStatus &&
      chapaStatus !== "success" &&
      chapaStatus !== "completed"
    ) {
      setError(`Payment status: ${chapaStatus}`);
      setStatus("failed");
      return;
    }

    const subscribe = async () => {
      try {
        setStatus("subscribing");
        setMessage("Activating your subscription...");
        console.log("planId", planId);
 console.log("session", session);
        const data = await api.post(
          "/subscriptions/subscribe",

          {
            plan_id: planId,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken || localStorage.getItem("access_token")}`,
            },
          }
        );

       
        setStatus("success");
        setMessage(data?.message || "Subscription activated successfully");
      } catch (e: any) {
        if (e.message.includes("401") || /invalid token/i.test(e.message)) {
          setError(
            "Your session has expired. Please sign in again to complete the subscription activation."
          );
        } else {
          setError(e.message);
        }
        setStatus("failed");
      }
    };

    subscribe();
  }, [searchParams]);

  const renderBody = () => {
    if (status === "success") {
      return (
        <>
          <CardTitle className="text-2xl text-primary mb-4">
            Subscription Activated
          </CardTitle>
          <p className="text-muted-foreground mb-6">{message}</p>
          <Link href="/profile">
            <Button>Return to Profile</Button>
          </Link>
        </>
      );
    }
    if (status === "failed") {
      return (
        <>
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Activation Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Link href="/profile">
            <Button variant="outline">Back to Profile</Button>
          </Link>
        </>
      );
    }
    return (
      <>
        <CardTitle className="text-xl text-primary mb-4">
          Finishing Up...
        </CardTitle>
        <p className="text-muted-foreground">
          {message || "Verifying payment and activating subscription."}
        </p>
      </>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10 p-4">
      <Card className="w-full max-w-md text-center p-6">
        <CardHeader>{renderBody()}</CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}
