import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginClient } from "./LoginClient";

export const metadata: Metadata = { title: "Login" };

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}
