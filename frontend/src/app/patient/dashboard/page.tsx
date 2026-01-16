"use client";

import { useState } from "react";
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

// Avatar Component
function Avatar({ name, size = 40 }: { name: string; size?: number }) {
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

// Quick Stat Card Component
function QuickStatCard({
  icon: Icon,
  title,
  content,
  subtext,
  badge,
  link,
  linkText,
  visualElement,
  buttonText,
  buttonColor,
}: {
  icon: any;
  title: string;
  content: string;
  subtext?: string;
  badge?: { text: string; color: string };
  link?: string;
  linkText?: string;
  visualElement?: React.ReactNode;
  buttonText?: string;
  buttonColor?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
        {badge && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.color}`}
          >
            {badge.text}
          </span>
        )}
      </div>
      <h3 className="mb-2 text-sm font-medium text-gray-600">{title}</h3>
      <p className="mb-1 text-xl font-bold text-gray-900">{content}</p>
      {subtext && <p className="text-sm text-gray-500">{subtext}</p>}
      {visualElement && <div className="mt-3">{visualElement}</div>}
      {link && linkText && (
        <Link
          href={link}
          className="mt-4 inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          {linkText} <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      )}
      {buttonText && (
        <button
          className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${buttonColor || "bg-emerald-600 hover:bg-emerald-700"}`}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

// Timeline Item Component
function TimelineItem({
  icon: Icon,
  title,
  subtitle,
  time,
  iconColor,
}: {
  icon: any;
  title: string;
  subtitle: string;
  time: string;
  iconColor: string;
}) {
  return (
    <div className="flex gap-4 pb-4 last:pb-0">
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${iconColor}`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 border-b border-gray-100 pb-4 last:border-0">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{subtitle}</p>
        <p className="mt-1 text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}

// Quick Action Button Component
function QuickActionButton({
  icon: Icon,
  label,
  gradient,
  href,
}: {
  icon: any;
  label: string;
  gradient: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 rounded-xl ${gradient} p-4 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
        <Icon className="h-6 w-6" />
      </div>
      <span className="font-semibold">{label}</span>
    </Link>
  );
}

// Appointment Card Component
function AppointmentCard({
  date,
  doctor,
  specialty,
  type,
  time,
  isVirtual,
}: {
  date: string;
  doctor: { name: string; avatar: string };
  specialty: string;
  type: string;
  time: string;
  isVirtual: boolean;
}) {
  return (
    <div className="flex-shrink-0 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {date}
        </span>
        <span
          className={`text-xs font-medium ${isVirtual ? "text-blue-600" : "text-gray-600"}`}
        >
          {isVirtual ? "Virtual" : "In-person"}
        </span>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <Avatar name={doctor.name} size={48} />
        <div>
          <p className="font-semibold text-gray-900">{doctor.name}</p>
          <p className="text-sm text-gray-600">{specialty}</p>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <Clock className="h-4 w-4" />
        <span>{time}</span>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
          Reschedule
        </button>
        {isVirtual ? (
          <button className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
            Join
          </button>
        ) : (
          <button className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
            Details
          </button>
        )}
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar({ active }: { active: string }) {
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
          <Avatar name="Sarah Johnson" size={48} />
          <div className="flex-1">
            <p className="font-semibold text-white">Sarah Johnson</p>
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
  const [notificationCount] = useState(5);
  const patientName = "Sarah Johnson";

  const motivationalQuotes = [
    "Your health is an investment, not an expense.",
    "Small steps every day lead to big changes.",
    "Take care of your body. It's the only place you have to live.",
    "Healing is a matter of time, but it's also a matter of opportunity.",
  ];

  const todayQuote =
    motivationalQuotes[new Date().getDate() % motivationalQuotes.length];

  const quickStats = [
    {
      icon: Activity,
      title: "Vitals Status",
      content: "3/5 vitals logged",
      link: "/patient/vitals",
      linkText: "Log remaining vitals",
      visualElement: (
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-3/5 rounded-full bg-emerald-600"></div>
          </div>
          <span className="text-sm font-medium text-gray-600">60%</span>
        </div>
      ),
    },
    {
      icon: Pill,
      title: "Medications",
      content: "2 of 3 taken today",
      badge: { text: "1 due soon", color: "bg-yellow-100 text-yellow-700" },
      link: "/patient/medications",
      linkText: "View schedule",
    },
    {
      icon: Calendar,
      title: "Upcoming Appointment",
      content: "Dr. Sarah Johnson",
      subtext: "Tomorrow at 10:00 AM",
      buttonText: "Join Virtual",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      icon: FileText,
      title: "New Documents",
      content: "2 lab reports uploaded",
      badge: { text: "New", color: "bg-red-100 text-red-700" },
      link: "/patient/documents",
      linkText: "View all",
    },
  ];

  const recentActivity = [
    {
      icon: Activity,
      title: "Vitals Logged - Blood Pressure: 120/80 mmHg",
      subtitle: "Normal range",
      time: "2 hours ago",
      iconColor: "bg-emerald-600",
    },
    {
      icon: Pill,
      title: "Medication Taken - Metformin 500mg",
      subtitle: "Morning dose",
      time: "5 hours ago",
      iconColor: "bg-purple-600",
    },
    {
      icon: Smile,
      title: "Mood Logged - Feeling Good (7/10)",
      subtitle: "Stress level: Low",
      time: "Yesterday, 8:30 PM",
      iconColor: "bg-blue-600",
    },
    {
      icon: FileText,
      title: "Document Uploaded - Blood Test Results",
      subtitle: "Shared with Dr. Johnson",
      time: "2 days ago",
      iconColor: "bg-teal-600",
    },
  ];

  const quickActions = [
    {
      icon: Activity,
      label: "Log Vitals Now",
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700",
      href: "/patient/vitals",
    },
    {
      icon: Smile,
      label: "Record Mood",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
      href: "/patient/mood",
    },
    {
      icon: Upload,
      label: "Upload Document",
      gradient: "bg-gradient-to-br from-teal-500 to-cyan-600",
      href: "/patient/documents",
    },
    {
      icon: MessageCircle,
      label: "Message Doctor",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
      href: "/patient/chat",
    },
  ];

  const upcomingAppointments = [
    {
      date: "Jan 17",
      doctor: { name: "Dr. Sarah Johnson", avatar: "SJ" },
      specialty: "Cardiologist",
      type: "Follow-up",
      time: "10:00 AM",
      isVirtual: true,
    },
    {
      date: "Jan 20",
      doctor: { name: "Dr. Michael Chen", avatar: "MC" },
      specialty: "General Physician",
      type: "Check-up",
      time: "2:30 PM",
      isVirtual: false,
    },
    {
      date: "Jan 25",
      doctor: { name: "Dr. Emily Roberts", avatar: "ER" },
      specialty: "Endocrinologist",
      type: "Consultation",
      time: "11:00 AM",
      isVirtual: true,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar active="dashboard" />

      {/* Main Content Area */}
      <div className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 border-b border-gray-200 bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 w-96">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments, documents..."
                className="flex-1 border-none bg-transparent text-sm outline-none"
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
                <Bell className="h-6 w-6" />
                {notificationCount > 0 && (
                  <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {notificationCount}
                  </div>
                )}
              </button>

              {/* Settings */}
              <button className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
                <Settings className="h-6 w-6" />
              </button>

              {/* Profile Avatar */}
              <div className="rounded-full border-2 border-emerald-200">
                <Avatar name={patientName} size={40} />
              </div>
            </div>
          </div>
        </div>

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

          {/* Quick Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((stat, idx) => (
              <QuickStatCard key={idx} {...stat} />
            ))}
          </div>

          {/* Health Summary Section */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent Activity Timeline (2 columns) */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Recent Health Activity
                  </h2>
                  <Link
                    href="/patient/activity"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentActivity.map((activity, idx) => (
                    <TimelineItem key={idx} {...activity} />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions (1 column) */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-bold text-gray-900">Quick Actions</h2>
                <div className="space-y-3">
                  {quickActions.map((action, idx) => (
                    <QuickActionButton key={idx} {...action} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments Section */}
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Appointments This Week</h2>
              <Link
                href="/patient/appointments"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                View All
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {upcomingAppointments.map((appointment, idx) => (
                <AppointmentCard key={idx} {...appointment} />
              ))}
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
                  Your blood pressure has been consistently normal this week. Keep up the
                  good work! 🌟
                </p>
                <Link
                  href="/patient/insights"
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