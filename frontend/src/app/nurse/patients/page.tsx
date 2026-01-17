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
  Search,
  Settings,
  LogOut,
  Bell,
  AlertTriangle,
  Activity,
  Syringe,
  ArrowLeft,
  Menu,
  HelpCircle,
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
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const { signOut } = useClerk();
  const userName = user?.fullName || "Nurse";
  const userImage = user?.imageUrl;

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <div className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm md:ml-60">
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
              placeholder="Search patients..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Alert Bell */}
          <button className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
            <Bell className="h-6 w-6" />
          </button>

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

export default function AllPatientsPage() {  const { user } = useUser();
  const nurseName = user?.fullName || "Nurse Sarah";
  const nurseImage = user?.imageUrl;
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [vitalsLoading, setVitalsLoading] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [showAllDataModal, setShowAllDataModal] = useState(false);
  const [allDataLoading, setAllDataLoading] = useState(false);
  const [allDataError, setAllDataError] = useState<string | null>(null);
  const [allPatientData, setAllPatientData] = useState<any>(null);
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

  // Fetch and merge patients (users + profiles)
  const fetchAllPatientsMerged = async () => {
    try {
      setLoading(true);
      console.log('Fetching patients from API (merged users + profiles)...');

      const [usersRes, profilesRes] = await Promise.all([
        fetch("http://localhost:5000/api/patients/users/all"),
        fetch("http://localhost:5000/api/patients/profiles/all"),
      ]);

      const usersData = usersRes.ok ? await usersRes.json() : { data: [] };
      const profilesData = profilesRes.ok ? await profilesRes.json() : { data: [] };

      const users = (usersData.data || []).filter((u: any) => u.role === "patient");
      const profiles = (profilesData.data || []).filter((p: any) => !p.role || p.role === "patient");

      const mergedRaw = [...users, ...profiles];
      const seen = new Set<string>();
      const deduped: any[] = [];

      mergedRaw.forEach((p) => {
        const key = p.clerk_user_id || p.clerkId || p.clerkUserId || p._id;
        if (key) {
          if (!seen.has(key)) {
            seen.add(key);
            deduped.push(p);
          }
        } else {
          deduped.push(p);
        }
      });

      setPatients(deduped);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllPatientsMerged();
  }, []);

  // Filter patients by search term
  const filteredPatients = patients.filter((patient) =>
    (patient.name || "").toLowerCase().includes(searchTerm.toLowerCase())
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
    // Refresh list after closing modal
    fetchAllPatientsMerged();
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
    const clerkId = patient.clerk_user_id || patient.clerkId || patient.clerkUserId || patient._id;
    try {
      setDocumentsLoading(true);
      // Use existing medical-documents route that resolves clerk ids
      const response = await fetch(`http://localhost:5000/api/medical-documents/patient/${clerkId}`);
      if (response.ok) {
        const data = await response.json();
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

  const handleOpenAllDataModal = async (patient: any) => {
    setSelectedPatient(patient);
    setShowAllDataModal(true);
    setAllDataError(null);
    
    // Fetch all data for this patient using clerk_user_id
    // Try multiple possible field names for clerk id
    const clerkId = patient.clerk_user_id || patient.clerkId || patient.clerkUserId || patient._id;
    console.log('Patient object:', patient);
    console.log('Using clerkId:', clerkId);
    
    try {
      setAllDataLoading(true);
      
      // Use new endpoint: /api/patients/:clerkId/all-data
      const url = `http://localhost:5000/api/patients/${clerkId}/all-data`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Full response:', data);
        console.log('Response data field:', data.data);
        setAllPatientData(data.data || null);
      } else {
        console.error("Failed to fetch patient data. Status:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        setAllDataError(`Failed to fetch patient data: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setAllDataError("Error fetching patient data: " + (error as any).message);
    } finally {
      setAllDataLoading(false);
    }
  };

  const handleCloseAllDataModal = () => {
    setShowAllDataModal(false);
    setSelectedPatient(null);
    setAllPatientData(null);
    setAllDataError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        active="patients" 
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
            <h1 className="text-3xl font-bold text-gray-900">All Patients</h1>
            <p className="mt-1 text-gray-600">Manage and view all patients in the system</p>
          </section>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search patients by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm placeholder-gray-500 transition focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Patients List */}
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading patients...</div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              {patients.length === 0 ? "No patients found" : "No matching patients"}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPatients.map((patient) => (
                <div
                  key={patient._id}
                  className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition-all hover:border-emerald-500/70 hover:shadow-md md:flex-row md:items-center"
                >
                  <div className="flex items-center gap-3 min-w-[220px]">
                    <Avatar name={patient.name || "Unknown"} size={44} />
                    <div className="space-y-0.5">
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base">{patient.name || "Unknown Patient"}</h3>
                      <p className="text-xs text-gray-600">ID: {patient._id.slice(-6)}</p>
                      {patient.email && (
                        <p className="text-xs text-gray-600 truncate max-w-[260px]">{patient.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex-1" />

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <button
                      onClick={() => handleOpenVitalsModal(patient)}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Log Vitals
                    </button>
                    <button
                      onClick={() => handleOpenDocumentsModal(patient)}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                    >
                      View Documents
                    </button>
                    <button
                      onClick={() => handleOpenAllDataModal(patient)}
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      View All Data
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* All Patient Data Modal */}
      {showAllDataModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Complete Patient Data - {selectedPatient?.name}</h2>
              <button
                onClick={handleCloseAllDataModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {allDataLoading ? (
                <div className="text-center py-12 text-gray-600">Loading patient data...</div>
              ) : allDataError ? (
                <div className="text-center py-12">
                  <p className="text-red-600 font-medium mb-4">{allDataError}</p>
                  <p className="text-sm text-gray-600">Please try again or contact support.</p>
                </div>
              ) : allPatientData ? (
                <div className="space-y-8">
                  {/* Statistics */}
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Total Documents</p>
                        <p className="text-2xl font-bold text-blue-600">{allPatientData.statistics?.totalDocuments || 0}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Total Vitals</p>
                        <p className="text-2xl font-bold text-green-600">{allPatientData.statistics?.totalVitals || 0}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Mental Health Logs</p>
                        <p className="text-2xl font-bold text-purple-600">{allPatientData.statistics?.totalMentalHealthLogs || 0}</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Prescriptions</p>
                        <p className="text-2xl font-bold text-orange-600">{allPatientData.statistics?.totalPrescriptions || 0}</p>
                      </div>
                    </div>
                  </section>

                  {/* Recent Documents */}
                  {allPatientData.documents && allPatientData.documents.length > 0 && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Documents</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {allPatientData.documents.slice(0, 5).map((doc: any) => (
                          <div key={doc._id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{doc.file_name}</p>
                              <p className="text-xs text-gray-600">{doc.document_type}</p>
                            </div>
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-emerald-600 text-sm font-medium hover:text-emerald-700"
                            >
                              View
                            </a>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Recent Vitals */}
                  {allPatientData.vitals && allPatientData.vitals.length > 0 && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Vitals</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {allPatientData.vitals.slice(0, 3).map((vital: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                              <div><span className="font-medium">BP:</span> {vital.systolic_bp}/{vital.diastolic_bp}</div>
                              <div><span className="font-medium">HR:</span> {vital.heart_rate} bpm</div>
                              <div><span className="font-medium">Temp:</span> {vital.temperature}°F</div>
                              <div><span className="font-medium">O2:</span> {vital.spo2}%</div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{new Date(vital.recorded_at).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Recent Mental Health Logs */}
                  {allPatientData.mentalHealthLogs && allPatientData.mentalHealthLogs.length > 0 && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Mental Health History</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {allPatientData.mentalHealthLogs.slice(0, 5).map((log: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-gray-900">Mood: {log.mood_level}</p>
                              <p className="text-xs text-gray-600">{new Date(log.recorded_date).toLocaleDateString()}</p>
                            </div>
                            {log.notes && <p className="text-sm text-gray-700">{log.notes}</p>}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Recent Prescriptions */}
                  {allPatientData.prescriptions && allPatientData.prescriptions.length > 0 && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Prescriptions</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {allPatientData.prescriptions.slice(0, 5).map((rx: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-gray-900">{rx.medication_name}</p>
                            <p className="text-xs text-gray-600">{rx.dosage} - {rx.frequency}</p>
                            <p className="text-xs text-gray-500 mt-1">Prescribed: {new Date(rx.prescribed_at).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* No data message */}
                  {(!allPatientData.documents || allPatientData.documents.length === 0) &&
                    (!allPatientData.vitals || allPatientData.vitals.length === 0) &&
                    (!allPatientData.mentalHealthLogs || allPatientData.mentalHealthLogs.length === 0) &&
                    (!allPatientData.prescriptions || allPatientData.prescriptions.length === 0) && (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <p>No patient records found for this patient</p>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-600">
                  <p>No patient data available</p>
                  <p className="text-sm text-gray-500 mt-2">allPatientData is: {JSON.stringify(allPatientData)}</p>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={handleCloseAllDataModal}
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
