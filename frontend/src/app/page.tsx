import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">HackCrypt</h1>
        <UserButton />
      </header>
      <main className="flex flex-1 items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome to HackCrypt</h1>
      </main>
    </div>
  );
}
