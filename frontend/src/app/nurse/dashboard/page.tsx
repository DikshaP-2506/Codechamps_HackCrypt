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
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  MoreVertical,
  Menu,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Syringe,
  Clock,
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
        {/* Left: Search */}
        <div className="flex items-center gap-3 flex-1">
          <button className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative hidden w-80 sm:block">
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

// Stat Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  subtitle,
  severity,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  subtitle: string;
  severity?: "critical" | "high" | "medium";
}) {
  const numberColor =
    severity === "critical"
      ? "text-red-500"
      : severity === "high"
      ? "text-yellow-500"
      : "text-emerald-700";

  return (
    <div className="flex h-[140px] flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
          {label}
        </span>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          {Icon}
        </div>
      </div>
      <div>
        <div className={`font-mono text-3xl font-bold ${numberColor}`}>
          {value}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-500">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}

// Task Card Component
function TaskCard({
  patientName,
  taskType,
  time,
  status,
}: {
  patientName: string;
  taskType: string;
  time: string;
  status: "Pending" | "Completed";
}) {
  const [isCompleted, setIsCompleted] = useState(status === "Completed");
  
  const statusColor = isCompleted
    ? "bg-emerald-100 text-emerald-700"
    : "bg-yellow-100 text-yellow-700";

  return (
    <div className="mb-3 flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-gray-300 hover:bg-white hover:shadow-md">
      {/* Patient Avatar */}
      <Avatar name={patientName} size={40} />

      {/* Task Info */}
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm font-semibold text-gray-900">
          {patientName}
        </div>
        <div className="mt-1 text-xs text-gray-600">{taskType}</div>
      </div>

      {/* Time */}
      <div className="flex items-center gap-1 text-gray-600 min-w-fit">
        <Clock className="h-4 w-4" />
        <span className="text-xs font-medium">{time}</span>
      </div>

      {/* Status Badge */}
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${statusColor}`}
      >
        {isCompleted ? "Completed" : "Pending"}
      </span>

      {/* Mark Done Button */}
      {!isCompleted && (
        <button
          onClick={() => setIsCompleted(true)}
          className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700"
        >
          Mark Done
        </button>
      )}
    </div>
  );
}

// Patient Card Component
function PatientCard({
  name,
  age,
  gender,
  room,
  conditions,
}: {
  name: string;
  age: number;
  gender: string;
  room: string;
  conditions: string[];
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-500 hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar name={name} size={48} />
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-xs text-gray-600">Room {room}</p>
          </div>
        </div>
        <button className="rounded-md p-2 text-gray-600 transition hover:bg-gray-100">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3 space-y-1 text-xs text-gray-600">
        <p><span className="font-medium">Age:</span> {age} years</p>
        <p><span className="font-medium">Gender:</span> {gender}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {conditions.map((condition) => (
          <span
            key={condition}
            className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700"
          >
            {condition}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100">
          View Profile
        </button>
        <button className="flex-1 rounded-md bg-emerald-600 px-2 py-2 text-xs font-medium text-white transition hover:bg-emerald-700">
          Log Vitals
        </button>
      </div>
    </div>
  );
}

// Alert Card Component
function AlertCard({
  severity,
  name,
  message,
  time,
}: {
  severity: "Critical" | "Warning";
  name: string;
  message: string;
  time: string;
}) {
  const borderColor =
    severity === "Critical"
      ? "border-l-red-500 bg-red-50"
      : "border-l-yellow-500 bg-yellow-50";

  const iconColor =
    severity === "Critical"
      ? "text-red-500"
      : "text-yellow-500";

  return (
    <div className={`mb-3 flex gap-3 rounded-lg border-l-4 p-4 ${borderColor}`}>
      <div className={`flex-shrink-0 ${iconColor}`}>
        {severity === "Critical" ? (
          <AlertTriangle className="h-5 w-5" />
        ) : (
          <AlertCircle className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{name}</p>
        <p className="text-xs text-gray-700">{message}</p>
        <p className="mt-1 text-xs text-gray-500">{time}</p>
      </div>
      <button className="flex-shrink-0 rounded-md bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100">
        Review
      </button>
    </div>
  );
}

// Main Dashboard Component
export default function NurseDashboard() {
  const { user } = useUser();
  const nurseName = user?.fullName || "Nurse Sarah";
  const nurseImage = user?.imageUrl;

  const [alertFilter, setAlertFilter] = useState<"All" | "Critical" | "Warning">("All");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [vitalsLoading, setVitalsLoading] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [vitals, setVitals] = useState({
    systolic_bp: "",
    diastolic_bp: "",
    heart_rate: "",
    blood_sugar: "",
    respiratory_rate: "",
    temperature: "",
    spo2: "",
    weight: "",
    height: "",
    measurement_method: "Manual Entry",
    notes: "",
  });

  // Fetch all patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/patients?limit=1000');
        if (response.ok) {
          const data = await response.json();
          console.log('Patient data from API:', data.data);
          if (data.data && data.data.length > 0) {
            console.log('First patient:', data.data[0]);
            console.log('Has clerk_user_id?', data.data[0].clerk_user_id);
          }
          setPatients(data.data || []);
        } else {
          console.error('Failed to fetch patients');
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Mock data for tasks
  const tasks = [
    {
      patientName: "John Anderson",
      taskType: "Check vitals",
      time: "10:30 AM",
      status: "Pending" as const,
    },
    {
      patientName: "Maria Garcia",
      taskType: "Administer medication",
      time: "11:00 AM",
      status: "Pending" as const,
    },
    {
      patientName: "Robert Chen",
      taskType: "Dressing change",
      time: "09:45 AM",
      status: "Completed" as const,
    },
    {
      patientName: "Emma Wilson",
      taskType: "Check wound",
      time: "02:00 PM",
      status: "Pending" as const,
    },
  ];

  // Mock data for alerts
  const alerts = [
    {
      severity: "Critical" as const,
      name: "John Anderson (Room 301)",
      message: "Blood pressure elevated - 165/95 mmHg",
      time: "5 minutes ago",
    },
    {
      severity: "Warning" as const,
      name: "Emma Wilson (Room 304)",
      message: "Temperature slightly elevated - 38.2°C",
      time: "12 minutes ago",
    },
    {
      severity: "Critical" as const,
      name: "Robert Chen (Room 303)",
      message: "Medication overdue - Next dose at 2:00 PM",
      time: "2 minutes ago",
    },
  ];

  const pendingTasks = tasks.filter(t => t.status === "Pending").length;
  const allPatientsCount = patients.length;
  const criticalAlerts = alerts.filter(a => a.severity === "Critical").length;
  const activeTreatments = 12;

  const filteredAlerts = alerts.filter(
    (a) => alertFilter === "All" || a.severity === alertFilter
  );

  const handleOpenVitalsModal = (patient: any) => {
    setSelectedPatient(patient);
    setShowVitalsModal(true);
  };

  const handleCloseVitalsModal = () => {
    setShowVitalsModal(false);
    setSelectedPatient(null);
    setVitals({
      systolic_bp: "",
      diastolic_bp: "",
      heart_rate: "",
      blood_sugar: "",
      respiratory_rate: "",
      temperature: "",
      spo2: "",
      weight: "",
      height: "",
      measurement_method: "Manual Entry",
      notes: "",
    });
  };

  const handleVitalsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVitals(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBMI = () => {
    const weight = parseFloat(vitals.weight);
    const height = parseFloat(vitals.height);
    if (weight && height) {
      return (weight / (height / 100) ** 2).toFixed(1);
    }
    return null;
  };

  const handleSaveVitals = async () => {
    if (!selectedPatient) return;

    try {
      setVitalsLoading(true);
      const bmi = calculateBMI();
      
      const vitalData = {
        patient_id: selectedPatient._id,
        recorded_by: selectedPatient._id,
        systolic_bp: parseInt(vitals.systolic_bp),
        diastolic_bp: parseInt(vitals.diastolic_bp),
        heart_rate: parseInt(vitals.heart_rate),
        blood_sugar: parseInt(vitals.blood_sugar),
        respiratory_rate: parseInt(vitals.respiratory_rate),
        temperature: parseFloat(vitals.temperature),
        spo2: parseInt(vitals.spo2),
        weight: parseFloat(vitals.weight),
        height: parseInt(vitals.height),
        ...(bmi && { bmi: parseFloat(bmi) }),
        measurement_method: vitals.measurement_method,
        notes: vitals.notes,
      };

      const response = await fetch("http://localhost:5000/api/physical-vitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vitalData),
      });

      if (response.ok) {
        alert("Vitals saved successfully!");
        handleCloseVitalsModal();
      } else {
        alert("Failed to save vitals");
      }
    } catch (error) {
      console.error("Error saving vitals:", error);
      alert("Error saving vitals");
    } finally {
      setVitalsLoading(false);
    }
  };

  const handleOpenDocumentsModal = async (patient: any) => {
    setSelectedPatient(patient);
    setShowDocumentsModal(true);
    
    // Fetch documents for this patient using clerk_user_id
    const patientId = patient.clerk_user_id || patient._id;
    console.log('Patient object:', patient);
    console.log('Using patientId:', patientId);
    console.log('clerk_user_id exists?', !!patient.clerk_user_id);
    try {
      setDocumentsLoading(true);
      const response = await fetch(`http://localhost:5000/api/medical-documents/patient/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Documents fetched:', data);
        setDocuments(data.data || []);
      } else {
        console.error("Failed to fetch documents");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleCloseDocumentsModal = () => {
    setShowDocumentsModal(false);
    setSelectedPatient(null);
    setDocuments([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        active="dashboard" 
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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Nurse Dashboard</h1>
            <p className="mt-1 text-gray-600">Today's Overview</p>
          </section>

          {/* Stats Row */}
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="All Patients"
              value={allPatientsCount}
              icon={<Users className="h-6 w-6 text-emerald-700" />}
              subtitle="Total patients"
            />
            <StatCard
              label="Today's Tasks"
              value={pendingTasks}
              icon={<Clipboard className="h-6 w-6 text-emerald-700" />}
              subtitle="Pending tasks"
            />
            <StatCard
              label="Critical Alerts"
              value={criticalAlerts}
              icon={<AlertTriangle className="h-6 w-6 text-emerald-700" />}
              subtitle="Require attention"
              severity="critical"
            />
            <StatCard
              label="Active Treatments"
              value={activeTreatments}
              icon={<Activity className="h-6 w-6 text-emerald-700" />}
              subtitle="In progress"
            />
          </section>

          {/* Tasks + Alerts Row */}
          <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Tasks (Left - 2/3) */}
            <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Today's Tasks
                </h2>
                <button className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline">
                  View All
                </button>
              </div>
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="h-16 w-16 text-emerald-300" />
                  <p className="mt-4 text-gray-500">No tasks scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task, idx) => (
                    <TaskCard key={idx} {...task} />
                  ))}
                </div>
              )}
            </div>

            {/* Alerts (Right - 1/3) */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Alerts
                </h2>
                <button
                  onClick={() => {
                    const filters: ("All" | "Critical" | "Warning")[] = ["All", "Critical", "Warning"];
                    const currentIdx = filters.indexOf(alertFilter);
                    setAlertFilter(
                      filters[(currentIdx + 1) % filters.length]
                    );
                  }}
                  className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-emerald-500"
                >
                  {alertFilter}
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
              {filteredAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="mt-3 text-sm text-gray-500">No alerts</p>
                  <p className="text-xs text-gray-400">
                    All patients are stable
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAlerts.map((alert, idx) => (
                    <AlertCard key={idx} {...alert} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* All Patients Section */}
          <section className="mt-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                All Patients
              </h2>
              <button className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline">
                View All
              </button>
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-600">Loading patients...</div>
            ) : patients.length === 0 ? (
              <div className="text-center py-8 text-gray-600">No patients found</div>
            ) : (
              <div className="space-y-3">
                {patients.map((patient) => (
                  <div 
                    key={patient._id} 
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-emerald-500 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={patient.name || "Unknown"} size={40} />
                      <span className="font-semibold text-gray-900">
                        {patient.name || "Unknown Patient"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenVitalsModal(patient)}
                        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                      >
                        Log Vitals
                      </button>
                      <button 
                        onClick={() => handleOpenDocumentsModal(patient)}
                        className="rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        View Documents
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Vitals Modal */}
      {showVitalsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Log Vitals - {selectedPatient?.name}</h2>
              <button
                onClick={handleCloseVitalsModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Vital Signs */}
              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP (mmHg)</label>
                    <input
                      type="number"
                      name="systolic_bp"
                      value={vitals.systolic_bp}
                      onChange={handleVitalsChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
                      placeholder="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP (mmHg)</label>
                    <input
                      type="number"
                      name="diastolic_bp"
                      value={vitals.diastolic_bp}
                      onChange={handleVitalsChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
                      placeholder="80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      name="heart_rate"
                      value={vitals.heart_rate}
                      onChange={handleVitalsChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
                      placeholder="72"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Sugar (mg/dL)</label>
                    <input
                      type="number"
                      name="blood_sugar"
                      value={vitals.blood_sugar}
                      onChange={handleVitalsChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory Rate (breaths/min)</label>
                    <input
                      type="number"
                      name="respiratory_rate"
                      value={vitals.respiratory_rate}
                      onChange={handleVitalsChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
                      placeholder="16"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="temperature"
                      value={vitals.temperature}
                      onChange={handleVitalsChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
                      placeholder="98.6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SpO2 (%)</label>
                    <input
                      type="number"
                      name="spo2"
                      value={vitals.spo2}
                      onChange={handleVitalsChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
                      placeholder="98"
                    />
                  </div>
                </div>
              </section>

              {/* Physical Measurements */}
              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Measurements</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="weight"
                      value={vitals.weight}
                      onChange={handleVitalsChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
                      placeholder="70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={vitals.height}
                      onChange={handleVitalsChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
                      placeholder="170"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">BMI (auto-calculated)</label>
                    <input
                      type="text"
                      value={calculateBMI() || ""}
                      disabled
                      className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>
              </section>

              {/* Additional Information */}
              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Measurement Method</label>
                  <select
                    name="measurement_method"
                    value={vitals.measurement_method}
                    onChange={handleVitalsChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Manual Entry">Manual Entry</option>
                    <option value="Patient Sync">Patient Sync</option>
                    <option value="Device Sync">Device Sync</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={vitals.notes}
                    onChange={handleVitalsChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
                    placeholder="Additional observations or notes..."
                    rows={3}
                  />
                </div>
              </section>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCloseVitalsModal}
                  disabled={vitalsLoading}
                  className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveVitals}
                  disabled={vitalsLoading}
                  className="flex-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {vitalsLoading ? "Saving..." : "Save Vitals"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {showDocumentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Medical Documents - {selectedPatient?.name}</h2>
              <button
                onClick={handleCloseDocumentsModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {documentsLoading ? (
                <div className="text-center py-8 text-gray-600">Loading documents...</div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 text-gray-600">No documents found for this patient</div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc._id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{doc.file_name}</h3>
                            <span className="inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                              {doc.document_type || "General"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                            {doc.report_details?.test_date && (
                              <p>
                                <span className="font-medium">Test Date:</span>{" "}
                                {new Date(doc.report_details.test_date).toLocaleDateString()}
                              </p>
                            )}
                            {doc.report_details?.laboratory && (
                              <p>
                                <span className="font-medium">Laboratory:</span> {doc.report_details.laboratory}
                              </p>
                            )}
                            {doc.report_details?.test_category && (
                              <p>
                                <span className="font-medium">Category:</span> {doc.report_details.test_category}
                              </p>
                            )}
                            {doc.report_details?.priority && (
                              <p>
                                <span className="font-medium">Priority:</span>{" "}
                                <span className={`font-semibold ${doc.report_details.priority === "urgent" ? "text-red-600" : "text-yellow-600"}`}>
                                  {doc.report_details.priority}
                                </span>
                              </p>
                            )}
                          </div>

                          {doc.report_details?.report_notes && (
                            <p className="text-xs text-gray-700 bg-white rounded p-2 mb-3">
                              <span className="font-medium">Notes:</span> {doc.report_details.report_notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-emerald-700"
                        >
                          View Document
                        </a>
                        <a
                          href={doc.file_url}
                          download={doc.file_name}
                          className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={handleCloseDocumentsModal}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
