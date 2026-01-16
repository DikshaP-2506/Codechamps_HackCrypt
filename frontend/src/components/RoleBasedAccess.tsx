import { getUserRole } from "../lib/getUserData";
import { redirect } from "next/navigation";

type Role = "patient" | "doctor" | "admin" | "caretaker" | "lab_reporter" | "nurse";

interface RoleBasedAccessProps {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Server component for role-based access control
 * Usage: 
 * <RoleBasedAccess allowedRoles={["admin", "doctor"]}>
 *   <AdminPanel />
 * </RoleBasedAccess>
 */
export async function RoleBasedAccess({
  allowedRoles,
  children,
  fallback,
}: RoleBasedAccessProps) {
  const userRole = await getUserRole();

  if (!userRole || !allowedRoles.includes(userRole)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    // Show a message instead of redirecting
    return (
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-gray-600">
        <p>🔒 Access restricted to: {allowedRoles.join(", ")}</p>
        <p className="text-sm">Your role: {userRole || "not set"}</p>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Client-side role check hook
 */
export function useRoleCheck() {
  // This would need to be implemented with client-side state
  // For now, use server-side RoleBasedAccess component
  return null;
}
