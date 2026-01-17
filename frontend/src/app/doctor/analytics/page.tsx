"use client";

import { useUser } from "@clerk/nextjs";
import { Sidebar } from "@/components/Sidebar";
import {
  Home,
  Users,
  Calendar,
  FileText,
  Pill,
  BookOpen,
  MessageCircle,
  Target,
  Video,
} from "lucide-react";

export default function AnalyticsPage() {
	const { user } = useUser();
	return (
		<div className="min-h-screen bg-gray-50">
			<Sidebar 
				active="dashboard"
				userName={user?.fullName || "Doctor"}
				userImage={user?.imageUrl}
				userRole="Doctor"
				navItems={[
					{ id: "dashboard", label: "Dashboard", icon: Home, href: "/doctor/dashboard" },
					{ id: "patients", label: "Patients", icon: Users, href: "/doctor/patients" },
					{ id: "appointments", label: "Appointments", icon: Calendar, href: "/doctor/appointments" },
					{ id: "documents", label: "Documents", icon: FileText, href: "/doctor/documents" },
					{ id: "prescriptions", label: "Prescriptions", icon: Pill, href: "/doctor/prescriptions" },
					{ id: "wellness", label: "Wellness Library", icon: BookOpen, href: "/doctor/wellness" },
					{ id: "chat", label: "Chat Support", icon: MessageCircle, href: "/doctor/chat" },
					{ id: "community", label: "Community", icon: Target, href: "/doctor/community" },
					{ id: "teleconsultation", label: "Teleconsultation", icon: Video, href: "/doctor/teleconsultation" },
				]}
			/>
			<div className="md:pl-64">
				<div className="p-8">
					<h1 className="text-2xl font-semibold">Doctor Analytics</h1>
					<p className="mt-2 text-sm text-gray-600">Analytics and reports will appear here.</p>
				</div>
			</div>
		</div>
	);
}
