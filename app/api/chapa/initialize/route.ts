import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      amount,
      email,
      first_name,
      last_name,
      tx_ref,
      return_url,
    } = body;

    // Use the secret key from environment variables. It should NOT have NEXT_PUBLIC_ prefix.
    const secret = process.env.CHAPA_SECRET_KEY;

    if (!secret) {
      return NextResponse.json(
        { error: "Chapa secret key is not configured on the server." },
        { status: 500 }
      );
    }

    const chapaResponse = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        amount,
        currency: "ETB",
        email,
        first_name,
        last_name,
        tx_ref,
        return_url,
        title: "LawGen Subscription",
        description: `Payment for subscription`,
      }),
    });

    const data = await chapaResponse.json();

    // Forward Chapa's response to the client
    return NextResponse.json(data, { status: chapaResponse.status });

  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { error: "Server error", detail: error.message },
      { status: 500 }
    );
  }
}
