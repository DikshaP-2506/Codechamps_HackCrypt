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
import {
  LatestVitalsCard,
  VitalsTrendChart,
  ActivePrescriptionsWidget,
  UpcomingAppointmentsWidget,
  NotificationCenter,
  HealthSummaryCard,
} from "@/components/PatientDashboardComponents";

// Avatar Component
function Avatar({ name, imageUrl, size = 40 }: { name: string; imageUrl?: string; size?: number }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="rounded-full border border-gray-200 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex items-center justify-center rounded-full border border-gray-200 bg-gradient-to-br from-emerald-100 to-emerald-50 font-mono font-semibold text-emerald-700"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

// Sidebar Component
function Sidebar({ active, userName, userImage }: { active: string; userName: string; userImage?: string }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/patient/dashboard" },
    { id: "health", label: "My Health", icon: Activity, href: "/patient/health" },
    { id: "appointments", label: "Appointments", icon: Calendar, href: "/patient/appointments" },
    { id: "documents", label: "Documents", icon: Folder, href: "/patient/documents" },
    { id: "medications", label: "Medications", icon: Pill, href: "/patient/medications" },
    { id: "wellness", label: "Wellness Library", icon: BookOpen, href: "/patient/wellness" },
    { id: "chat", label: "Chat Support", icon: MessageCircle, href: "/patient/chat" },
    { id: "community", label: "Community", icon: Users, href: "/patient/community" },
    { id: "profile", label: "My Profile", icon: User, href: "/patient/profile" },
    { id: "settings", label: "Settings", icon: Settings, href: "/patient/settings" },
  ];

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white">
      {/* Profile Section */}
      <div className="border-b border-emerald-700 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Avatar name={userName} imageUrl={userImage} size={48} />
          <div className="flex-1">
            <p className="font-semibold text-white">{userName}</p>
            <p className="text-xs text-emerald-200">Patient</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-700 text-white"
                    : "text-emerald-100 hover:bg-emerald-700/50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-emerald-700 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-emerald-100 transition hover:bg-emerald-700/50">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

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
      <Sidebar active="dashboard" userName={patientName} userImage={patientImage} />

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
        <main className="p-8">
          {/* Welcome Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {patientName.split(" ")[0]}! 👋
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="mt-2 text-sm italic text-emerald-700">"{todayQuote}"</p>
          </div>

          {/* Health Overview Grid */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <LatestVitalsCard patientId={patientId} />
            <VitalsTrendChart patientId={patientId} />
            <HealthSummaryCard patientId={patientId} />
          </div>

          {/* Medications and Appointments */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ActivePrescriptionsWidget patientId={patientId} />
            <UpcomingAppointmentsWidget patientId={patientId} />
          </div>

          {/* Notifications and Quick Actions */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <NotificationCenter recipientId={patientId} />
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold text-gray-900">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  {
                    icon: Activity,
                    label: "Log Vitals",
                    gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700",
                    href: "/patient/health",
                  },
                  {
                    icon: Pill,
                    label: "View Medications",
                    gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
                    href: "/patient/medications",
                  },
                  {
                    icon: Calendar,
                    label: "Book Appointment",
                    gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
                    href: "/patient/appointments",
                  },
                  {
                    icon: Upload,
                    label: "Upload Documents",
                    gradient: "bg-gradient-to-br from-teal-500 to-cyan-600",
                    href: "/patient/documents",
                  },
                ].map((action, idx) => (
                  <Link
                    key={idx}
                    href={action.href}
                    className={`flex items-center gap-4 rounded-xl ${action.gradient} p-4 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                      <action.icon className="h-6 w-6" />
                    </div>
                    <span className="font-semibold">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Health Insights Widget */}
          <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 font-bold text-gray-900">Your Health Insights</h3>
                <p className="text-gray-700">
                  Track your vitals regularly and maintain consistent health monitoring. Your wellness journey matters! 🌟
                </p>
                <Link
                  href="/patient/health"
                  className="mt-3 inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  View detailed trends <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}