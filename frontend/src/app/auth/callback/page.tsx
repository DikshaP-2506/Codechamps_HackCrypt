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
        // User exists - check if clerkId matches
        if (existingUser.clerkId === userId) {
          // Same user, just update login time
          console.log("✅ Existing user found with matching clerkId");
          userData = await User.findByIdAndUpdate(
            existingUser._id,
            {
              firstName: clerkUser.firstName || existingUser.firstName,
              lastName: clerkUser.lastName || existingUser.lastName,
              photoUrl: clerkUser.imageUrl || existingUser.photoUrl,
              lastLogin: new Date(),
            },
            { new: true }
          );
        } else {
          // User exists with different clerkId - DO NOT UPDATE clerkId!
          // This means they're trying to log in with a different Clerk account but same email
          console.log("⚠️ User exists with different clerkId - user needs to complete profile");
          redirect("/complete-profile");
        }
      } else {
        // Create new user
        console.log("✨ Creating new default profile");
        userData = await User.create({
          clerkId: userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.emailAddresses[0].emailAddress.split('@')[0],
          firstName: clerkUser.firstName || undefined,
          lastName: clerkUser.lastName || undefined,
          role: "patient", // Default role changed to patient
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
      // Default to patient dashboard for unknown roles
      redirect("/patient/dashboard");
  }
}