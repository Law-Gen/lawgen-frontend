"use client";

import { Suspense } from "react";
import QuizzesPageInner from "./QuizzesPageInner";

export const dynamic = "force-dynamic"; // prevents prerender error

export default function QuizzesPage() {
  return (
    <Suspense fallback={<div>Loading quizzes...</div>}>
      <QuizzesPageInner />
    </Suspense>
  );
}
