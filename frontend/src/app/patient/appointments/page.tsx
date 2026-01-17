"use client";

import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
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
import { PatientTopBar } from "@/components/PatientTopBar";
import { Sidebar } from "@/components/Sidebar";
import { RequestAppointmentModal } from "@/components/RequestAppointmentModal";
import PatientAppointmentList from "@/components/PatientAppointmentList";

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
// Main Appointments Page Component
export default function PatientAppointments() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [notificationCount] = useState(5);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [showPast, setShowPast] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const patientName = user?.fullName || "Patient";
  const patientImage = user?.imageUrl;

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/sign-in" });
  };

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
      <Sidebar active="appointments" userName={patientName} userImage={patientImage} userRole="Patient" />

      {/* Main Content Area */}
      <div className="ml-64 flex-1">
        <PatientTopBar
          userName={patientName}
          userImage={patientImage}
          notificationCount={notificationCount}
          onLogout={handleLogout}
          searchPlaceholder="Search appointments..."
        />

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

          {/* List View - Real Appointments from Database */}
          {viewMode === "list" && user?.id && (
            <div className="mb-8">
              <PatientAppointmentList patientId={user.id} />
            </div>
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
