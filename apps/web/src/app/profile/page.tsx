import type { Metadata } from "next";
import { Suspense } from "react";
import { profileService, userService } from "@carasta/mock-data/services";
import { ProfileClient } from "./ProfileClient";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const user = await userService.getCurrentUser();
  const tabs = await profileService.getProfileTabs(user.id);
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
          Loading profile…
        </div>
      }
    >
      <ProfileClient user={user} isOwn tabs={tabs} />
    </Suspense>
  );
}
