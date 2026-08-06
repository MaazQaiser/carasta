import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profileService, userService } from "@carasta/mock-data/services";
import { ProfileClient } from "../ProfileClient";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await userService.getUserByUsername(username);
  if (!user) return { title: "User Not Found" };
  return { title: user.displayName, description: user.bio };
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;
  const user = await userService.getUserByUsername(username);
  if (!user) notFound();
  const tabs = await profileService.getProfileTabs(user.id);
  return <ProfileClient user={user} isOwn={false} tabs={tabs} />;
}
