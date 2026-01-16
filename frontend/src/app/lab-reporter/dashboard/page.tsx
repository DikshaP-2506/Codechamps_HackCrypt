"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Upload,
  List,
  Search,
  CheckCircle2,
  XCircle,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
  BarChart3,
  Clock,
  AlertCircle,
  Plus,
  Download,
  Eye,
  Trash2,
  Edit,
  FileText,
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
      className="flex items-center justify-center rounded-full border border-gray-200 bg-gradient-to-br from-teal-100 to-teal-50 font-mono font-semibold text-teal-700"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

// Sidebar Component
function Sidebar({ active }: { active: string }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/lab-reporter/dashboard" },
    { id: "upload", label: "Upload Reports", icon: Upload, href: "/lab-reporter/upload" },
    { id: "my-uploads", label: "My Uploads", icon: List, href: "/lab-reporter/my-uploads" },
    { id: "pending", label: "Pending Review", icon: Clock, href: "/lab-reporter/pending" },
    { id: "verified", label: "Verified Reports", icon: CheckCircle2, href: "/lab-reporter/verified" },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "/lab-reporter/analytics" },
    { id: "settings", label: "Settings", icon: Settings, href: "/lab-reporter/settings" },
  ];

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-gradient-to-b from-teal-700 to-teal-800 text-white">
      {/* Profile Section */}
      <div className="border-b border-teal-600 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Avatar name="John Smith" size={48} />
          <div className="flex-1">
            <p className="font-semibold text-white">John Smith</p>
            <p className="text-xs text-teal-200">Lab Technician</p>
            <span className="mt-1 inline-block rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
              ID #LR-2847
            </span>
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
                    ? "bg-emerald-600 text-white"
                    : "text-teal-100 hover:bg-teal-600/50"
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
      <div className="border-t border-teal-600 p-4">
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
  variant = "default",
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "warning" | "error" | "success";
}) {
  const bgColors = {
    default: "bg-teal-100 text-teal-700",
    warning: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-700",
    success: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`mt-2 text-3xl font-bold ${variant === "warning" ? "text-amber-600" : variant === "error" ? "text-red-600" : variant === "success" ? "text-emerald-600" : "text-teal-700"}`}>
            {value}
          </p>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${bgColors[variant]}`}>
          {Icon}
        </div>
      </div>
    </div>
  );
}

// Report Card Component
function ReportCard({
  patientName,
  patientId,
  reportType,
  uploadedDate,
  status,
  fileSize,
}: {
  patientName: string;
  patientId: string;
  reportType: string;
  uploadedDate: string;
  status: "verified" | "pending" | "rejected" | "processing";
  fileSize: string;
}) {
  const statusConfig = {
    verified: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Verified" },
    pending: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" },
    rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
    processing: { bg: "bg-blue-100", text: "text-blue-700", label: "Processing" },
  };

  const config = statusConfig[status];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-teal-600" />
          <div>
            <p className="font-semibold text-gray-900">{reportType}</p>
            <p className="text-sm text-gray-600">{patientName} ({patientId})</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{uploadedDate}</span>
        <span>{fileSize}</span>
      </div>
    </div>
  );
}

// Main Lab Reporter Dashboard Component
export default function LabReporterDashboard() {
  const [notificationCount] = useState(3);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Mock data
  const recentUploads = [
    {
      id: 1,
      patientName: "John Doe",
      patientId: "P-12847",
      reportType: "Blood Test - Complete Panel",
      uploadedDate: "2 hours ago",
      status: "verified" as const,
      fileSize: "2.3 MB",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      patientId: "P-13892",
      reportType: "X-Ray Chest PA View",
      uploadedDate: "4 hours ago",
      status: "pending" as const,
      fileSize: "1.8 MB",
    },
    {
      id: 3,
      patientName: "Robert Johnson",
      patientId: "P-14523",
      reportType: "MRI Brain with Contrast",
      uploadedDate: "1 day ago",
      status: "verified" as const,
      fileSize: "45.2 MB",
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
                placeholder="Search by patient name, ID, or report type..."
                className="flex-1 border-none bg-transparent text-sm outline-none"
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Quick Upload */}
              <button className="flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700">
                <Upload className="h-4 w-4" />
                Quick Upload
              </button>

              {/* Notifications */}
              <button className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
                <Bell className="h-6 w-6" />
                {notificationCount > 0 && (
                  <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {notificationCount}
                  </div>
                )}
              </button>

              {/* Help */}
              <button className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
                <HelpCircle className="h-6 w-6" />
              </button>

              {/* Profile Avatar */}
              <div className="rounded-full border-2 border-teal-200">
                <Avatar name="John Smith" size={40} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">Welcome back! Here's your activity overview.</p>
          </div>

          {/* Metrics Row */}
          <div className="mb-8 grid grid-cols-4 gap-6">
            <MetricCard
              icon={<Upload className="h-6 w-6" />}
              title="Total Uploads"
              value="1,247"
              subtitle="+23 this week"
              variant="default"
            />
            <MetricCard
              icon={<Clock className="h-6 w-6" />}
              title="Pending Verification"
              value="34"
              subtitle="Action required"
              variant="warning"
            />
            <MetricCard
              icon={<CheckCircle2 className="h-6 w-6" />}
              title="Verified Today"
              value="89"
              subtitle="98.5% accuracy"
              variant="success"
            />
            <MetricCard
              icon={<XCircle className="h-6 w-6" />}
              title="Rejected Reports"
              value="3"
              subtitle="Review required"
              variant="error"
            />
          </div>

          {/* Recent Uploads & Quick Stats */}
          <div className="mb-8 grid grid-cols-3 gap-6">
            {/* Recent Uploads */}
            <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Recent Uploads</h2>
                <Link href="/lab-reporter/my-uploads" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                {recentUploads.map((report) => (
                  <div key={report.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4 hover:bg-gray-100 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{report.reportType}</p>
                        <p className="text-sm text-gray-600">Patient: {report.patientName} ({report.patientId})</p>
                        <p className="mt-2 text-xs text-gray-500">Uploaded: {report.uploadedDate} • {report.fileSize}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          report.status === "verified"
                            ? "bg-emerald-100 text-emerald-700"
                            : report.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {report.status === "verified" ? "✓ Verified" : report.status === "pending" ? "⏳ Pending" : "❌ Rejected"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="text-xs font-medium text-gray-600 hover:text-gray-900">
                        <Eye className="inline h-4 w-4 mr-1" />
                        View
                      </button>
                      <button className="text-xs font-medium text-gray-600 hover:text-gray-900">
                        <Download className="inline h-4 w-4 mr-1" />
                        Download
                      </button>
                      <button className="text-xs font-medium text-gray-600 hover:text-gray-900">
                        <Edit className="inline h-4 w-4 mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold text-gray-900">Quick Stats</h2>

              {/* Upload Progress */}
              <div className="mb-6 rounded-lg bg-gradient-to-br from-teal-50 to-emerald-50 p-4 text-center">
                <p className="text-sm text-gray-700">This Week's Activity</p>
                <p className="mt-3 text-3xl font-bold text-teal-700">78%</p>
                <p className="mt-2 text-xs text-gray-600">89 / 115 reports</p>
                <div className="mt-3 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-teal-600 to-emerald-600" />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Quick Actions</p>
                <button className="w-full rounded-lg bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 p-3 text-sm font-medium text-teal-700 hover:bg-teal-100 transition">
                  <Upload className="inline h-4 w-4 mr-2" />
                  Upload Report
                </button>
                <button className="w-full rounded-lg bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 p-3 text-sm font-medium text-teal-700 hover:bg-teal-100 transition">
                  <BarChart3 className="inline h-4 w-4 mr-2" />
                  View Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Verification Status Overview */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-gray-900">Verification Status</h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Verified", count: 856, color: "bg-emerald-500" },
                { label: "Pending", count: 34, color: "bg-amber-500" },
                { label: "Rejected", count: 12, color: "bg-red-500" },
                { label: "Processing", count: 18, color: "bg-blue-500" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{item.label}</p>
                      <p className="mt-2 text-2xl font-bold text-gray-900">{item.count}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-lg ${item.color} opacity-20`} />
                  </div>
                  <div className="mt-3 h-1 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${(item.count / 920) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
