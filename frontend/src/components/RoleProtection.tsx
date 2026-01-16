import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/getUserData";

type Role = "patient" | "doctor" | "admin" | "caretaker" | "lab_reporter" | "nurse";

interface RoleProtectionProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

/**
 * Server-side role protection component
 * Redirects to /unauthorized if user doesn't have required role
 * 
 * Usage:
 * <RoleProtection allowedRoles={["doctor"]}>
 *   <DoctorDashboard />
 * </RoleProtection>
 */
export async function RoleProtection({ allowedRoles, children }: RoleProtectionProps) {
  const userRole = await getUserRole();

  if (!userRole || !allowedRoles.includes(userRole as Role)) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
