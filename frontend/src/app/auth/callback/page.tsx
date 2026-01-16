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
    // User signed in but has no profile - check if user exists by email and update clerkId
    console.log("🆕 Checking if user exists by email");
    const clerkUser = await currentUser();
    
    if (clerkUser) {
      await connectToDatabase();
      
      // Try to find user by email first
      const existingUser = await User.findOne({ 
        email: clerkUser.emailAddresses[0].emailAddress 
      });
      
      if (existingUser) {
        // User exists but with different clerkId - update it
        console.log("🔄 Updating existing user's clerkId");
        userData = await User.findByIdAndUpdate(
          existingUser._id,
          {
            clerkId: userId,
            firstName: clerkUser.firstName || existingUser.firstName,
            lastName: clerkUser.lastName || existingUser.lastName,
            photoUrl: clerkUser.imageUrl || existingUser.photoUrl,
            lastLogin: new Date(),
          },
          { new: true }
        );
      } else {
        // Create new user
        console.log("✨ Creating new default profile");
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
      }
      
      console.log("✅ Profile ready");
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