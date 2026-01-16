import { auth, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "./mongodb";
import User from "@/models/User";

/**
 * Get complete user data from MongoDB using Clerk auth
 * @returns User document from MongoDB or null
 */
export async function getUserData() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  await connectToDatabase();

  const user = await User.findOne({ clerkId: userId }).lean();
  
  return user;
}

/**
 * Get user role from MongoDB
 * @returns User role or null
 */
export async function getUserRole() {
  const user = await getUserData();
  return user?.role || null;
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: "patient" | "doctor" | "admin" | "caretaker" | "lab_reporter" | "nurse") {
  const userRole = await getUserRole();
  return userRole === role;
}

/**
 * Check if user is admin
 */
export async function isAdmin() {
  return hasRole("admin");
}

/**
 * Check if user is doctor
 */
export async function isDoctor() {
  return hasRole("doctor");
}

/**
 * Check if user is patient
 */
export async function isPatient() {
  return hasRole("patient");
}

/**
 * Check if user is nurse
 */
export async function isNurse() {
  return hasRole("nurse");
}

/**
 * Check if user is caretaker
 */
export async function isCaretaker() {
  return hasRole("caretaker");
}

/**
 * Check if user is lab reporter
 */
export async function isLabReporter() {
  return hasRole("lab_reporter");
}

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin() {
  const { userId } = await auth();
  
  if (!userId) return;

  await connectToDatabase();
  
  await User.findOneAndUpdate(
    { clerkId: userId },
    { lastLogin: new Date() }
  );
}
