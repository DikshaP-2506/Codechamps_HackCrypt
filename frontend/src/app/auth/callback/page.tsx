import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserData } from "@/lib/getUserData";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export default async function AuthCallbackPage() {
  const { userId } = await auth();
  
  console.log("🔍 Auth Callback - User ID:", userId);
  
  if (!userId) {
    console.log("❌ No user ID, redirecting to sign-in");
    redirect("/sign-in");
  }

  // Check if user profile exists in database
  let userData = await getUserData();
  
  console.log("📊 User Data from DB:", userData ? `Found (${userData.role})` : "Not Found");
  
  if (!userData) {
    // User signed in but has no profile - create a default one
    console.log("🆕 Creating default profile for sign-in user");
    const clerkUser = await currentUser();
    
    if (clerkUser) {
      await connectToDatabase();
      
      userData = await User.create({
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.emailAddresses[0].emailAddress.split('@')[0],
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined,
        role: "doctor", // Default role for sign-in users
        photoUrl: clerkUser.imageUrl,
        isActive: true,
        lastLogin: new Date(),
      });
      
      console.log("✅ Default profile created");
    }
  }

  // Redirect to role-based dashboard
  console.log(`✅ Redirecting to ${userData?.role} dashboard`);
  
  switch (userData?.role) {
    case "doctor":
      redirect("/doctor/dashboard");
    case "patient":
      redirect("/patient/dashboard");
    case "admin":
      redirect("/admin/dashboard");
    case "nurse":
      redirect("/nurse/dashboard");
    case "caretaker":
      redirect("/caretaker/dashboard");
    case "lab_reporter":
      redirect("/lab-reporter/dashboard");
    default:
      redirect("/doctor/dashboard");
  }
}