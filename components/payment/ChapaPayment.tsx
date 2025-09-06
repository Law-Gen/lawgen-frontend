"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ChapaPaymentProps {
  plan: {
    id: string; // Add plan id
    name: string;
    price: number;
  };
  user: {
    name: string;
    email: string;
  };
  tx_ref: string;
  onClose: () => void;
}

export default function ChapaPayment({
  plan,
  user,
  tx_ref,
  onClose,
}: ChapaPaymentProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Make name parsing resilient in case `user.name` is missing or empty
  const rawName = (user && user.name) || "";
  const nameParts = rawName.trim()
    ? rawName.trim().split(" ")
    : [user.email.split("@")[0]];
  const [firstName, ...lastNameParts] = nameParts;
  const lastName = lastNameParts.join(" ") || firstName;

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    // Store the plan ID in localStorage so it can be retrieved on the success page
    localStorage.setItem("selected_plan", plan.id);

    const payload = {
      amount: plan.price.toString(),
      currency: "ETB",
      email: user.email,
      first_name: firstName,
      last_name: lastName,
      tx_ref: tx_ref,
      return_url: `${window.location.origin}/payment/success?planId=${plan.id}`,
    };

    try {
      // We now call our own backend proxy endpoint
      const response = await fetch("/api/chapa/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment initialization failed.");
      }

      if (data.status === "success" && data.data?.checkout_url) {
        window.location.href = data.data.checkout_url;
      } else {
        throw new Error("Could not retrieve checkout URL.");
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Confirm Your Purchase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plan:</span>
            <span className="font-semibold capitalize">{plan.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-semibold">ETB {plan.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-semibold">{user.email}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="w-full"
              onClick={handlePayment}
              disabled={isLoading}
            >
              {isLoading ? "Initializing..." : "Proceed to Chapa"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
