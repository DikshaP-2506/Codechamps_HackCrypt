"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Home,
  Activity,
  Pill,
  Calendar,
  Folder,
  MessageCircle,
  Users,
  Settings,
  LogOut,
  BookOpen,
  Heart,
  TrendingUp,
  ArrowLeft,
  Download,
} from "lucide-react";
import { PatientTopBar } from "@/components/PatientTopBar";

interface VitalRecord {
  _id: string;
  systolic_bp?: number;
  diastolic_bp?: number;
  heart_rate?: number;
  blood_sugar?: number;
  respiratory_rate?: number;
  temperature?: number;
  spo2?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  recorded_at: string;
  notes?: string;
  measurement_method?: string;
}

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

function Sidebar({ userName, userImage }: { userName: string; userImage?: string }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/patient/dashboard" },
    { id: "health", label: "My Health", icon: Activity, href: "/patient/health", active: true },
    { id: "appointments", label: "Appointments", icon: Calendar, href: "/patient/appointments" },
    { id: "documents", label: "Documents", icon: Folder, href: "/patient/documents" },
    { id: "medications", label: "Medications", icon: Pill, href: "/patient/medications" },
    { id: "wellness", label: "Wellness Library", icon: BookOpen, href: "/patient/wellness" },
    { id: "chat", label: "Chat Support", icon: MessageCircle, href: "/patient/chat" },
    { id: "community", label: "Community", icon: Users, href: "/patient/community" },
  ];

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-60 flex-col border-r border-gray-200 bg-white md:flex">
      <div className="border-b border-gray-200 px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar name={userName} imageUrl={userImage} size={56} />
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-900">{userName}</h3>
            <p className="text-sm text-gray-600">Patient</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ id, label, icon: Icon, href, active }) => (
          <Link
            key={id}
            href={href}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4 space-y-2">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-red-600 transition hover:bg-red-50">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function VitalsDetailCard({ vital }: { vital: VitalRecord }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-600">{formatDate(vital.recorded_at)}</p>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {vital.measurement_method ? vital.measurement_method.replace("_", " ").toUpperCase() : "Manual Entry"}
        </span>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {vital.systolic_bp && (
            <div>
              <p className="text-xs text-gray-500">Blood Pressure</p>
              <p className="text-lg font-semibold text-gray-900">
                {vital.systolic_bp}/{vital.diastolic_bp} mmHg
              </p>
            </div>
          )}
          {vital.heart_rate && (
            <div>
              <p className="text-xs text-gray-500">Heart Rate</p>
              <p className="text-lg font-semibold text-gray-900">{vital.heart_rate} bpm</p>
            </div>
          )}
          {vital.blood_sugar && (
            <div>
              <p className="text-xs text-gray-500">Blood Sugar</p>
              <p className="text-lg font-semibold text-gray-900">{vital.blood_sugar.toFixed(1)} mg/dL</p>
            </div>
          )}
          {vital.respiratory_rate && (
            <div>
              <p className="text-xs text-gray-500">Respiratory Rate</p>
              <p className="text-lg font-semibold text-gray-900">{vital.respiratory_rate} breaths/min</p>
            </div>
          )}
          {vital.temperature && (
            <div>
              <p className="text-xs text-gray-500">Temperature</p>
              <p className="text-lg font-semibold text-gray-900">{vital.temperature.toFixed(1)} °F</p>
            </div>
          )}
          {vital.spo2 && (
            <div>
              <p className="text-xs text-gray-500">SpO2</p>
              <p className="text-lg font-semibold text-gray-900">{vital.spo2}%</p>
            </div>
          )}
          {vital.weight && (
            <div>
              <p className="text-xs text-gray-500">Weight & BMI</p>
              <p className="text-lg font-semibold text-gray-900">
                {vital.weight} kg (BMI: {vital.bmi?.toFixed(1)})
              </p>
            </div>
          )}
        </div>

        {vital.notes && (
          <div className="border-t border-gray-200 pt-3">
            <p className="text-xs text-gray-500 mb-1">Notes</p>
            <p className="text-sm text-gray-700">{vital.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VitalsHistory() {
  const { user } = useUser();
  const [vitals, setVitals] = useState<VitalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const fetchVitals = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/vitals?patient_id=${user.id}`);
      const result = await response.json();
      if (result.success) {
        setVitals(result.data);
      }
    } catch (error) {
      console.error("Error fetching vitals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVitals();
  }, [user?.id]);

  const sortedVitals = [...vitals].sort((a, b) => {
    const dateA = new Date(a.recorded_at).getTime();
    const dateB = new Date(b.recorded_at).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const userName = user?.fullName || "Patient";

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userName={userName} userImage={user?.imageUrl} />
      <PatientTopBar
        userName={userName}
        userImage={user?.imageUrl}
        notificationCount={0}
        onLogout={() => {}}
        searchPlaceholder="Search vitals..."
      />

      <main className="md:ml-60">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <Link
              href="/patient/health"
              className="mb-4 inline-flex items-center gap-2 text-emerald-600 transition hover:text-emerald-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Health</span>
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="h-8 w-8 text-emerald-600" />
                  Vitals History
                </h1>
                <p className="mt-1 text-gray-600">All your recorded health measurements</p>
              </div>
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50">
                <Download className="h-5 w-5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Filter and Sort */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Total Records:</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                {vitals.length}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortOrder("newest")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  sortOrder === "newest"
                    ? "bg-emerald-600 text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Newest First
              </button>
              <button
                onClick={() => setSortOrder("oldest")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  sortOrder === "oldest"
                    ? "bg-emerald-600 text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Oldest First
              </button>
            </div>
          </div>

          {/* Vitals List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-gray-500">Loading vitals history...</div>
            </div>
          ) : vitals.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <Heart className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-600">No vitals recorded yet</p>
              <p className="text-sm text-gray-500">
                Go back and log your first vitals to get started
              </p>
              <Link
                href="/patient/health"
                className="mt-4 inline-block rounded-lg bg-emerald-600 px-6 py-2 font-semibold text-white transition hover:bg-emerald-700"
              >
                Log Vitals
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedVitals.map((vital) => (
                <VitalsDetailCard key={vital._id} vital={vital} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
