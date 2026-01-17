"use client";

import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Home,
  Activity,
  Pill,
  Calendar,
  Folder,
  MessageCircle,
  Users,
  Video,
  Settings,
  LogOut,
  BookOpen,
  Check,
  Clock,
  X,
  AlertCircle,
  Camera,
  ChevronDown,
  ChevronUp,
  Flame,
  ScanLine,
} from "lucide-react";
import { PatientTopBar } from "@/components/PatientTopBar";
import { Sidebar } from "@/components/Sidebar";

// Medication Card Component
function MedicationCard({
  medication,
}: {
  medication: {
    id: number;
    name: string;
    dosage: string;
    timing: string;
    instructions: string;
    status: "pending" | "taken" | "missed";
    color: string;
  };
}) {
  const [status, setStatus] = useState(medication.status);
  const [showSnooze, setShowSnooze] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [skipReason, setSkipReason] = useState("");

  const statusConfig = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending", icon: Clock },
    taken: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Taken", icon: Check },
    missed: { bg: "bg-red-100", text: "text-red-700", label: "Missed", icon: AlertCircle },
  };

  const config = statusConfig[status];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        {/* Left Section */}
        <div className="flex gap-4">
          {/* Pill Icon */}
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ backgroundColor: medication.color + "20" }}
          >
            <Pill
              className="h-7 w-7"
              style={{ color: medication.color }}
            />
          </div>

          {/* Medication Info */}
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{medication.name}</h3>
            <p className="text-sm text-gray-600">{medication.dosage}</p>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {medication.timing}
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
              >
                {config.label}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600 italic">{medication.instructions}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {status === "pending" && (
        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
          <div className="flex gap-2">
            <button
              onClick={() => setStatus("taken")}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Check className="mr-1 inline h-4 w-4" />
              Mark as Taken
            </button>
            <button
              onClick={() => setShowSnooze(!showSnooze)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Clock className="mr-1 inline h-4 w-4" />
              Snooze
            </button>
            <button
              onClick={() => setShowSkip(!showSkip)}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <X className="mr-1 inline h-4 w-4" />
              Skip
            </button>
          </div>

          {/* Snooze Options */}
          {showSnooze && (
            <div className="flex gap-2 rounded-lg bg-gray-50 p-3">
              <span className="text-sm font-medium text-gray-700">Snooze for:</span>
              <button className="rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100">
                15 mins
              </button>
              <button className="rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100">
                30 mins
              </button>
              <button className="rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100">
                60 mins
              </button>
            </div>
          )}

          {/* Skip Reason */}
          {showSkip && (
            <div className="space-y-2 rounded-lg bg-red-50 p-3">
              <label className="block text-sm font-medium text-gray-700">
                Reason for skipping:
              </label>
              <select
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="">Select a reason</option>
                <option value="side-effects">Experiencing side effects</option>
                <option value="forgot">Forgot to take it</option>
                <option value="unavailable">Medication unavailable</option>
                <option value="feeling-better">Feeling better</option>
                <option value="other">Other</option>
              </select>
              <button
                onClick={() => {
                  if (skipReason) setStatus("missed");
                }}
                disabled={!skipReason}
                className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-gray-300"
              >
                Confirm Skip
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Adherence Calendar Component
function AdherenceCalendar() {
  const [showDetails, setShowDetails] = useState(false);

  // Generate last 30 days data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const statuses = ["taken", "missed", "skipped"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: i < 7 ? "taken" : status, // Last 7 days taken for streak
    };
  });

  const takenDays = last30Days.filter((d) => d.status === "taken").length;
  const adherencePercentage = Math.round((takenDays / 30) * 100);
  const currentStreak = 7; // Mock streak

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Adherence Calendar</h2>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          {showDetails ? "Hide" : "View"} Details
          {showDetails ? (
            <ChevronUp className="ml-1 inline h-4 w-4" />
          ) : (
            <ChevronDown className="ml-1 inline h-4 w-4" />
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-emerald-50 p-4 text-center">
          <p className="text-3xl font-bold text-emerald-700">{adherencePercentage}%</p>
          <p className="text-xs text-gray-600">Adherence Rate</p>
        </div>
        <div className="rounded-lg bg-orange-50 p-4 text-center">
          <p className="text-3xl font-bold text-orange-700">{takenDays}/30</p>
          <p className="text-xs text-gray-600">Days Taken</p>
        </div>
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <p className="text-3xl font-bold text-red-700">{currentStreak}</p>
            <Flame className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-xs text-gray-600">Day Streak!</p>
        </div>
      </div>

      {/* Calendar Grid */}
      {showDetails && (
        <div>
          <div className="mb-2 flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              Taken
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              Missed
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-gray-400" />
              Skipped
            </div>
          </div>
          <div className="grid grid-cols-10 gap-2">
            {last30Days.map((day, idx) => {
              const colors = {
                taken: "bg-emerald-500",
                missed: "bg-red-500",
                skipped: "bg-gray-400",
              };
              return (
                <div
                  key={idx}
                  className="group relative aspect-square cursor-pointer"
                  title={`${day.date} - ${day.status}`}
                >
                  <div
                    className={`h-full w-full rounded-lg ${colors[day.status as keyof typeof colors]} transition hover:scale-110`}
                  />
                  <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                    {day.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Pill Scan Component
function PillScanFeature() {
  const [scanning, setScanning] = useState(false);

  return (
    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50">
        {scanning ? (
          <ScanLine className="h-10 w-10 animate-pulse text-emerald-600" />
        ) : (
          <Camera className="h-10 w-10 text-emerald-600" />
        )}
      </div>
      <h3 className="mb-2 font-bold text-gray-900">Pill Scan Feature</h3>
      <p className="mb-4 text-sm text-gray-600">
        Scan your pill to identify and confirm medication
      </p>
      <button
        onClick={() => setScanning(!scanning)}
        className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
      >
        {scanning ? "Scanning..." : "Scan Pill"}
      </button>
      {scanning && (
        <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-left">
          <p className="text-sm font-medium text-emerald-900">AI Recognition Active</p>
          <p className="text-xs text-gray-600 mt-1">
            Point your camera at the pill for automatic identification
          </p>
        </div>
      )}
    </div>
  );
}

// Reminder Settings Modal
function ReminderSettingsModal({
  isOpen,
  onClose,
  medication,
}: {
  isOpen: boolean;
  onClose: () => void;
  medication?: { name: string };
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Reminder Settings
            {medication && <span className="block text-sm font-normal text-gray-600 mt-1">{medication.name}</span>}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-4">
          {/* Custom Times */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Reminder Times
            </label>
            <div className="space-y-2">
              <input
                type="time"
                defaultValue="08:00"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <input
                type="time"
                defaultValue="14:00"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <input
                type="time"
                defaultValue="20:00"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button
              type="button"
              className="mt-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              + Add another time
            </button>
          </div>

          {/* Frequency */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Frequency
            </label>
            <select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
              <option>Every day</option>
              <option>Every other day</option>
              <option>Specific days of the week</option>
              <option>As needed</option>
            </select>
          </div>

          {/* Notification Preferences */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Notification Preferences
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Push notification</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Sound alert</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">SMS reminder</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Email reminder</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Medications Page Component
export default function PatientMedications() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [notificationCount] = useState(5);
  const [filterTab, setFilterTab] = useState<"today" | "week" | "all">("today");
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<{ name: string } | undefined>();
  const patientName = user?.fullName || "Patient";
  const patientImage = user?.imageUrl;

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/sign-in" });
  };

  // Mock medications data
  const allMedications = [
    {
      id: 1,
      name: "Metformin",
      dosage: "500mg",
      timing: "8:00 AM",
      instructions: "Take with breakfast",
      status: "pending" as const,
      color: "#3B82F6",
      day: "today",
    },
    {
      id: 2,
      name: "Lisinopril",
      dosage: "10mg",
      timing: "8:00 AM",
      instructions: "Take with water",
      status: "taken" as const,
      color: "#10B981",
      day: "today",
    },
    {
      id: 3,
      name: "Atorvastatin",
      dosage: "20mg",
      timing: "8:00 PM",
      instructions: "Take before bedtime",
      status: "pending" as const,
      color: "#8B5CF6",
      day: "today",
    },
    {
      id: 4,
      name: "Aspirin",
      dosage: "75mg",
      timing: "2:00 PM",
      instructions: "Take with food",
      status: "missed" as const,
      color: "#EF4444",
      day: "today",
    },
    {
      id: 5,
      name: "Vitamin D",
      dosage: "1000 IU",
      timing: "9:00 AM",
      instructions: "Take with breakfast",
      status: "pending" as const,
      color: "#F59E0B",
      day: "week",
    },
    {
      id: 6,
      name: "Omega-3",
      dosage: "1200mg",
      timing: "8:00 AM",
      instructions: "Take with food",
      status: "pending" as const,
      color: "#06B6D4",
      day: "week",
    },
  ];

  const filteredMedications = allMedications.filter((med) => {
    if (filterTab === "today") return med.day === "today";
    if (filterTab === "week") return med.day === "today" || med.day === "week";
    return true;
  });

  const todayStats = {
    total: allMedications.filter((m) => m.day === "today").length,
    taken: allMedications.filter((m) => m.day === "today" && m.status === "taken").length,
    pending: allMedications.filter((m) => m.day === "today" && m.status === "pending").length,
    missed: allMedications.filter((m) => m.day === "today" && m.status === "missed").length,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar active="medications" userName={patientName} userImage={patientImage} userRole="Patient" />

      {/* Main Content Area */}
      <div className="ml-64 flex-1">
        <PatientTopBar
          userName={patientName}
          userImage={patientImage}
          notificationCount={notificationCount}
          onLogout={handleLogout}
          searchPlaceholder="Search medications..."
        />

        {/* Main Content */}
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Pill className="h-7 w-7 text-emerald-600" />
                Medications
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Medication tracking and reminders
              </p>
            </div>
          </div>

          {/* Today's Stats */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-600">Total Today</p>
              <p className="text-2xl font-bold text-gray-900">{todayStats.total}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
              <p className="text-sm text-emerald-700">Taken</p>
              <p className="text-2xl font-bold text-emerald-700">{todayStats.taken}</p>
            </div>
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
              <p className="text-sm text-yellow-700">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{todayStats.pending}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
              <p className="text-sm text-red-700">Missed</p>
              <p className="text-2xl font-bold text-red-700">{todayStats.missed}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex rounded-lg border border-gray-300 bg-white p-1">
              <button
                onClick={() => setFilterTab("today")}
                className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
                  filterTab === "today"
                    ? "bg-emerald-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setFilterTab("week")}
                className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
                  filterTab === "week"
                    ? "bg-emerald-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setFilterTab("all")}
                className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
                  filterTab === "all"
                    ? "bg-emerald-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                All
              </button>
            </div>
            <button
              onClick={() => setShowReminderSettings(true)}
              className="ml-auto flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
              Reminder Settings
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column - Medications List */}
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  {filterTab === "today" ? "Today's" : filterTab === "week" ? "This Week's" : "All"} Medications ({filteredMedications.length})
                </h2>
                <div className="space-y-4">
                  {filteredMedications.map((medication) => (
                    <MedicationCard key={medication.id} medication={medication} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Features */}
            <div className="space-y-6">
              {/* Pill Scan */}
              <PillScanFeature />

              {/* Adherence Calendar */}
              <AdherenceCalendar />
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <ReminderSettingsModal
        isOpen={showReminderSettings}
        onClose={() => setShowReminderSettings(false)}
        medication={selectedMedication}
      />
    </div>
  );
}
