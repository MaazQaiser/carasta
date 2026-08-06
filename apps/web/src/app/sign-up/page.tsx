import type { Metadata } from "next";
import { Suspense } from "react";
import { WelcomeClient } from "./WelcomeClient";

export const metadata: Metadata = { title: "Create Account" };

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <WelcomeClient />
    </Suspense>
  );
}
