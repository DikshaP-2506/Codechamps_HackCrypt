"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Activity,
  Pill,
  Bell,
  Calendar,
  Folder,
  MessageCircle,
  Users,
  User,
  Settings,
  LogOut,
  Search,
  BookOpen,
  Clock,
  Video,
  MapPin,
  ChevronDown,
  ChevronUp,
  Plus,
  LayoutGrid,
  List,
  X,
  Check,
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

// Appointment Card Component
function AppointmentCard({
  appointment,
  isPast = false,
}: {
  appointment: {
    id: number;
    date: string;
    time: string;
    doctor: { name: string; specialty: string };
    type: string;
    isVirtual: boolean;
    location?: string;
    canJoin?: boolean;
    status?: string;
    notes?: string;
  };
  isPast?: boolean;
}) {
  const [showReminders, setShowReminders] = useState(false);
  const [reminder24h, setReminder24h] = useState(true);
  const [reminder1h, setReminder1h] = useState(true);

  const typeColors: { [key: string]: string } = {
    Consultation: "bg-blue-100 text-blue-700",
    "Follow-up": "bg-purple-100 text-purple-700",
    Therapy: "bg-pink-100 text-pink-700",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center rounded-lg bg-emerald-100 px-4 py-3">
            <span className="text-xs font-medium text-emerald-700">
              {new Date(appointment.date).toLocaleDateString("en-US", { month: "short" })}
            </span>
            <span className="text-2xl font-bold text-emerald-700">
              {new Date(appointment.date).getDate()}
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{appointment.time}</p>
            <p className="text-sm text-gray-600">
              {new Date(appointment.date).toLocaleDateString("en-US", { weekday: "long" })}
            </p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeColors[appointment.type]}`}>
          {appointment.type}
        </span>
      </div>

      {/* Doctor Info */}
      <div className="mb-4 flex items-center gap-3 border-t border-gray-100 pt-4">
        <Avatar name={appointment.doctor.name} size={56} />
        <div>
          <p className="font-semibold text-gray-900">{appointment.doctor.name}</p>
          <p className="text-sm text-gray-600">{appointment.doctor.specialty}</p>
        </div>
      </div>

      {/* Location */}
      <div className="mb-4 flex items-center gap-2">
        {appointment.isVirtual ? (
          <>
            <Video className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Virtual Appointment</span>
          </>
        ) : (
          <>
            <MapPin className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-600">{appointment.location}</span>
          </>
        )}
      </div>

      {/* Past Appointment Notes */}
      {isPast && appointment.notes && (
        <div className="mb-4 rounded-lg bg-gray-50 p-3">
          <p className="mb-1 text-xs font-semibold text-gray-700">Doctor's Notes:</p>
          <p className="text-sm text-gray-600">{appointment.notes}</p>
        </div>
      )}

      {/* Actions */}
      {!isPast && (
        <>
          <div className="mb-3 flex gap-2">
            {appointment.canJoin && (
              <button className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                Join Now
              </button>
            )}
            <button className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              Reschedule
            </button>
            <button className="flex-1 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
              Cancel
            </button>
          </div>

          {/* Reminders */}
          <div>
            <button
              onClick={() => setShowReminders(!showReminders)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <Bell className="h-4 w-4" />
              Reminders
              {showReminders ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {showReminders && (
              <div className="mt-2 space-y-2 rounded-lg bg-gray-50 p-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reminder24h}
                    onChange={(e) => setReminder24h(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">24 hours before</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reminder1h}
                    onChange={(e) => setReminder1h(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">1 hour before</span>
                </label>
              </div>
            )}
          </div>
        </>
      )}

      {/* Past Status */}
      {isPast && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>Completed</span>
        </div>
      )}
    </div>
  );
}

// Calendar Component
function CalendarView({
  appointments,
}: {
  appointments: Array<{ date: string; id: number }>;
}) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const appointmentDates = appointments.map((apt) =>
    new Date(apt.date).toLocaleDateString()
  );

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          {new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-gray-600">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const dateStr = new Date(currentYear, currentMonth, day).toLocaleDateString();
          const hasAppointment = appointmentDates.includes(dateStr);
          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          return (
            <button
              key={day}
              className={`relative aspect-square rounded-lg border transition hover:bg-gray-50 ${
                isToday ? "border-emerald-600 bg-emerald-50 font-bold text-emerald-700" : "border-gray-200"
              }`}
            >
              <span className="text-sm">{day}</span>
              {hasAppointment && (
                <div className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-emerald-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Request Appointment Modal Component
function RequestAppointmentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Request New Appointment</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-4">
          {/* Doctor Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Preferred Doctor
            </label>
            <select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
              <option>Dr. Sarah Johnson - Cardiologist</option>
              <option>Dr. Michael Chen - General Physician</option>
              <option>Dr. Emily Roberts - Endocrinologist</option>
            </select>
          </div>

          {/* Appointment Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Appointment Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="in-person"
                  defaultChecked
                  className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">In-person</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="virtual"
                  className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Virtual</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="follow-up"
                  className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Follow-up</span>
              </label>
            </div>
          </div>

          {/* Preferred Dates */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Preferred Dates (select up to 3)
            </label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Preferred Time */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Preferred Time
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Morning (9-12)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Afternoon (12-3)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Evening (3-6)</span>
              </label>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Reason for Visit
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Please describe your symptoms or reason for the appointment..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Appointments Page Component
export default function PatientAppointments() {
  const [notificationCount] = useState(5);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [showPast, setShowPast] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const patientName = "Sarah Johnson";

  const upcomingAppointments = [
    {
      id: 1,
      date: "2026-01-17",
      time: "10:00 AM",
      doctor: { name: "Dr. Sarah Johnson", specialty: "Cardiologist" },
      type: "Consultation",
      isVirtual: true,
      canJoin: true,
    },
    {
      id: 2,
      date: "2026-01-20",
      time: "2:30 PM",
      doctor: { name: "Dr. Michael Chen", specialty: "General Physician" },
      type: "Follow-up",
      isVirtual: false,
      location: "City Health Clinic, 123 Medical Plaza, Suite 400",
    },
    {
      id: 3,
      date: "2026-01-25",
      time: "11:00 AM",
      doctor: { name: "Dr. Emily Roberts", specialty: "Endocrinologist" },
      type: "Therapy",
      isVirtual: true,
    },
  ];

  const pastAppointments = [
    {
      id: 4,
      date: "2026-01-10",
      time: "9:00 AM",
      doctor: { name: "Dr. Sarah Johnson", specialty: "Cardiologist" },
      type: "Consultation",
      isVirtual: false,
      location: "City Health Clinic",
      status: "Completed",
      notes: "Patient showed improvement in cardiovascular health. Continue current medication regimen.",
    },
    {
      id: 5,
      date: "2026-01-05",
      time: "3:00 PM",
      doctor: { name: "Dr. Michael Chen", specialty: "General Physician" },
      type: "Follow-up",
      isVirtual: true,
      status: "Completed",
      notes: "Routine checkup completed. All vitals within normal range.",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar active="appointments" />

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
                placeholder="Search appointments..."
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
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="h-7 w-7 text-emerald-600" />
                Appointments
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Schedule management and virtual consultations
              </p>
            </div>
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-emerald-700"
            >
              <Plus className="h-5 w-5" />
              Request Appointment
            </button>
          </div>

          {/* View Toggle */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex rounded-lg border border-gray-300 bg-white p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  viewMode === "list"
                    ? "bg-emerald-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <List className="h-4 w-4" />
                List View
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  viewMode === "calendar"
                    ? "bg-emerald-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Calendar View
              </button>
            </div>
          </div>

          {/* Calendar View */}
          {viewMode === "calendar" && (
            <div className="mb-8">
              <CalendarView appointments={upcomingAppointments} />
            </div>
          )}

          {/* List View - Upcoming Appointments */}
          {viewMode === "list" && (
            <>
              <div className="mb-8">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  Upcoming Appointments ({upcomingAppointments.length})
                </h2>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              </div>

              {/* Past Appointments */}
              <div className="mb-8">
                <button
                  onClick={() => setShowPast(!showPast)}
                  className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-emerald-600"
                >
                  Past Appointments ({pastAppointments.length})
                  {showPast ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                {showPast && (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {pastAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        isPast
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Request Appointment Modal */}
      <RequestAppointmentModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </div>
  );
}
