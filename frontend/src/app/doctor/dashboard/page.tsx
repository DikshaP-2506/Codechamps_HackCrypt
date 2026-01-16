"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Home,
  Users,
  Calendar,
  BarChart2,
  FileText,
  Pill,
  Target,
  Video,
  Heart,
  Settings,
  LogOut,
  Bell,
  Search,
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  Menu,
  HelpCircle,
} from "lucide-react";
import {
  DoctorPatientList,
  DoctorAppointmentsToday,
  DoctorPatientVitalsMonitor,
  DoctorPrescriptionList,
  PendingReminders,
  DoctorStatsCard,
} from "@/components/DoctorDashboardComponents";

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
function Sidebar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const userName = user?.fullName || "Dr. Emily Carter";
  const userImage = user?.imageUrl;

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const navItems = [
    { label: "Dashboard", icon: Home, active: true, href: "/doctor/dashboard" },
    { label: "Patients", icon: Users, href: "/doctor/patients" },
    { label: "Appointments", icon: Calendar, href: "/doctor/appointments" },
    { label: "Analytics", icon: BarChart2, href: "/doctor/analytics" },
    { label: "Documents", icon: FileText, href: "/doctor/documents" },
    { label: "Prescriptions", icon: Pill, href: "/doctor/prescriptions" },
    { label: "Treatment Plans", icon: Target, href: "/doctor/treatment-plans" },
    { label: "Teleconsultation", icon: Video, href: "/doctor/teleconsultation" },
    { label: "Wellness Library", icon: Heart, href: "/doctor/wellness" },
    { label: "Collaboration", icon: Users, href: "/doctor/collaboration" },
    { label: "Settings", icon: Settings, href: "/doctor/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-60 flex-col bg-emerald-900 md:flex">
      {/* Profile Section */}
      <div className="border-b border-emerald-700 px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <div className="transition-transform hover:scale-105">
            <Avatar name={userName} imageUrl={userImage} size={56} />
          </div>
          <div className="text-center">
            <h3 className="text-base font-semibold text-white">
              {userName}
            </h3>
            <p className="text-sm text-white/70">Cardiologist</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, icon: Icon, active, href }) => (
          <Link
            key={label}
            href={href}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-emerald-100/20 text-white"
                : "text-white/70 hover:bg-emerald-700/40"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-emerald-700 p-4">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 py-3 text-red-400 transition-all hover:bg-red-500 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

// Top Bar Component
function TopBar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const alertCount = 5;
  const userName = user?.fullName || "Emily Carter";
  const userImage = user?.imageUrl;

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <div className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        {/* Left: Search */}
        <div className="flex items-center gap-3 flex-1">
          <button className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative hidden w-80 sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Alert Bell */}
          <div className="relative">
            <button className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
              <Bell className="h-6 w-6" />
            </button>
            {alertCount > 0 && (
              <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse-soft">
                {alertCount}
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:rotate-45 duration-300">
            <Settings className="h-6 w-6" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center rounded-full border border-gray-200 p-1 transition hover:border-gray-300"
            >
              <Avatar name={userName} imageUrl={userImage} size={40} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
                <div className="p-2">
                  {[
                    { label: "Profile", icon: Users },
                    { label: "Account Settings", icon: Settings },
                    { label: "Help & Support", icon: HelpCircle },
                  ].map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-emerald-50"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                  <div className="my-2 h-px bg-gray-200" />
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  subtitle,
  trend,
  severity,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  subtitle: string;
  trend?: { type: "up" | "down"; value: string };
  severity?: "critical" | "high" | "medium";
}) {
  const numberColor =
    severity === "critical"
      ? "text-red-500"
      : severity === "high"
      ? "text-yellow-500"
      : "text-emerald-700";

  return (
    <div className="flex h-[140px] flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
          {label}
        </span>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          {Icon}
        </div>
      </div>
      <div>
        <div className={`font-mono text-3xl font-bold ${numberColor}`}>
          {value}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-500">{subtitle}</span>
          {trend && (
            <span
              className={`flex items-center gap-1 text-xs font-medium ${
                trend.type === "up" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {trend.type === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Appointment Card Component
function AppointmentCard({
  time,
  name,
  type,
  status,
  video,
}: {
  time: string;
  name: string;
  type: "Consultation" | "Follow-up" | "Therapy";
  status: "Upcoming" | "In Progress" | "Completed";
  video: boolean;
}) {
  const statusDot =
    status === "Upcoming"
      ? "bg-emerald-500"
      : status === "In Progress"
      ? "bg-blue-500"
      : "bg-gray-400";

  const typeBg =
    type === "Consultation"
      ? "bg-blue-100 text-blue-700"
      : type === "Follow-up"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-purple-100 text-purple-700";

  return (
    <div className="mb-3 flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-gray-300 hover:bg-white hover:shadow-md hover:translate-x-1">
      {/* Time Badge */}
      <div className="min-w-fit font-mono text-sm font-bold text-emerald-700 bg-emerald-100 rounded-md px-3 py-2">
        {time}
      </div>

      {/* Patient Info */}
      <div className="flex flex-1 items-center gap-3">
        <Avatar name={name} size={40} />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-gray-900">
            {name}
          </div>
          <div className="mt-1">
            <span
              className={`inline-block rounded px-2 py-1 text-xs font-medium ${typeBg}`}
            >
              {type}
            </span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-gray-600">
        <div className={`h-2.5 w-2.5 rounded-full ${statusDot}`} />
        <span className="text-xs font-medium whitespace-nowrap">{status}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {video && (
          <button className="flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Join</span>
          </button>
        )}
        <button className="rounded-md p-2 text-gray-600 transition hover:bg-gray-200">
          <Calendar className="h-4 w-4" />
        </button>
        <button className="rounded-md p-2 text-gray-600 transition hover:bg-red-100 hover:text-red-600">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Alert Card Component
function AlertCard({
  severity,
  name,
  type,
  metric,
  time,
}: {
  severity: "Critical" | "High" | "Medium";
  name: string;
  type: string;
  metric: string;
  time: string;
}) {
  const borderColor =
    severity === "Critical"
      ? "border-l-red-500"
      : severity === "High"
      ? "border-l-yellow-500"
      : "border-l-blue-500";

  const iconColor =
    severity === "Critical"
      ? "text-red-500"
      : severity === "High"
      ? "text-yellow-500"
      : "text-blue-500";

  const metricColor =
    severity === "Critical"
      ? "text-red-600"
      : severity === "High"
      ? "text-yellow-600"
      : "text-blue-600";

  return (
    <div
      className={`mb-3 rounded-lg border border-gray-200 ${borderColor} bg-white p-4 transition-all hover:-translate-x-1 hover:shadow-md`}
    >
      <div className="flex items-center gap-2">
        <AlertCircle className={`h-4 w-4 ${iconColor}`} />
        <button className="text-sm font-semibold text-gray-900 transition hover:text-emerald-600 hover:underline">
          {name}
        </button>
      </div>
      <div className="mt-1 text-sm font-medium text-gray-800">{type}</div>
      <div className={`mt-1 font-mono text-xs sm:text-sm ${metricColor}`}>
        {metric}
      </div>
      <div className="mt-1 text-xs text-gray-500">{time}</div>
      <button className="mt-2 w-full rounded-md border border-emerald-500 px-3 py-2 text-xs font-medium text-emerald-600 transition hover:bg-emerald-600 hover:text-white">
        Review
      </button>
    </div>
  );
}

// Action Card Component
function ActionCard({
  label,
  icon: Icon,
  gradient,
}: {
  label: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <button
      className={`flex h-[140px] flex-col justify-between rounded-xl p-6 text-left text-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${gradient} cursor-pointer`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
        {Icon}
      </div>
      <div className="text-lg font-semibold drop-shadow-sm">{label}</div>
    </button>
  );
}

// Patient Table Component
function PatientTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const patients = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    name: [
      "John Doe",
      "Sarah Johnson",
      "Michael Green",
      "Emma Wilson",
      "David Brown",
      "Olivia Clark",
      "Liam Miller",
      "Sophia Davis",
      "Noah Thompson",
      "Ava Martinez",
    ][i],
    patientId: `PT-${String(1234 + i).padStart(5, "0")}`,
    lastVisit: "Jan 15, 2024",
    condition: ["Hypertension", "Diabetes", "Anxiety"][i % 3],
    nextAppt: "Jan 20, 2024",
    status: ["Active", "Follow-up", "Critical"][i % 3] as
      | "Active"
      | "Follow-up"
      | "Critical",
  }));

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-700";
      case "Follow-up":
        return "bg-yellow-100 text-yellow-600";
      case "Critical":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-900">Recent Patient Activity</h2>
        <div className="flex items-center gap-3">
          <div className="relative w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full rounded-md border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>
          <button className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              {[
                "Patient Name",
                "Last Visit",
                "Condition",
                "Next Appointment",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p) => (
              <tr
                key={p.id}
                className="border-b border-gray-200 transition hover:bg-gray-50"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name} />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900">
                        {p.name}
                      </div>
                      <div className="text-xs text-gray-500">{p.patientId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {p.lastVisit}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {p.condition}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {p.nextAppt}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusBadge(
                      p.status
                    )}`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === p.id ? null : p.id)
                      }
                      className="rounded-md p-2 transition hover:bg-gray-100"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button>
                    {activeMenu === p.id && (
                      <div className="absolute right-8 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-40">
                        {[
                          { label: "View Profile", icon: Users },
                          { label: "Message", icon: AlertCircle },
                          { label: "Schedule Appointment", icon: Calendar },
                        ].map(({ label, icon: Icon }) => (
                          <button
                            key={label}
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-emerald-600 first:rounded-t-lg last:rounded-b-lg"
                          >
                            <Icon className="h-4 w-4" />
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col gap-4 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600">
          Showing 1-10 of 247 patients
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              className={`h-8 w-8 rounded-md text-sm font-medium transition ${
                n === currentPage
                  ? "bg-emerald-600 text-white"
                  : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setCurrentPage(n)}
            >
              {n}
            </button>
          ))}
          <button className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function DoctorDashboard() {
  const { user } = useUser();
  const doctorId = user?.id || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="md:ml-60">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, Dr. {user?.lastName || "Smith"}! 👋
            </h1>
            <p className="mt-2 text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Statistics Cards */}
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Overview</h2>
            <DoctorStatsCard />
          </section>

          {/* Today's Appointments and Pending Reminders */}
          <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DoctorAppointmentsToday doctorId={doctorId} />
            </div>
            <div>
              <PendingReminders />
            </div>
          </section>

          {/* Patient Management and Vitals Monitoring */}
          <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DoctorPatientList doctorId={doctorId} />
            </div>
            <div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-900">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/doctor/patients"
                    className="flex items-center gap-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <Users className="h-5 w-5" />
                    View All Patients
                  </Link>
                  <Link
                    href="/doctor/appointments"
                    className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                  >
                    <Calendar className="h-5 w-5" />
                    Manage Appointments
                  </Link>
                  <Link
                    href="/doctor/prescriptions"
                    className="flex items-center gap-3 rounded-lg bg-purple-50 px-4 py-3 text-sm font-medium text-purple-700 transition hover:bg-purple-100"
                  >
                    <Pill className="h-5 w-5" />
                    New Prescription
                  </Link>
                  <Link
                    href="/doctor/analytics"
                    className="flex items-center gap-3 rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                  >
                    <BarChart2 className="h-5 w-5" />
                    View Analytics
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Information Section */}
          <section className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 font-bold text-gray-900">Patient Management Tips</h3>
                <p className="text-gray-700">
                  Stay on top of your patient appointments and health metrics. Use the
                  dashboard to monitor vitals, manage prescriptions, and track patient
                  progress efficiently. 📊
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
