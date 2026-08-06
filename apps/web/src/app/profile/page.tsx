import type { Metadata } from "next";
import { userService } from "@carasta/mock-data/services";
import { ProfileClient } from "./ProfileClient";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const user = await userService.getCurrentUser();
  return <ProfileClient user={user} isOwn />;
}
