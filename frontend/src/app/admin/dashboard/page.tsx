"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Users,
  Calendar,
  AlertCircle,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  LogIn,
  Plus,
  TrendingUp,
  Activity,
  Pill,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserPlus,
  FileText,
  Database,
  Lock,
  HardDrive,
  ChevronRight,
  Eye,
  Download,
  MessageSquare,
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

// Sidebar Component
function Sidebar({ active }: { active: string }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/admin/dashboard" },
    { id: "users", label: "Users Management", icon: Users, href: "/admin/users", hasSubmenu: true },
    { id: "appointments", label: "Appointments", icon: Calendar, href: "/admin/appointments" },
    { id: "alerts", label: "Alerts & Escalations", icon: AlertCircle, href: "/admin/alerts" },
    { id: "analytics", label: "Analytics & Reports", icon: BarChart3, href: "/admin/analytics" },
    { id: "logs", label: "System Logs", icon: FileText, href: "/admin/logs" },
    { id: "settings", label: "System Settings", icon: Settings, href: "/admin/settings" },
    { id: "security", label: "Security & Permissions", icon: Lock, href: "/admin/security" },
    { id: "backup", label: "Backup & Restore", icon: HardDrive, href: "/admin/backup" },
  ];

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-gradient-to-b from-teal-700 to-teal-800 text-white">
      {/* Logo Section */}
      <div className="border-b border-teal-600 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-white">HealthCare</p>
            <p className="text-xs text-teal-200">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="border-b border-teal-600 p-4 mx-2 my-4 rounded-lg bg-teal-600/50">
        <div className="flex items-center gap-3">
          <Avatar name="Admin User" size={40} />
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">Admin User</p>
            <p className="text-xs text-teal-200">System Administrator</p>
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
                className={`flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-teal-100 hover:bg-teal-600/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {item.hasSubmenu && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-teal-600 p-4 space-y-2">
        <p className="text-xs text-teal-300 px-4">v2.1.5</p>
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-teal-100 transition hover:bg-red-600/20 hover:text-red-300">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  chart,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; direction: "up" | "down" };
  chart?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-forest-700">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
          {Icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          {trend.direction === "up" ? (
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          ) : (
            <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
          )}
          <span
            className={`text-sm font-semibold ${
              trend.direction === "up" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {trend.direction === "up" ? "+" : "-"}
            {trend.value}% this month
          </span>
        </div>
      )}
    </div>
  );
}

// Quick Action Card
function QuickActionCard({
  icon: Icon,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-teal-50 to-emerald-50 p-6 transition hover:border-teal-600 hover:bg-teal-100"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-600 text-white">
        {Icon}
      </div>
      <span className="text-sm font-semibold text-gray-900">{title}</span>
    </button>
  );
}

// Activity Item Component
function ActivityItem({
  icon: Icon,
  title,
  description,
  actor,
  timestamp,
  type,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actor: string;
  timestamp: string;
  type: "user" | "alert" | "system" | "report";
}) {
  const typeColors = {
    user: "bg-blue-100 text-blue-700",
    alert: "bg-red-100 text-red-700",
    system: "bg-orange-100 text-orange-700",
    report: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="flex items-start gap-4 border-b border-gray-100 py-4 last:border-b-0">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${typeColors[type]}`}>
        {Icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <span className="font-medium text-gray-700">{actor}</span>
          <span>•</span>
          <span>{timestamp}</span>
        </div>
      </div>
    </div>
  );
}

// Chart Component (Simplified)
function SimpleLineChart() {
  return (
    <div className="h-48 w-full flex items-end justify-around gap-1 px-4 py-6 bg-gradient-to-b from-emerald-50 to-white rounded-lg">
      {[40, 60, 50, 70, 65, 80, 75, 85, 78, 88, 92, 85, 90, 95, 100, 98].map((height, idx) => (
        <div
          key={idx}
          className="flex-1 rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 opacity-80"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

// Doughnut Chart Component (Simplified)
function SimpleDoughnutChart() {
  return (
    <div className="flex flex-col items-center justify-center h-48">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#10B981" strokeWidth="15" strokeDasharray="160 420" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#3B82F6" strokeWidth="15" strokeDasharray="90 420" strokeDashoffset="-160" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#8B5CF6" strokeWidth="15" strokeDasharray="45 420" strokeDashoffset="-250" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#F59E0B" strokeWidth="15" strokeDasharray="15 420" strokeDashoffset="-295" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#EF4444" strokeWidth="15" strokeDasharray="8 420" strokeDashoffset="-310" />
          <circle cx="50" cy="50" r="28" fill="white" />
          <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#065F46">
            2.5K
          </text>
        </svg>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-gray-600">Patients (85%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-gray-600">Doctors (8%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          <span className="text-gray-600">Nurses (4%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          <span className="text-gray-600">Lab (2%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-gray-600">Admin (1%)</span>
        </div>
      </div>
    </div>
  );
}

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const [notificationCount] = useState(5);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar active="dashboard" />

      {/* Main Content Area */}
      <div className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 border-b border-gray-200 bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-gray-400">/</span>
              <span className="font-semibold text-teal-700">Dashboard</span>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 w-96">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users, appointments, alerts..."
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
              <div className="rounded-full border-2 border-teal-200">
                <Avatar name="Admin User" size={40} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-8">
          {/* Welcome Banner */}
          <div className="mb-8 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 p-8 text-white">
            <h1 className="text-3xl font-bold">Welcome back, Administrator</h1>
            <p className="mt-2 text-teal-100">
              System health: <span className="font-semibold">99.2% Uptime</span> • Last updated: 2 mins ago
            </p>
          </div>

          {/* Metrics Row 1 */}
          <div className="mb-8 grid grid-cols-5 gap-6">
            <MetricCard
              icon={<Users className="h-6 w-6 text-emerald-600" />}
              title="Total Patients"
              value="2,547"
              subtitle="Active patients"
              trend={{ value: 156, direction: "up" }}
            />
            <MetricCard
              icon={<LogIn className="h-6 w-6 text-blue-600" />}
              title="Active Doctors"
              value="25"
              subtitle="12 online, 8 busy"
              trend={{ value: 2, direction: "up" }}
            />
            <MetricCard
              icon={<Calendar className="h-6 w-6 text-purple-600" />}
              title="Today's Appointments"
              value="134"
              subtitle="78 completed, 23 ongoing"
              trend={{ value: 12, direction: "up" }}
            />
            <MetricCard
              icon={<AlertTriangle className="h-6 w-6 text-amber-600" />}
              title="Critical Alerts"
              value="8"
              subtitle="3 critical, 5 high"
              trend={{ value: 3, direction: "down" }}
            />
            <MetricCard
              icon={<CheckCircle2 className="h-6 w-6 text-emerald-600" />}
              title="System Health"
              value="99.2%"
              subtitle="All systems online"
            />
          </div>

          {/* Charts Section */}
          <div className="mb-8 grid grid-cols-3 gap-6">
            {/* Patient Registrations Trend */}
            <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Patient Registrations - Last 30 Days</h2>
                <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                  Week • Month • Quarter
                </button>
              </div>
              <SimpleLineChart />
            </div>

            {/* User Distribution */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">User Distribution</h2>
              <SimpleDoughnutChart />
            </div>
          </div>

          {/* Appointment Analytics & Recent Activity */}
          <div className="mb-8 grid grid-cols-3 gap-6">
            {/* Appointment Analytics */}
            <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Appointment Status Overview</h2>
              <div className="space-y-4">
                {[
                  { label: "Scheduled", count: 28, color: "bg-blue-500", percentage: 21 },
                  { label: "Completed", count: 78, color: "bg-emerald-500", percentage: 58 },
                  { label: "Cancelled", count: 5, color: "bg-red-500", percentage: 4 },
                  { label: "No-Shows", count: 23, color: "bg-orange-500", percentage: 17 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{item.label}</span>
                      <span className="font-bold text-gray-900">{item.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Recent Activity</h2>
              <div className="space-y-2">
                <ActivityItem
                  icon={<UserPlus className="h-4 w-4" />}
                  title="New User Registered"
                  description="Dr. Michael Chen"
                  actor="Self-registered"
                  timestamp="5 mins ago"
                  type="user"
                />
                <ActivityItem
                  icon={<AlertCircle className="h-4 w-4" />}
                  title="Critical Alert"
                  description="Hypertensive Crisis - John Doe"
                  actor="Auto-detected"
                  timestamp="15 mins ago"
                  type="alert"
                />
                <ActivityItem
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  title="Appointment Completed"
                  description="Dr. Smith & Sarah Johnson"
                  actor="System"
                  timestamp="1 hour ago"
                  type="system"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
            <div className="grid grid-cols-6 gap-4">
              <QuickActionCard
                icon={<UserPlus className="h-6 w-6" />}
                title="Add New User"
                onClick={() => console.log("Add user")}
              />
              <QuickActionCard
                icon={<BarChart3 className="h-6 w-6" />}
                title="Generate Report"
                onClick={() => console.log("Generate report")}
              />
              <QuickActionCard
                icon={<AlertCircle className="h-6 w-6" />}
                title="View Alerts"
                onClick={() => console.log("View alerts")}
              />
              <QuickActionCard
                icon={<Settings className="h-6 w-6" />}
                title="System Settings"
                onClick={() => console.log("Settings")}
              />
              <QuickActionCard
                icon={<Download className="h-6 w-6" />}
                title="Export Data"
                onClick={() => console.log("Export data")}
              />
              <QuickActionCard
                icon={<Activity className="h-6 w-6" />}
                title="View Activity Log"
                onClick={() => console.log("View logs")}
              />
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-gray-900">System Insights</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                <p className="text-sm text-blue-700">Average Appointment Duration</p>
                <p className="mt-2 text-2xl font-bold text-blue-900">28 mins</p>
                <p className="mt-1 text-xs text-blue-600">+2 mins from last week</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-red-50 to-red-100 p-4">
                <p className="text-sm text-red-700">No-Show Rate</p>
                <p className="mt-2 text-2xl font-bold text-red-900">3.2%</p>
                <p className="mt-1 text-xs text-red-600">-0.5% improvement</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
                <p className="text-sm text-emerald-700">Medication Adherence</p>
                <p className="mt-2 text-2xl font-bold text-emerald-900">87%</p>
                <p className="mt-1 text-xs text-emerald-600">Above target (85%)</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                <p className="text-sm text-purple-700">Alert Response Time</p>
                <p className="mt-2 text-2xl font-bold text-purple-900">15 mins</p>
                <p className="mt-1 text-xs text-purple-600">Average response</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-4">
                <p className="text-sm text-orange-700">Active Treatment Plans</p>
                <p className="mt-2 text-2xl font-bold text-orange-900">1,247</p>
                <p className="mt-1 text-xs text-orange-600">+89 this month</p>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-cyan-50 to-cyan-100 p-4">
                <p className="text-sm text-cyan-700">Documents Uploaded Today</p>
                <p className="mt-2 text-2xl font-bold text-cyan-900">156</p>
                <p className="mt-1 text-xs text-cyan-600">+12 from yesterday</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
