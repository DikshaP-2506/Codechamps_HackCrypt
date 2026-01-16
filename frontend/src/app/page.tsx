import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Redirect authenticated users to doctor dashboard
  redirect("/doctor/dashboard");
}
