"use client";

import { Suspense } from "react";

export default function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<p>Loading session...</p>}>{children}</Suspense>;
}
