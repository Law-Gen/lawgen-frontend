"use client";
import { useSession } from "next-auth/react";
import FooterNav from "../components/FooterNav";

export default function FooterNavWrapper() {
  const { data: session } = useSession();
  if (!session) return null;
  return <FooterNav />;
}
