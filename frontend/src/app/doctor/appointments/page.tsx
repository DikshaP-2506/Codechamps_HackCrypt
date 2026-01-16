"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
  Menu,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  Clock,
  MapPin,
  Phone,
  Mail,
  Video as VideoIcon,
  X,
  ChevronDown,
} from "lucide-react";

type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show";

type Appointment = {
  id: string;
  dayKey: string; // e.g., "mon"
  dateLabel: string; // e.g., "Mon 13"
  start: string; // HH:MM 24h
  end: string; // HH:MM 24h
  patientName: string;
  patientId: string;
  type: "Consultation" | "Follow-up" | "Therapy" | "Check-up";
  location: { mode: "clinic" | "virtual"; detail: string };
  status: AppointmentStatus;
  phone: string;
  email: string;
  reason: string;
  notes?: string;
  primaryCondition?: string;
};

type AppointmentRequest = {
  id: string;
  patientName: string;
  patientId: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  type: "Consultation" | "Follow-up" | "Therapy" | "Check-up";
  location: "clinic" | "virtual";
  reason: string;
  notes?: string;
  primaryCondition?: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
};

const dayOrder = [
  { key: "mon", label: "Mon 13" },
  { key: "tue", label: "Tue 14" },
  { key: "wed", label: "Wed 15" },
  { key: "thu", label: "Thu 16" },
  { key: "fri", label: "Fri 17" },
  { key: "sat", label: "Sat 18" },
];

const appointmentsMock: Appointment[] = [
  {
    id: "a1",
    dayKey: "mon",
    dateLabel: "Mon 13",
    start: "10:00",
    end: "10:30",
    patientName: "John Smith",
    patientId: "PT-1234",
    type: "Consultation",
    location: { mode: "clinic", detail: "Clinic Room 3" },
    status: "confirmed",
    phone: "+91 98765 43210",
    email: "john.smith@email.com",
    reason: "Routine blood sugar check",
    notes: "Prefers morning slots",
    primaryCondition: "Type 2 Diabetes",
  },
  {
    id: "a2",
    dayKey: "tue",
    dateLabel: "Tue 14",
    start: "11:00",
    end: "12:00",
    patientName: "Alicia Patel",
    patientId: "PT-2031",
    type: "Therapy",
    location: { mode: "virtual", detail: "Video" },
    status: "scheduled",
    phone: "+91 99887 77665",
    email: "alicia.patel@email.com",
    reason: "CBT session",
    notes: "Send join link 30 mins before",
    primaryCondition: "Anxiety",
  },
  {
    id: "a3",
    dayKey: "thu",
    dateLabel: "Thu 16",
    start: "09:30",
    end: "10:15",
    patientName: "Michael Chen",
    patientId: "PT-1120",
    type: "Follow-up",
    location: { mode: "clinic", detail: "Clinic Room 1" },
    status: "confirmed",
    phone: "+91 90123 45678",
    email: "michael.chen@email.com",
    reason: "BP review",
    primaryCondition: "Hypertension",
  },
  {
    id: "a4",
    dayKey: "thu",
    dateLabel: "Thu 16",
    start: "14:00",
    end: "14:45",
    patientName: "Sara Lee",
    patientId: "PT-1402",
    type: "Check-up",
    location: { mode: "virtual", detail: "Teleconsultation" },
    status: "scheduled",
    phone: "+91 91234 88877",
    email: "sara.lee@email.com",
    reason: "Lab results review",
    primaryCondition: "Thyroid",
  },
  {
    id: "a5",
    dayKey: "fri",
    dateLabel: "Fri 17",
    start: "16:00",
    end: "16:30",
    patientName: "David Kim",
    patientId: "PT-5566",
    type: "Consultation",
    location: { mode: "clinic", detail: "Clinic Room 2" },
    status: "completed",
    phone: "+91 90909 11122",
    email: "david.kim@email.com",
    reason: "Chest discomfort follow-up",
    primaryCondition: "Cardiac",
  },
  {
    id: "a6",
    dayKey: "sat",
    dateLabel: "Sat 18",
    start: "12:30",
    end: "13:00",
    patientName: "Priya Nair",
    patientId: "PT-7788",
    type: "Follow-up",
    location: { mode: "clinic", detail: "Clinic Room 4" },
    status: "no-show",
    phone: "+91 97654 32100",
    email: "priya.nair@email.com",
    reason: "Post-op review",
    primaryCondition: "Ortho",
  },
];

const appointmentRequestsMock: AppointmentRequest[] = [
  {
    id: "req1",
    patientName: "Emma Watson",
    patientId: "PT-3344",
    phone: "+91 92345 67890",
    email: "emma.watson@email.com",
    preferredDate: "2026-01-20",
    preferredTime: "09:00",
    type: "Consultation",
    location: "clinic",
    reason: "Chest pain evaluation",
    notes: "Available mostly mornings",
    primaryCondition: "Cardiac",
    requestedAt: "2026-01-15 14:30",
    status: "pending",
  },
  {
    id: "req2",
    patientName: "Robert Wilson",
    patientId: "PT-4455",
    phone: "+91 93456 78901",
    email: "robert.wilson@email.com",
    preferredDate: "2026-01-22",
    preferredTime: "14:00",
    type: "Follow-up",
    location: "virtual",
    reason: "Follow-up on diabetes management",
    primaryCondition: "Type 2 Diabetes",
    requestedAt: "2026-01-14 10:15",
    status: "pending",
  },
  {
    id: "req3",
    patientName: "Linda Martinez",
    patientId: "PT-5566",
    phone: "+91 94567 89012",
    email: "linda.martinez@email.com",
    preferredDate: "2026-01-19",
    preferredTime: "11:00",
    type: "Therapy",
    location: "virtual",
    reason: "Mental health counseling session",
    notes: "Prefers afternoon slots if possible",
    primaryCondition: "Depression",
    requestedAt: "2026-01-16 09:00",
    status: "pending",
  },
];

const statusColors: Record<AppointmentStatus, string> = {
  scheduled: "border-blue-500 bg-blue-50",
  confirmed: "border-emerald-600 bg-emerald-50",
  completed: "border-gray-500 bg-gray-100",
  cancelled: "border-red-500 bg-red-50",
  "no-show": "border-yellow-500 bg-yellow-50",
};

const statusBadge: Record<AppointmentStatus, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  completed: "bg-gray-200 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
  "no-show": "bg-yellow-100 text-yellow-700",
};

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex items-center justify-center rounded-full border border-purple-200 bg-gradient-to-br from-purple-100 to-purple-50 font-mono font-semibold text-purple-700"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

function Sidebar() {
  const navItems = [
    { label: "Dashboard", icon: Home, href: "/doctor/dashboard" },
    { label: "Patients", icon: Users, href: "/doctor/patients" },
    { label: "Appointments", icon: Calendar, href: "/doctor/appointments" },
    { label: "Analytics", icon: BarChart2, href: "/doctor/analytics" },
    { label: "Documents", icon: FileText, href: "/doctor/documents" },
    { label: "Prescriptions", icon: Pill, href: "/doctor/prescriptions" },
    { label: "Treatment Plans", icon: Target, href: "/doctor/treatment-plans" },
    { label: "Consultations", icon: Video, href: "/doctor/consultations" },
    { label: "Resources", icon: Heart, href: "/doctor/resources" },
    { label: "Settings", icon: Settings, href: "/doctor/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col bg-gradient-to-b from-purple-800 to-purple-900 md:flex">
      <div className="border-b border-purple-700 px-5 py-6">
        <div className="flex items-center gap-3">
          <Avatar name="Dr. Sarah Johnson" size={52} />
          <div>
            <p className="text-sm font-semibold text-white">Dr. Sarah Johnson</p>
            <p className="text-xs text-purple-200">Cardiologist</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition text-purple-100 hover:bg-purple-700/60 ${
              label === "Appointments" ? "bg-purple-700 text-white" : ""
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-purple-700 p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 py-3 text-red-300 transition hover:bg-red-500 hover:text-white">
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

function TopBar({ onOpenNew }: { onOpenNew: () => void }) {
  return (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3 flex-1">
          <button className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100 md:hidden">
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-emerald-200 bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-200">
              Day
            </button>
            <button className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700">
              Week
            </button>
            <button className="rounded-lg border border-emerald-200 bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-200">
              Month
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center gap-3">
          <button className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-lg font-bold text-gray-900">January 13-19, 2026</div>
          <button className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100">
            <ChevronRight className="h-5 w-5" />
          </button>
          <button className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">
            Today
          </button>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="relative hidden w-64 lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>

          <button
            onClick={onOpenNew}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            New Appointment
          </button>

          <div className="relative">
            <button className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
              <Bell className="h-6 w-6" />
            </button>
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTimeRange(start: string, end: string) {
  const to12 = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
  };
  return `${to12(start)} - ${to12(end)}`;
}

function AppointmentCard({
  appt,
  top,
  height,
  onSelect,
}: {
  appt: Appointment;
  top: number;
  height: number;
  onSelect: (a: Appointment) => void;
}) {
  const statusBorderColor =
    appt.status === "confirmed"
      ? "border-emerald-500"
      : appt.status === "scheduled"
      ? "border-blue-500"
      : appt.status === "completed"
      ? "border-gray-400"
      : appt.status === "cancelled"
      ? "border-red-500"
      : "border-yellow-500";

  const statusBgColor =
    appt.status === "confirmed"
      ? "bg-emerald-50 hover:bg-emerald-100"
      : appt.status === "scheduled"
      ? "bg-blue-50 hover:bg-blue-100"
      : appt.status === "completed"
      ? "bg-gray-50 hover:bg-gray-100"
      : appt.status === "cancelled"
      ? "bg-red-50 hover:bg-red-100"
      : "bg-yellow-50 hover:bg-yellow-100";

  const statusDot =
    appt.status === "confirmed"
      ? "bg-emerald-500"
      : appt.status === "scheduled"
      ? "bg-blue-500"
      : appt.status === "completed"
      ? "bg-gray-400"
      : appt.status === "cancelled"
      ? "bg-red-500"
      : "bg-yellow-500";

  const isVirtual = appt.location.mode === "virtual";
  const badgeClass =
    appt.type === "Consultation"
      ? "bg-blue-100 text-blue-700"
      : appt.type === "Follow-up"
      ? "bg-emerald-100 text-emerald-700"
      : appt.type === "Therapy"
      ? "bg-purple-100 text-purple-700"
      : "bg-teal-100 text-teal-700";

  const typeIcon =
    appt.type === "Consultation"
      ? "🩺"
      : appt.type === "Follow-up"
      ? "🔄"
      : appt.type === "Therapy"
      ? "🧠"
      : "✅";

  return (
    <button
      onClick={() => onSelect(appt)}
      className={`absolute left-0.5 right-0.5 rounded-lg border-2 ${statusBorderColor} p-2 text-left shadow-md transition hover:shadow-lg hover:scale-105 hover:z-10 cursor-pointer ${statusBgColor} overflow-hidden`}
      style={{ top, height }}
      title={`${appt.patientName} • ${formatTimeRange(appt.start, appt.end)}`}
    >
      {/* Status dot - positioned top right */}
      <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
        <span className={`h-2 w-2 rounded-full ${statusDot} shadow-sm`} />
      </div>

      {/* Time - Bold and compact */}
      <div className="mb-1 pr-6">
        <span className="text-xs font-bold text-gray-900 leading-tight">
          {formatTimeRange(appt.start, appt.end)}
        </span>
      </div>

      {/* Patient info - Compact with initials */}
      <div className="mb-1 flex items-center gap-1.5 min-w-0">
        <div className="h-5 w-5 flex-shrink-0 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 text-[8px] font-bold leading-5 text-white flex items-center justify-center">
          {appt.patientName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold text-gray-900">{appt.patientName}</p>
        </div>
      </div>

      {/* Type badge and location - More compact */}
      <div className="flex items-center justify-between gap-0.5 text-[9px]">
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-1 py-0.5 whitespace-nowrap font-semibold ${badgeClass}`}
        >
          <span>{typeIcon}</span>
          <span className="max-w-[60px] truncate">{appt.type}</span>
        </span>
        <div className="flex items-center gap-0.5 text-gray-600 whitespace-nowrap">
          {isVirtual ? (
            <>
              <VideoIcon className="h-2.5 w-2.5" />
              <span className="hidden sm:inline">V</span>
            </>
          ) : (
            <>
              <MapPin className="h-2.5 w-2.5" />
              <span className="hidden sm:inline">C</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}

function RightSidebar() {
  const progress = 3;
  const total = 8;
  const pct = Math.round((progress / total) * 100);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (pct / 100) * circumference;

  const upcoming = [
    {
      date: "FRI",
      dayNum: "17",
      month: "Jan",
      name: "John Smith",
      time: "10:00 AM",
      type: "Consultation",
      location: "Clinic Room 3",
      virtual: false,
    },
    {
      date: "SAT",
      dayNum: "18",
      month: "Jan",
      name: "Sara Lee",
      time: "02:00 PM",
      type: "Follow-up",
      location: "Teleconsultation",
      virtual: true,
    },
    {
      date: "MON",
      dayNum: "20",
      month: "Jan",
      name: "David Kim",
      time: "11:30 AM",
      type: "Therapy",
      location: "Virtual",
      virtual: true,
    },
  ];

  return (
    <aside className="w-full max-w-sm space-y-4">
      <div className="rounded-2xl border-2 border-gray-300 bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Today's Overview - Jan 16</h3>
            <p className="text-sm text-gray-600">6 hours booked / 8 hours available</p>
          </div>
          <div className="relative h-20 w-20">
            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="36" stroke="#E5E7EB" strokeWidth="8" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="36"
                stroke="#059669"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="none"
                className="transition-all"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div>
                <div className="text-xl font-bold text-gray-900">{progress}/{total}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-emerald-50 px-3 py-3 border border-emerald-100">
            <p className="text-gray-600 text-xs font-semibold">Total Appointments</p>
            <p className="text-lg font-bold text-gray-900 mt-1">8</p>
          </div>
          <div className="rounded-xl bg-blue-50 px-3 py-3 border border-blue-100">
            <p className="text-gray-600 text-xs font-semibold">Upcoming</p>
            <p className="text-lg font-bold text-blue-700 mt-1">5</p>
          </div>
          <div className="rounded-xl bg-gray-100 px-3 py-3 border border-gray-200">
            <p className="text-gray-600 text-xs font-semibold">Completed</p>
            <p className="text-lg font-bold text-gray-800 mt-1">3</p>
          </div>
          <div className="rounded-xl bg-red-50 px-3 py-3 border border-red-100">
            <p className="text-gray-600 text-xs font-semibold">No-shows</p>
            <p className="text-lg font-bold text-red-700 mt-1">0</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-gray-300 bg-white p-6 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Next 7 Days</h3>
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">
            Next 7 days
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {upcoming.map((item, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-3 rounded-xl border-2 border-gray-200 p-3 transition hover:border-emerald-400 hover:shadow-md hover:bg-emerald-50/30"
            >
              <div className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 px-3 py-2 text-center border border-emerald-200">
                <div className="text-xs font-bold text-emerald-700">{item.date}</div>
                <div className="text-xl font-bold text-gray-900">{item.dayNum}</div>
                <div className="text-xs text-gray-600">{item.month}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar name={item.name} size={32} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-600">{item.type}</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-800">{item.time}</div>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                  {item.virtual ? <VideoIcon className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                  <span>{item.location}</span>
                </div>
                <div className="mt-2 hidden items-center gap-2 text-xs text-emerald-700 group-hover:flex">
                  {item.virtual && (
                    <span className="flex items-center gap-1">
                      <VideoIcon className="h-4 w-4" />
                      Join
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <CalendarClock className="h-4 w-4" />
                    Reschedule
                  </span>
                  <span className="flex items-center gap-1 text-red-600">
                    <X className="h-4 w-4" />
                    Cancel
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border-2 border-gray-300 bg-white p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 border border-emerald-200">
            <span className="text-gray-700 font-semibold">This Week</span>
            <span className="font-bold text-emerald-700 text-base">42</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 border border-blue-200">
            <span className="text-gray-700 font-semibold">Utilization rate</span>
            <span className="font-bold text-blue-700 text-base">85%</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3 border border-gray-300">
            <span className="text-gray-700 font-semibold">Avg duration</span>
            <span className="font-bold text-gray-900 text-base">35 m</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-purple-50 px-4 py-3 border border-purple-200">
            <span className="text-gray-700 font-semibold">Most common</span>
            <span className="font-bold text-purple-700 text-base">45%</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function AppointmentDetailModal({
  appt,
  onClose,
}: {
  appt: Appointment | null;
  onClose: () => void;
}) {
  if (!appt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
            <p className="text-sm text-gray-600">
              {appt.patientName} • {appt.patientId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs uppercase text-gray-500">Date & Time</p>
              <p className="mt-1 font-semibold text-gray-900">
                Friday, January 17, 2026 at {formatTimeRange(appt.start, appt.end)}
              </p>
              <p className="text-xs text-gray-600">Duration: {timeToMinutes(appt.end) - timeToMinutes(appt.start)} minutes</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs uppercase text-gray-500">Status</p>
              <span className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[appt.status]}`}>
                {appt.status === "confirmed"
                  ? "Confirmed"
                  : appt.status === "scheduled"
                  ? "Scheduled"
                  : appt.status === "completed"
                  ? "Completed"
                  : appt.status === "cancelled"
                  ? "Cancelled"
                  : "No-show"}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Avatar name={appt.patientName} size={48} />
              <div>
                <p className="font-semibold text-gray-900">{appt.patientName}</p>
                <p className="text-sm text-gray-600">Phone: {appt.phone}</p>
                <p className="text-sm text-gray-600">Email: {appt.email}</p>
                {appt.primaryCondition && (
                  <p className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                    {appt.primaryCondition}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs uppercase text-gray-500">Location/Method</p>
              <div className="mt-1 flex items-center gap-2 text-gray-800">
                {appt.location.mode === "virtual" ? (
                  <>
                    <VideoIcon className="h-4 w-4" />
                    <span>Teleconsultation</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    <span>{appt.location.detail}</span>
                  </>
                )}
              </div>
              {appt.location.mode === "virtual" && (
                <p className="text-xs text-gray-600 mt-1">Meeting link will be shared</p>
              )}
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs uppercase text-gray-500">Type</p>
              <p className="mt-1 font-semibold text-gray-900">{appt.type}</p>
              <p className="text-xs text-gray-600">Reason: {appt.reason}</p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs uppercase text-gray-500">Reminders</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-700">
              <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">
                24 hours before (Email)
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">
                1 hour before (SMS)
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">
                Doctor reminder (30 mins)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
              {appt.location.mode === "virtual" ? "Join Consultation" : "Mark as Completed"}
            </button>
            <div className="flex gap-2">
              <button className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                Reschedule
              </button>
              <button className="flex-1 rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewAppointmentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Schedule New Appointment</h2>
            <p className="text-sm text-gray-600">Search by name, phone, or patient ID...</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gray-700">Patient</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Search by name, phone, or patient ID..."
                />
              </div>
              <div className="mt-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
                ⚠️ Allergic to: Penicillin (Severe)
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Appointment Type</label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {["Consultation", "Follow-up", "Therapy Session", "Check-up"].map((item) => (
                  <button
                    key={item}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-800 hover:border-emerald-400 hover:bg-emerald-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gray-700">Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-gray-700">Start Time</label>
                <input
                  type="time"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  defaultValue="10:00"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Duration</label>
                <select className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  {[15, 30, 45, 60].map((d) => (
                    <option key={d}>{d} mins</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gray-700">Location</label>
              <div className="mt-1 space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-800">
                  <input type="radio" name="location" defaultChecked />
                  🏥 In-clinic
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-800">
                  <input type="radio" name="location" />
                  💻 Virtual (Teleconsultation)
                </label>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Reminders</label>
              <div className="mt-1 space-y-1 text-sm text-gray-800">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked /> 24 hours before
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked /> 1 hour before
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> 10 minutes before
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">Reason for visit</label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="E.g., Routine diabetes check-up"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">
              Save as Draft
            </button>
            <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              Schedule Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentsMock);
  const [requests, setRequests] = useState<AppointmentRequest[]>(appointmentRequestsMock);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [openNewModal, setOpenNewModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showRequests, setShowRequests] = useState(false);

  const handleApproveRequest = (req: AppointmentRequest) => {
    // Convert request to scheduled appointment
    const dayMap: Record<string, string> = {
      "2026-01-19": "sun",
      "2026-01-20": "mon",
      "2026-01-21": "tue",
      "2026-01-22": "wed",
      "2026-01-23": "thu",
      "2026-01-24": "fri",
      "2026-01-25": "sat",
    };
    
    const dateObj = new Date(req.preferredDate);
    const dayKey = Object.entries(dayMap).find(([date]) => date === req.preferredDate)?.[1] || "mon";
    const dateLabel = dateObj.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
    
    // Calculate end time (30 min duration by default)
    const [hour, minute] = req.preferredTime.split(":").map(Number);
    const endHour = String(hour).padStart(2, "0");
    const endMinute = String(minute + 30).padStart(2, "0");
    const endTime = `${endHour}:${endMinute}`;
    
    const newAppt: Appointment = {
      id: `a-${Date.now()}`,
      dayKey,
      dateLabel: `${dateLabel}`,
      start: req.preferredTime,
      end: endTime,
      patientName: req.patientName,
      patientId: req.patientId,
      type: req.type,
      location: { mode: req.location, detail: req.location === "clinic" ? "Clinic Room" : "Virtual" },
      status: "confirmed",
      phone: req.phone,
      email: req.email,
      reason: req.reason,
      notes: req.notes,
      primaryCondition: req.primaryCondition,
    };
    
    setAppointments([...appointments, newAppt]);
    setRequests(requests.filter(r => r.id !== req.id));
  };

  const handleRejectRequest = (reqId: string) => {
    setRequests(requests.filter(r => r.id !== reqId));
  };

  const startHour = 9;
  const endHour = 18;
  const rowHeight = 64; // 64px per 30 minutes for better visibility
  const totalRows = (endHour - startHour) * 2;

  const grouped = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    dayOrder.forEach((d) => (map[d.key] = []));
    appointments.forEach((a) => {
      map[a.dayKey] = [...(map[a.dayKey] || []), a];
    });
    return map;
  }, [appointments]);

  const handleSlotClick = (dayKey: string, hour: number, half: 0 | 1) => {
    const minutes = hour * 60 + (half === 1 ? 30 : 0);
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const m = (minutes % 60).toString().padStart(2, "0");
    setSelectedSlot(`${dayKey.toUpperCase()} • ${h}:${m}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="md:pl-64">
        <TopBar onOpenNew={() => setOpenNewModal(true)} />

        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Requested Appointments Section */}
          {requests.length > 0 && (
            <div className="mb-6 rounded-2xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100/50 p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-300 text-sm font-bold text-yellow-900 shadow-md">
                    {requests.length}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Requested Appointments</h2>
                    <p className="text-sm text-gray-600">Patients awaiting your approval</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRequests(!showRequests)}
                  className="flex items-center gap-2 rounded-lg bg-yellow-200 px-4 py-2 text-sm font-bold text-yellow-900 transition hover:bg-yellow-300 hover:shadow-md"
                >
                  {showRequests ? "▼ Hide" : "▶ Show"} Requests
                </button>
              </div>

              {showRequests && (
                <div className="space-y-3">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-xl border-2 border-yellow-200 bg-white p-4 shadow-md hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar name={req.patientName} size={40} />
                            <div>
                              <p className="font-bold text-gray-900">{req.patientName}</p>
                              <p className="text-sm text-gray-600">{req.patientId}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-3">
                            <div className="rounded-lg bg-gray-50 px-3 py-2 border border-gray-200">
                              <p className="text-xs font-semibold text-gray-600 uppercase">Preferred Date</p>
                              <p className="text-sm font-bold text-gray-900 mt-1">
                                {new Date(req.preferredDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="rounded-lg bg-gray-50 px-3 py-2 border border-gray-200">
                              <p className="text-xs font-semibold text-gray-600 uppercase">Preferred Time</p>
                              <p className="text-sm font-bold text-gray-900 mt-1">{req.preferredTime}</p>
                            </div>
                            <div className="rounded-lg bg-blue-50 px-3 py-2 border border-blue-200">
                              <p className="text-xs font-semibold text-gray-600 uppercase">Type</p>
                              <p className="text-sm font-bold text-blue-700 mt-1">{req.type}</p>
                            </div>
                            <div className="rounded-lg bg-emerald-50 px-3 py-2 border border-emerald-200">
                              <p className="text-xs font-semibold text-gray-600 uppercase">Location</p>
                              <p className="text-sm font-bold text-emerald-700 mt-1">
                                {req.location === "clinic" ? "🏥 In-clinic" : "💻 Virtual"}
                              </p>
                            </div>
                          </div>

                          <div className="rounded-lg bg-gray-50 px-3 py-2 border border-gray-200">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Reason</p>
                            <p className="text-sm text-gray-700 mt-1 font-medium">{req.reason}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleApproveRequest(req)}
                            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 hover:shadow-lg"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="rounded-lg border-2 border-red-300 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 hover:border-red-400"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Calendar Section */}
          <div className="flex gap-6">
            <div className="flex-1 overflow-hidden rounded-2xl border-2 border-gray-300 bg-white shadow-xl">
              <div className="flex border-b-2 border-gray-300 bg-gradient-to-r from-gray-50 via-gray-50 to-gray-100 px-4 py-4 text-sm font-bold text-gray-900">
                <div className="w-20 flex-shrink-0" />
                <div className="flex-1 grid grid-cols-6 gap-1">
                  {dayOrder.map((d) => {
                    const isTodayCol = d.key === "thu";
                    return (
                      <div
                        key={d.key}
                        className={`flex flex-col items-center justify-between rounded-xl px-3 py-3 text-sm font-bold transition-all ${
                          isTodayCol
                            ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg border-2 border-emerald-500"
                            : "bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        <span className="font-bold">{d.label}</span>
                        {isTodayCol && (
                          <span className="mt-1 text-[9px] font-bold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full">
                            Today
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative">
                <div className="flex">
                  {/* Time column */}
                  <div className="w-20 flex-shrink-0 border-r-2 border-gray-300 bg-gradient-to-b from-gray-50 to-white">
                    {Array.from({ length: endHour - startHour + 1 }).map((_, idx) => {
                      const hour = startHour + idx;
                      const label = `${((hour + 11) % 12) + 1}:00 ${hour >= 12 ? "PM" : "AM"}`;
                      return (
                        <div
                          key={hour}
                          className="relative h-16 border-b border-gray-200 pr-2 text-right flex flex-col justify-between py-1"
                        >
                          <span className="text-[10px] font-bold text-gray-700 leading-tight">{label}</span>
                          <div className="text-[8px] text-gray-400 font-semibold leading-tight">{(idx + startHour) % 12 === 0 ? 12 : (idx + startHour) % 12}</div>
                        </div>
                      );
                    })}
                  </div>

                {/* Day columns */}
                <div className="flex-1 grid grid-cols-6 bg-gray-50">
                  {dayOrder.map((day) => {
                    const isTodayCol = day.key === "thu";
                    return (
                      <div 
                        key={day.key} 
                        className={`relative border-r transition-colors ${
                          isTodayCol 
                            ? "border-emerald-200 bg-emerald-50/30" 
                            : "border-gray-200 bg-white hover:bg-gray-50"
                        } last:border-r-0`}
                      >
                        {/* Hour lines */}
                        {Array.from({ length: endHour - startHour + 1 }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`relative h-16 cursor-pointer transition hover:bg-gray-100/50 ${
                              isTodayCol ? "hover:bg-emerald-100/50" : ""
                            }`}
                            onClick={() => handleSlotClick(day.key, startHour + idx, 0)}
                          >
                            {/* Half hour line - darker */}
                            <div
                              className={`absolute left-0 right-0 top-1/2 h-px transition ${
                                isTodayCol ? "bg-emerald-200" : "bg-gray-200"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSlotClick(day.key, startHour + idx, 1);
                              }}
                            />
                            
                            {/* Full hour line at bottom */}
                            <div
                              className={`absolute left-0 right-0 bottom-0 h-px transition ${
                                isTodayCol ? "bg-emerald-300" : "bg-gray-300"
                              }`}
                            />
                          </div>
                        ))}

                        {/* Appointments */}
                        {(grouped[day.key] || []).map((appt) => {
                          const startMins = timeToMinutes(appt.start);
                          const endMins = timeToMinutes(appt.end);
                          const offset = startMins - startHour * 60;
                          const duration = endMins - startMins;
                          const top = (offset / 30) * rowHeight;
                          const height = (duration / 30) * rowHeight;
                          return (
                            <AppointmentCard
                              key={appt.id}
                              appt={appt}
                              top={top}
                              height={height}
                              onSelect={setSelected}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedSlot && (
                <div className="absolute right-4 top-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow">
                  Quick schedule at {selectedSlot}
                </div>
              )}
            </div>
            </div>

            <RightSidebar />
          </div>
        </div>
      </div>

      <AppointmentDetailModal appt={selected} onClose={() => setSelected(null)} />
      <NewAppointmentModal open={openNewModal} onClose={() => setOpenNewModal(false)} />
    </div>
  );
}
