"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Home,
  Users,
  Calendar,
  Clipboard,
  Heart,
  Settings,
  LogOut,
  Bell,
  Search,
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  MoreVertical,
  Menu,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Syringe,
  Clock,
} from "lucide-react";

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
  const userName = user?.fullName || "Nurse Sarah";
  const userImage = user?.imageUrl;

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const navItems = [
    { label: "Dashboard", icon: Home, active: true, href: "/nurse/dashboard" },
    { label: "Assigned Patients", icon: Users, href: "/nurse/patients" },
    { label: "Tasks", icon: Clipboard, href: "/nurse/tasks" },
    { label: "Vitals Monitoring", icon: Activity, href: "/nurse/vitals" },
    { label: "Medications", icon: Syringe, href: "/nurse/medications" },
    { label: "Appointments", icon: Calendar, href: "/nurse/appointments" },
    { label: "Reports", icon: Heart, href: "/nurse/reports" },
    { label: "Settings", icon: Settings, href: "/nurse/settings" },
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
            <p className="text-sm text-white/70">Registered Nurse</p>
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
  const alertCount = 3;
  const userName = user?.fullName || "Nurse Sarah";
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
              placeholder="Search patients, tasks..."
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
  severity,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  subtitle: string;
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
        </div>
      </div>
    </div>
  );
}

// Task Card Component
function TaskCard({
  patientName,
  taskType,
  time,
  status,
}: {
  patientName: string;
  taskType: string;
  time: string;
  status: "Pending" | "Completed";
}) {
  const [isCompleted, setIsCompleted] = useState(status === "Completed");
  
  const statusColor = isCompleted
    ? "bg-emerald-100 text-emerald-700"
    : "bg-yellow-100 text-yellow-700";

  return (
    <div className="mb-3 flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-gray-300 hover:bg-white hover:shadow-md">
      {/* Patient Avatar */}
      <Avatar name={patientName} size={40} />

      {/* Task Info */}
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm font-semibold text-gray-900">
          {patientName}
        </div>
        <div className="mt-1 text-xs text-gray-600">{taskType}</div>
      </div>

      {/* Time */}
      <div className="flex items-center gap-1 text-gray-600 min-w-fit">
        <Clock className="h-4 w-4" />
        <span className="text-xs font-medium">{time}</span>
      </div>

      {/* Status Badge */}
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${statusColor}`}
      >
        {isCompleted ? "Completed" : "Pending"}
      </span>

      {/* Mark Done Button */}
      {!isCompleted && (
        <button
          onClick={() => setIsCompleted(true)}
          className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700"
        >
          Mark Done
        </button>
      )}
    </div>
  );
}

// Patient Card Component
function PatientCard({
  name,
  age,
  gender,
  room,
  conditions,
}: {
  name: string;
  age: number;
  gender: string;
  room: string;
  conditions: string[];
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-500 hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar name={name} size={48} />
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-xs text-gray-600">Room {room}</p>
          </div>
        </div>
        <button className="rounded-md p-2 text-gray-600 transition hover:bg-gray-100">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3 space-y-1 text-xs text-gray-600">
        <p><span className="font-medium">Age:</span> {age} years</p>
        <p><span className="font-medium">Gender:</span> {gender}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {conditions.map((condition) => (
          <span
            key={condition}
            className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700"
          >
            {condition}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100">
          View Profile
        </button>
        <button className="flex-1 rounded-md bg-emerald-600 px-2 py-2 text-xs font-medium text-white transition hover:bg-emerald-700">
          Log Vitals
        </button>
      </div>
    </div>
  );
}

// Alert Card Component
function AlertCard({
  severity,
  name,
  message,
  time,
}: {
  severity: "Critical" | "Warning";
  name: string;
  message: string;
  time: string;
}) {
  const borderColor =
    severity === "Critical"
      ? "border-l-red-500 bg-red-50"
      : "border-l-yellow-500 bg-yellow-50";

  const iconColor =
    severity === "Critical"
      ? "text-red-500"
      : "text-yellow-500";

  return (
    <div className={`mb-3 flex gap-3 rounded-lg border-l-4 p-4 ${borderColor}`}>
      <div className={`flex-shrink-0 ${iconColor}`}>
        {severity === "Critical" ? (
          <AlertTriangle className="h-5 w-5" />
        ) : (
          <AlertCircle className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{name}</p>
        <p className="text-xs text-gray-700">{message}</p>
        <p className="mt-1 text-xs text-gray-500">{time}</p>
      </div>
      <button className="flex-shrink-0 rounded-md bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100">
        Review
      </button>
    </div>
  );
}

// Main Dashboard Component
export default function NurseDashboard() {
  const [alertFilter, setAlertFilter] = useState<"All" | "Critical" | "Warning">("All");

  // Mock data for tasks
  const tasks = [
    {
      patientName: "John Anderson",
      taskType: "Check vitals",
      time: "10:30 AM",
      status: "Pending" as const,
    },
    {
      patientName: "Maria Garcia",
      taskType: "Administer medication",
      time: "11:00 AM",
      status: "Pending" as const,
    },
    {
      patientName: "Robert Chen",
      taskType: "Dressing change",
      time: "09:45 AM",
      status: "Completed" as const,
    },
    {
      patientName: "Emma Wilson",
      taskType: "Check wound",
      time: "02:00 PM",
      status: "Pending" as const,
    },
  ];

  // Mock data for assigned patients
  const patients = [
    {
      name: "John Anderson",
      age: 65,
      gender: "Male",
      room: "301",
      conditions: ["Hypertension", "Diabetes"],
    },
    {
      name: "Maria Garcia",
      age: 48,
      gender: "Female",
      room: "302",
      conditions: ["Post-Op", "Recovery"],
    },
    {
      name: "Robert Chen",
      age: 72,
      gender: "Male",
      room: "303",
      conditions: ["Arthritis", "Stable"],
    },
  ];

  // Mock data for alerts
  const alerts = [
    {
      severity: "Critical" as const,
      name: "John Anderson (Room 301)",
      message: "Blood pressure elevated - 165/95 mmHg",
      time: "5 minutes ago",
    },
    {
      severity: "Warning" as const,
      name: "Emma Wilson (Room 304)",
      message: "Temperature slightly elevated - 38.2°C",
      time: "12 minutes ago",
    },
    {
      severity: "Critical" as const,
      name: "Robert Chen (Room 303)",
      message: "Medication overdue - Next dose at 2:00 PM",
      time: "2 minutes ago",
    },
  ];

  const pendingTasks = tasks.filter(t => t.status === "Pending").length;
  const assignedPatientCount = patients.length;
  const criticalAlerts = alerts.filter(a => a.severity === "Critical").length;
  const activeTreatments = 12;

  const filteredAlerts = alerts.filter(
    (a) => alertFilter === "All" || a.severity === alertFilter
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="md:ml-60">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Nurse Dashboard</h1>
            <p className="mt-1 text-gray-600">Today's Overview</p>
          </section>

          {/* Stats Row */}
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Assigned Patients"
              value={assignedPatientCount}
              icon={<Users className="h-6 w-6 text-emerald-700" />}
              subtitle="Under your care"
            />
            <StatCard
              label="Today's Tasks"
              value={pendingTasks}
              icon={<Clipboard className="h-6 w-6 text-emerald-700" />}
              subtitle="Pending tasks"
            />
            <StatCard
              label="Critical Alerts"
              value={criticalAlerts}
              icon={<AlertTriangle className="h-6 w-6 text-emerald-700" />}
              subtitle="Require attention"
              severity="critical"
            />
            <StatCard
              label="Active Treatments"
              value={activeTreatments}
              icon={<Activity className="h-6 w-6 text-emerald-700" />}
              subtitle="In progress"
            />
          </section>

          {/* Tasks + Alerts Row */}
          <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Tasks (Left - 2/3) */}
            <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Today's Tasks
                </h2>
                <button className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline">
                  View All
                </button>
              </div>
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="h-16 w-16 text-emerald-300" />
                  <p className="mt-4 text-gray-500">No tasks scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task, idx) => (
                    <TaskCard key={idx} {...task} />
                  ))}
                </div>
              )}
            </div>

            {/* Alerts (Right - 1/3) */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Alerts
                </h2>
                <button
                  onClick={() => {
                    const filters: ("All" | "Critical" | "Warning")[] = ["All", "Critical", "Warning"];
                    const currentIdx = filters.indexOf(alertFilter);
                    setAlertFilter(
                      filters[(currentIdx + 1) % filters.length]
                    );
                  }}
                  className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-emerald-500"
                >
                  {alertFilter}
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
              {filteredAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="mt-3 text-sm text-gray-500">No alerts</p>
                  <p className="text-xs text-gray-400">
                    All patients are stable
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAlerts.map((alert, idx) => (
                    <AlertCard key={idx} {...alert} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Assigned Patients Section */}
          <section className="mt-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Assigned Patients
              </h2>
              <button className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {patients.map((patient, idx) => (
                <PatientCard key={idx} {...patient} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
