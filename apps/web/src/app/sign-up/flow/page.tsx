import type { Metadata } from "next";
import { Suspense } from "react";
import { SignUpFlowClient } from "../SignUpFlowClient";

export const metadata: Metadata = { title: "Create Account" };

export default function SignUpFlowPage() {
  return (
    <Suspense fallback={null}>
      <SignUpFlowClient />
    </Suspense>
  );
}
