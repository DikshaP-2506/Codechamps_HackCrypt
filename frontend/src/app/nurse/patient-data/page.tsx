"use client";

import { useState, useEffect } from "react";
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
  Activity,
  Menu,
  HelpCircle,
  Syringe,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

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
        {/* Left: Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Center: Search */}
        <div className="flex items-center justify-center flex-1">
          <div className="relative w-full max-w-md">
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

// Toast Notification Component
function Toast({ 
  message, 
  type, 
  onClose 
}: { 
  message: string; 
  type: "success" | "error"; 
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 rounded-lg border px-6 py-4 shadow-lg ${
        type === "success" 
          ? "border-emerald-200 bg-emerald-50 text-emerald-800" 
          : "border-red-200 bg-red-50 text-red-800"
      }`}>
        {type === "success" ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <AlertCircle className="h-5 w-5" />
        )}
        <p className="font-medium">{message}</p>
        <button onClick={onClose} className="ml-4 hover:opacity-70">
          ✕
        </button>
      </div>
    </div>
  );
}

// Main Patient Data Form Component
export default function PatientDataForm() {
  const { user } = useUser();
  const nurseName = user?.fullName || "Nurse Sarah";
  const nurseImage = user?.imageUrl;
  
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const [formData, setFormData] = useState({
    patient_id: "",
    recorded_by: user?.id || "nurse_001",
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
    measurement_method: "manual_entry",
    notes: "",
  });

  const [bmi, setBmi] = useState<number | null>(null);

  // Calculate BMI when height or weight changes
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patient_id) {
      setToast({ message: "Patient ID is required", type: "error" });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
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
      };

      const response = await fetch("/api/vitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setToast({ message: "Vitals saved successfully!", type: "success" });
        // Reset form
        setFormData({
          patient_id: "",
          recorded_by: user?.id || "nurse_001",
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
          measurement_method: "manual_entry",
          notes: "",
        });
        setBmi(null);
      } else {
        setToast({ message: result.error || "Failed to save vitals", type: "error" });
      }
    } catch (error) {
      console.error("Error submitting vitals:", error);
      setToast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        active="patient-data" 
        userName={nurseName} 
        userImage={nurseImage} 
        userRole="Nurse"
        navItems={[
          { id: "dashboard", label: "Dashboard", icon: Home, href: "/nurse/dashboard" },
          { id: "patient-data", label: "Patient Data", icon: Activity, href: "/nurse/patient-data" },
          { id: "patients", label: "All Patients", icon: Users, href: "/nurse/patients" },
          { id: "tasks", label: "Tasks", icon: Clipboard, href: "/nurse/tasks" },
          { id: "vitals", label: "Vitals Monitoring", icon: Heart, href: "/nurse/vitals" },
          { id: "medications", label: "Medications", icon: Syringe, href: "/nurse/medications" },
          { id: "appointments", label: "Appointments", icon: Calendar, href: "/nurse/appointments" },
          { id: "settings", label: "Settings", icon: Settings, href: "/nurse/settings" },
        ]}
      />
      <TopBar />

      {/* Main Content */}
      <main className="md:ml-60">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link 
            href="/nurse/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-emerald-600 transition hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>

          {/* Page Header */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Patient Vitals Entry</h1>
            <p className="mt-1 text-gray-600">Record patient physical vitals</p>
          </section>

          {/* Form Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit}>
              {/* Patient Info Section */}
              <div className="mb-8">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Patient Information</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Patient ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="patient_id"
                      value={formData.patient_id}
                      onChange={handleChange}
                      required
                      placeholder="Enter patient ID"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Recorded By
                    </label>
                    <input
                      type="text"
                      name="recorded_by"
                      value={formData.recorded_by}
                      onChange={handleChange}
                      placeholder="Nurse ID"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Recorded At
                    </label>
                    <input
                      type="datetime-local"
                      name="recorded_at"
                      value={formData.recorded_at}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* Vitals Section */}
              <div className="mb-8">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Vital Signs</h2>
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
                      max="300"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
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
                      max="200"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
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
                      max="300"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
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
                      max="100"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
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
                      max="110"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Measurements Section */}
              <div className="mb-8">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Physical Measurements</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  {bmi && (
                    <div className="md:col-span-2">
                      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                        <p className="text-sm font-medium text-emerald-800">
                          Calculated BMI: <span className="text-lg font-bold">{bmi}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="mb-8">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Additional Information</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Measurement Method
                    </label>
                    <select
                      name="measurement_method"
                      value={formData.measurement_method}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    >
                      <option value="manual_entry">Manual Entry</option>
                      <option value="patient_sync">Patient Sync</option>
                      <option value="wearable_api">Wearable API</option>
                      <option value="clinical_device">Clinical Device</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Additional observations or notes..."
                      rows={4}
                      maxLength={1000}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.notes.length}/1000 characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Vitals"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
