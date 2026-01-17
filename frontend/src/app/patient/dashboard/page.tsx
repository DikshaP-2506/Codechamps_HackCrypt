"use client";

import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Home,
  Activity,
  Pill,
  Bell,
  Heart,
  Video,
  TrendingUp,
  Calendar,
  Folder,
  MessageCircle,
  Users,
  Smile,
  FileText,
  Upload,
  Search,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Clock,
  ArrowRight,
  BookOpen,
  Target,
} from "lucide-react";
import { PatientTopBar } from "@/components/PatientTopBar";
import { Sidebar } from "@/components/Sidebar";
import {
  LatestVitalsCard,
  VitalsTrendChart,
  ActivePrescriptionsWidget,
  UpcomingAppointmentsWidget,
  NotificationCenter,
  HealthSummaryCard,
} from "@/components/PatientDashboardComponents";

// Main Patient Dashboard Component
export default function PatientDashboard() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [notificationCount] = useState(5);
  const patientName = user?.fullName || "Patient";
  const patientImage = user?.imageUrl;

  const handleLogout = () => {
    signOut({ redirectUrl: "/sign-in" });
  };

  const patientId = user?.id || ""; // Use Clerk user ID or get from profile
  
  const motivationalQuotes = [
    "Your health is an investment, not an expense.",
    "Small steps every day lead to big changes.",
    "Take care of your body. It's the only place you have to live.",
    "Healing is a matter of time, but it's also a matter of opportunity.",
  ];

  const todayQuote =
    motivationalQuotes[new Date().getDate() % motivationalQuotes.length];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar active="dashboard" userName={patientName} userImage={patientImage} userRole="Patient" />

      {/* Main Content Area */}
      <div className="ml-64 flex-1">
        <PatientTopBar
          userName={patientName}
          userImage={patientImage}
          notificationCount={notificationCount}
          onLogout={handleLogout}
          searchPlaceholder="Search appointments, documents..."
        />

        {/* Main Content */}
        <main className="p-6 lg:p-8">
          {/* Welcome Header */}
          <div className="mb-8 rounded-xl bg-gradient-to-r from-[#006045] to-emerald-700 p-6 text-white shadow-lg">
            <h1 className="text-3xl font-bold">
              Welcome back, {patientName.split(" ")[0]}! 👋
            </h1>
            <p className="mt-2 text-emerald-100">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="mt-3 text-lg italic text-white/90">"{todayQuote}"</p>
          </div>

          {/* Quick Actions Cards */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                {
                  icon: Activity,
                  label: "Log Vitals",
                  color: "from-[#006045] to-emerald-700",
                  href: "/patient/health",
                },
                {
                  icon: Calendar,
                  label: "Book Appointment",
                  color: "from-[#006045] to-emerald-700",
                  href: "/patient/appointments",
                },
                {
                  icon: Pill,
                  label: "Medications",
                  color: "from-[#006045] to-emerald-700",
                  href: "/patient/medications",
                },
                {
                  icon: Upload,
                  label: "Upload Docs",
                  color: "from-[#006045] to-emerald-700",
                  href: "/patient/documents",
                },
              ].map((action, idx) => (
                <Link
                  key={idx}
                  href={action.href}
                  className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${action.color} p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
                      <action.icon className="h-8 w-8" />
                    </div>
                    <span className="text-sm font-semibold">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Health Overview Section */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Health Overview</h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <LatestVitalsCard patientId={patientId} />
              <VitalsTrendChart patientId={patientId} />
              <HealthSummaryCard patientId={patientId} />
            </div>
          </div>

          {/* Appointments & Medications */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Upcoming & Active</h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <UpcomingAppointmentsWidget patientId={patientId} />
              <ActivePrescriptionsWidget patientId={patientId} />
            </div>
          </div>

          {/* Notifications */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Recent Notifications</h2>
            <NotificationCenter recipientId={patientId} />
          </div>

          {/* Health Insights Banner */}
          <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                <TrendingUp className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-bold text-gray-900">Keep Up Your Health Journey! 🌟</h3>
                <p className="text-sm text-gray-700">
                  Regular monitoring helps you stay on track. Review your vitals, maintain your medication schedule, and don't miss upcoming appointments.
                </p>
              </div>
              <Link
                href="/patient/health"
                className="flex-shrink-0 rounded-lg bg-[#006045] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 hover:shadow-lg"
              >
                View Trends
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}