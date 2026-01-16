"use client";

import { useState, useEffect } from "react";
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
  User,
  Settings,
  LogOut,
  BookOpen,
  Heart,
  TrendingUp,
  Thermometer,
  Droplets,
  Wind,
  Weight,
  Smile,
  Brain,
  Moon,
  Camera,
  Upload,
  Target,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Info,
  Plus,
  X,
  ArrowRight,
} from "lucide-react";
import { PatientTopBar } from "@/components/PatientTopBar";

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
function Sidebar({ active, userName, userImage }: { active: string; userName: string; userImage?: string }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/patient/dashboard" },
    { id: "health", label: "My Health", icon: Activity, href: "/patient/health" },
    { id: "appointments", label: "Appointments", icon: Calendar, href: "/patient/appointments" },
    { id: "documents", label: "Documents", icon: Folder, href: "/patient/documents" },
    { id: "medications", label: "Medications", icon: Pill, href: "/patient/medications" },
    { id: "wellness", label: "Wellness Library", icon: BookOpen, href: "/patient/wellness" },
    { id: "chat", label: "Chat Support", icon: MessageCircle, href: "/patient/chat" },
    { id: "community", label: "Community", icon: Users, href: "/patient/community" },
  ];

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white">
      {/* Profile Section */}
      <div className="border-b border-emerald-700 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Avatar name={userName} imageUrl={userImage} size={48} />
          <div className="flex-1">
            <p className="font-semibold text-white">{userName}</p>
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

// Vital Card Component
function VitalCard({
  icon: Icon,
  label,
  value,
  unit,
  status,
  lastLogged,
  trend,
}: {
  icon: any;
  label: string;
  value: string;
  unit: string;
  status: "normal" | "warning" | "critical" | "none";
  lastLogged: string;
  trend?: "up" | "down" | "stable";
}) {
  const statusColors = {
    normal: "bg-emerald-100 text-emerald-700 border-emerald-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    critical: "bg-red-100 text-red-700 border-red-200",
    none: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const statusIcons = {
    normal: CheckCircle2,
    warning: AlertCircle,
    critical: AlertCircle,
    none: Info,
  };

  const StatusIcon = statusIcons[status];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
            <Icon className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-xs text-gray-400">{lastLogged}</p>
          </div>
        </div>
        <span
          className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[status]}`}
        >
          <StatusIcon className="h-3 w-3" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{unit}</p>
      </div>
      {trend && (
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <TrendingUp className="h-3 w-3" />
          <span>Trending {trend}</span>
        </div>
      )}
    </div>
  );
}

// Mental Health Card Component
function MentalHealthCard({
  icon: Icon,
  label,
  value,
  status,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  status: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-xs text-gray-400">{status}</p>
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// Treatment Plan Card Component
function TreatmentPlanCard({
  name,
  progress,
  goals,
}: {
  name: string;
  progress: number;
  goals: string[];
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">Active Treatment</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {progress}% Complete
        </span>
      </div>
      <div className="mb-4">
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-emerald-600"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Goals & Milestones:</p>
        <ul className="space-y-2">
          {goals.map((goal, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-600" />
              <span>{goal}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Log Vitals Modal Component
function LogVitalsModal({
  isOpen,
  onClose,
  onSuccess,
  patientId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patientId?: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    recorded_at: new Date().toISOString().slice(0, 16),
    systolic_bp: "",
    diastolic_bp: "",
    heart_rate: "",
    blood_sugar: "",
    respiratory_rate: "",
    temperature: "",
    spo2: "",
    weight: "",
    height: "",
    notes: "",
  });

  const [bmi, setBmi] = useState<number | null>(null);

  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weightKg = parseFloat(formData.weight);
      if (heightInMeters > 0 && weightKg > 0) {
        const calculatedBmi = weightKg / (heightInMeters * heightInMeters);
        setBmi(parseFloat(calculatedBmi.toFixed(2)));
      }
    } else {
      setBmi(null);
    }
  }, [formData.height, formData.weight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        patient_id: patientId,
        recorded_by: patientId,
        recorded_at: formData.recorded_at,
        systolic_bp: formData.systolic_bp ? parseFloat(formData.systolic_bp) : null,
        diastolic_bp: formData.diastolic_bp ? parseFloat(formData.diastolic_bp) : null,
        heart_rate: formData.heart_rate ? parseFloat(formData.heart_rate) : null,
        blood_sugar: formData.blood_sugar ? parseFloat(formData.blood_sugar) : null,
        respiratory_rate: formData.respiratory_rate ? parseFloat(formData.respiratory_rate) : null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        spo2: formData.spo2 ? parseFloat(formData.spo2) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        bmi: bmi,
        measurement_method: "patient_sync",
        notes: formData.notes,
      };

      const response = await fetch("/api/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormData({
          recorded_at: new Date().toISOString().slice(0, 16),
          systolic_bp: "",
          diastolic_bp: "",
          heart_rate: "",
          blood_sugar: "",
          respiratory_rate: "",
          temperature: "",
          spo2: "",
          weight: "",
          height: "",
          notes: "",
        });
        setBmi(null);
        onClose();
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting vitals:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Log New Vitals</h2>
          <button
            onClick={onClose}
            className="text-gray-500 transition hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Date & Time
            </label>
            <input
              type="datetime-local"
              name="recorded_at"
              value={formData.recorded_at}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Systolic BP (mmHg)
              </label>
              <input
                type="number"
                name="systolic_bp"
                value={formData.systolic_bp}
                onChange={handleChange}
                placeholder="120"
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Diastolic BP (mmHg)
              </label>
              <input
                type="number"
                name="diastolic_bp"
                value={formData.diastolic_bp}
                onChange={handleChange}
                placeholder="80"
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                name="heart_rate"
                value={formData.heart_rate}
                onChange={handleChange}
                placeholder="72"
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Blood Sugar (mg/dL)
              </label>
              <input
                type="number"
                name="blood_sugar"
                value={formData.blood_sugar}
                onChange={handleChange}
                placeholder="100"
                step="0.1"
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Respiratory Rate (breaths/min)
              </label>
              <input
                type="number"
                name="respiratory_rate"
                value={formData.respiratory_rate}
                onChange={handleChange}
                placeholder="16"
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Temperature (°F)
              </label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="98.6"
                step="0.1"
                min="90"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                SpO2 (%)
              </label>
              <input
                type="number"
                name="spo2"
                value={formData.spo2}
                onChange={handleChange}
                placeholder="98"
                min="0"
                max="100"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="70"
                step="0.1"
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="170"
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          {bmi && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-sm font-medium text-emerald-800">
                BMI: <span className="text-lg font-bold">{bmi}</span>
              </p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes..."
              rows={3}
              maxLength={1000}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Saving..." : "Save Vitals"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Health Page Component
export default function PatientHealth() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [notificationCount] = useState(5);
  const [dateRange, setDateRange] = useState<"7" | "30" | "90">("7");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [latestVitals, setLatestVitals] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const patientName = user?.fullName || "Patient";
  const patientImage = user?.imageUrl;

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/sign-in" });
  };

  // Fetch latest vitals from MongoDB
  const fetchLatestVitals = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/vitals?patient_id=${user.id}`);
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setLatestVitals(result.data[0]);
      }
    } catch (error) {
      console.error("Error fetching vitals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestVitals();
  }, [user?.id]);

  const getVitalStatus = (name: string, value?: number): "normal" | "warning" | "critical" | "none" => {
    if (value === undefined || value === null) return "none";

    const ranges: Record<string, { normal: [number, number]; warning: [number, number] }> = {
      systolic_bp: { normal: [90, 130], warning: [130, 180] },
      diastolic_bp: { normal: [60, 85], warning: [85, 120] },
      heart_rate: { normal: [60, 100], warning: [100, 120] },
      blood_sugar: { normal: [70, 100], warning: [100, 200] },
      spo2: { normal: [95, 100], warning: [90, 95] },
      temperature: { normal: [97, 99], warning: [99, 101] },
    };

    const range = ranges[name];
    if (!range) return "normal";

    if (value >= range.normal[0] && value <= range.normal[1]) return "normal";
    if (value >= range.warning[0] && value <= range.warning[1]) return "warning";
    return "critical";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const vitalsData = [
    {
      icon: Heart,
      label: "Blood Pressure",
      value: latestVitals?.systolic_bp ? `${latestVitals.systolic_bp}/${latestVitals.diastolic_bp}` : "Not logged",
      unit: "mmHg",
      status: (latestVitals?.systolic_bp ? getVitalStatus("systolic_bp", latestVitals.systolic_bp) : "none") as "normal" | "warning" | "critical",
      lastLogged: latestVitals?.recorded_at ? formatDate(latestVitals.recorded_at) : "Never",
      trend: "stable" as const,
    },
    {
      icon: Droplets,
      label: "Blood Sugar",
      value: latestVitals?.blood_sugar ? latestVitals.blood_sugar.toFixed(1) : "Not logged",
      unit: "mg/dL",
      status: (latestVitals?.blood_sugar ? getVitalStatus("blood_sugar", latestVitals.blood_sugar) : "none") as "normal" | "warning" | "critical",
      lastLogged: latestVitals?.recorded_at ? formatDate(latestVitals.recorded_at) : "Never",
      trend: "stable" as const,
    },
    {
      icon: Activity,
      label: "Heart Rate",
      value: latestVitals?.heart_rate || "Not logged",
      unit: "bpm",
      status: (latestVitals?.heart_rate ? getVitalStatus("heart_rate", latestVitals.heart_rate) : "none") as "normal" | "warning" | "critical",
      lastLogged: latestVitals?.recorded_at ? formatDate(latestVitals.recorded_at) : "Never",
      trend: "stable" as const,
    },
    {
      icon: Wind,
      label: "SpO2",
      value: latestVitals?.spo2 || "Not logged",
      unit: "%",
      status: (latestVitals?.spo2 ? getVitalStatus("spo2", latestVitals.spo2) : "none") as "normal" | "warning" | "critical",
      lastLogged: latestVitals?.recorded_at ? formatDate(latestVitals.recorded_at) : "Never",
      trend: "stable" as const,
    },
    {
      icon: Weight,
      label: "Weight/BMI",
      value: latestVitals?.weight ? `${latestVitals.weight} kg (BMI: ${latestVitals.bmi})` : "Not logged",
      unit: "",
      status: "normal" as const,
      lastLogged: latestVitals?.recorded_at ? formatDate(latestVitals.recorded_at) : "Never",
      trend: "stable" as const,
    },
    {
      icon: Thermometer,
      label: "Temperature",
      value: latestVitals?.temperature ? latestVitals.temperature.toFixed(1) : "Not logged",
      unit: "°F",
      status: (latestVitals?.temperature ? getVitalStatus("temperature", latestVitals.temperature) : "none") as "normal" | "warning" | "critical",
      lastLogged: latestVitals?.recorded_at ? formatDate(latestVitals.recorded_at) : "Never",
      trend: "stable" as const,
    },
  ];

  const mentalHealthData = [
    {
      icon: Smile,
      label: "Mood Score",
      value: "7/10",
      status: "7-day average",
      color: "bg-blue-500",
    },
    {
      icon: Brain,
      label: "Stress Level",
      value: "Medium",
      status: "↓ 10% from last week",
      color: "bg-yellow-500",
    },
    {
      icon: AlertCircle,
      label: "Anxiety Score",
      value: "8/21",
      status: "Mild (GAD-7)",
      color: "bg-orange-500",
    },
    {
      icon: Moon,
      label: "Sleep Quality",
      value: "3.5/5",
      status: "Avg 6.5h last 7 nights",
      color: "bg-indigo-500",
    },
  ];

  const treatmentPlans = [
    {
      name: "Diabetes Management",
      progress: 65,
      goals: [
        "Monitor blood sugar twice daily",
        "Follow prescribed diet plan",
        "Exercise 30 minutes daily",
        "Take medications as scheduled",
      ],
    },
    {
      name: "Hypertension Control",
      progress: 80,
      goals: [
        "Check blood pressure daily",
        "Reduce sodium intake",
        "Maintain healthy weight",
        "Regular cardio exercise",
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar active="health" userName={patientName} userImage={patientImage} />

      {/* Main Content Area */}
      <div className="ml-64 flex-1">
        <PatientTopBar
          userName={patientName}
          userImage={patientImage}
          notificationCount={notificationCount}
          onLogout={handleLogout}
          searchPlaceholder="Search health records..."
        />

        {/* Main Content */}
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="h-7 w-7 text-emerald-600" />
                My Health
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Physical and mental health tracking hub
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-emerald-700"
            >
              Log New Vitals
            </button>
          </div>

          {/* Vitals Tracking Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Vitals Tracking</h2>
              <Link
                href="/patient/health/vitals"
                className="flex items-center gap-1 text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vitalsData.map((vital, idx) => (
                <VitalCard key={idx} {...vital} />
              ))}
            </div>
          </div>

          {/* Health Trends Section */}
          <div className="mb-8">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Health Trends</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDateRange("7")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      dateRange === "7"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setDateRange("30")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      dateRange === "30"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    30 Days
                  </button>
                  <button
                    onClick={() => setDateRange("90")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      dateRange === "90"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    90 Days
                  </button>
                </div>
              </div>

              {/* Placeholder Chart */}
              <div className="relative h-64 rounded-lg border border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="mx-auto mb-3 h-12 w-12 text-emerald-600" />
                    <p className="text-sm font-medium text-gray-700">
                      Health trends chart for last {dateRange} days
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Blood Pressure, Blood Sugar, Heart Rate
                    </p>
                  </div>
                </div>
                {/* Color-coded zones indicator */}
                <div className="absolute bottom-6 left-6 flex gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                    <span className="text-gray-600">Normal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-600">Warning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600">Critical</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mental Health Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Mental Health</h2>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                Log Mood
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {mentalHealthData.map((item, idx) => (
                <MentalHealthCard key={idx} {...item} />
              ))}
            </div>
          </div>

          {/* Photo/Video Upload Section */}
          <div className="mb-8">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Symptom Documentation
              </h2>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-4 text-sm font-medium text-gray-700 transition hover:border-emerald-500 hover:bg-emerald-50">
                  <Camera className="h-5 w-5" />
                  Take Photo
                </button>
                <button className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-4 text-sm font-medium text-gray-700 transition hover:border-emerald-500 hover:bg-emerald-50">
                  <Upload className="h-5 w-5" />
                  Upload from Gallery
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Upload symptom progress photos, wound healing documentation, or other health-related images
              </p>
            </div>
          </div>

          {/* Treatment Plans Section */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Active Treatment Plans</h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {treatmentPlans.map((plan, idx) => (
                <TreatmentPlanCard key={idx} {...plan} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Log Vitals Modal */}
      <LogVitalsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLatestVitals}
        patientId={user?.id}
      />
    </div>
  );
}
