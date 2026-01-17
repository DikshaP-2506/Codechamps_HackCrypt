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
  Video,
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
    { id: "teleconsultation", label: "Teleconsultation", icon: Video, href: "/patient/teleconsultation" },
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

// Log Mood Modal Component
function LogMoodModal({
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
    mood_rating: "",
    stress_level: "",
    anxiety_level: "",
    sleep_hours: "",
    sleep_quality: "",
    phq9_score: "",
    gad7_score: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        patient_id: patientId,
        recorded_by: patientId,
        mood_rating: formData.mood_rating ? parseInt(formData.mood_rating) : null,
        stress_level: formData.stress_level || null,
        anxiety_level: formData.anxiety_level || null,
        sleep_hours: formData.sleep_hours ? parseFloat(formData.sleep_hours) : null,
        sleep_quality: formData.sleep_quality ? parseInt(formData.sleep_quality) : null,
        phq9_score: formData.phq9_score ? parseInt(formData.phq9_score) : null,
        gad7_score: formData.gad7_score ? parseInt(formData.gad7_score) : null,
        notes: formData.notes,
      };

      console.log("Submitting mood log:", payload);

      const response = await fetch("/api/mental-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok && result.success) {
        setFormData({
          mood_rating: "",
          stress_level: "",
          anxiety_level: "",
          sleep_hours: "",
          sleep_quality: "",
          phq9_score: "",
          gad7_score: "",
          notes: "",
        });
        onClose();
        await onSuccess();
      } else {
        console.error("API error:", response.status, result);
        alert("Failed to save mood log: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting mood log:", error);
      alert("Error submitting mood log. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Log Mood</h2>
          <button
            onClick={onClose}
            className="text-gray-500 transition hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Rating */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mood Rating (0-10)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="mood_rating"
                value={formData.mood_rating || 0}
                onChange={handleChange}
                min="0"
                max="10"
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-2xl font-bold text-blue-600 w-12 text-center">
                {formData.mood_rating || "0"}
              </span>
            </div>
          </div>

          {/* Stress and Anxiety */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Stress Level
              </label>
              <select
                name="stress_level"
                value={formData.stress_level}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              >
                <option value="">Select...</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Anxiety Level
              </label>
              <select
                name="anxiety_level"
                value={formData.anxiety_level}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              >
                <option value="">Select...</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Sleep Information */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sleep Hours (0-24)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="sleep_hours"
                  value={formData.sleep_hours || 0}
                  onChange={handleChange}
                  placeholder="7.5"
                  step="0.5"
                  min="0"
                  max="24"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-lg font-bold text-blue-600 w-16 text-center">
                  {formData.sleep_hours || "0"}h
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sleep Quality (0-10)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="sleep_quality"
                  value={formData.sleep_quality || 0}
                  onChange={handleChange}
                  placeholder="8"
                  min="0"
                  max="10"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-lg font-bold text-blue-600 w-12 text-center">
                  {formData.sleep_quality || "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Assessment Scores */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                PHQ-9 Score (0-27)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="phq9_score"
                  value={formData.phq9_score || 0}
                  onChange={handleChange}
                  placeholder="Depression score"
                  min="0"
                  max="27"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-lg font-bold text-blue-600 w-12 text-center">
                  {formData.phq9_score || "0"}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                GAD-7 Score (0-21)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="gad7_score"
                  value={formData.gad7_score || 0}
                  onChange={handleChange}
                  placeholder="Anxiety score"
                  min="0"
                  max="21"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-lg font-bold text-blue-600 w-12 text-center">
                  {formData.gad7_score || "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional thoughts or observations..."
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
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Saving..." : "Save Mood Entry"}
            </button>
          </div>
        </form>
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
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [latestVitals, setLatestVitals] = useState<any>(null);
  const [latestMood, setLatestMood] = useState<any>(null);
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

  // Fetch latest mood from MongoDB
  const fetchLatestMood = async () => {
    if (!user?.id) return;
    try {
      console.log("Fetching mood logs for patient:", user.id);
      const response = await fetch(`/api/mental-health/patient/${user.id}`);
      const result = await response.json();
      console.log("Mood logs response:", result);
      if (result.success && result.data.length > 0) {
        setLatestMood(result.data[0]);
        console.log("Latest mood set:", result.data[0]);
      } else {
        console.log("No mood logs found");
      }
    } catch (error) {
      console.error("Error fetching mood logs:", error);
    }
  };

  useEffect(() => {
    fetchLatestVitals();
    fetchLatestMood();
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
      value: latestMood?.mood_rating !== undefined && latestMood?.mood_rating !== null ? `${latestMood.mood_rating}/10` : "Not logged",
      status: latestMood?.recorded_date ? formatDate(latestMood.recorded_date) : "Never logged",
      color: "bg-blue-500",
    },
    {
      icon: Brain,
      label: "Stress Level",
      value: latestMood?.stress_level ? latestMood.stress_level.charAt(0).toUpperCase() + latestMood.stress_level.slice(1) : "Not logged",
      status: latestMood?.recorded_date ? formatDate(latestMood.recorded_date) : "Never logged",
      color: "bg-yellow-500",
    },
    {
      icon: AlertCircle,
      label: "Anxiety Score",
      value: latestMood?.gad7_score !== undefined && latestMood?.gad7_score !== null ? `${latestMood.gad7_score}/21` : "Not logged",
      status: latestMood?.anxiety_level ? latestMood.anxiety_level.charAt(0).toUpperCase() + latestMood.anxiety_level.slice(1) : "Never logged",
      color: "bg-orange-500",
    },
    {
      icon: Moon,
      label: "Sleep Quality",
      value: latestMood?.sleep_quality !== undefined && latestMood?.sleep_quality !== null ? `${latestMood.sleep_quality}/10` : "Not logged",
      status: latestMood?.sleep_hours !== undefined && latestMood?.sleep_hours !== null ? `${latestMood.sleep_hours}h sleep` : "Never logged",
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
              onClick={() => setIsVitalsModalOpen(true)}
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
              <button 
                onClick={() => setIsMoodModalOpen(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                Log Mood
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {mentalHealthData.map((item, idx) => (
                <MentalHealthCard key={idx} {...item} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Log Mood Modal */}
      <LogMoodModal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
        onSuccess={fetchLatestMood}
        patientId={user?.id}
      />

      {/* Log Vitals Modal */}
      <LogVitalsModal
        isOpen={isVitalsModalOpen}
        onClose={() => setIsVitalsModalOpen(false)}
        onSuccess={fetchLatestVitals}
        patientId={user?.id}
      />
    </div>
  );
}
