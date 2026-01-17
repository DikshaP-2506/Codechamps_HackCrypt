"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Sidebar } from "@/components/Sidebar";
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
  Plus,
  X,
  Download,
  FileText,
  Eye,
  Copy,
  Trash2,
  Send,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  QrCode,
  Edit,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// Prescription Card Component
function PrescriptionCard({
  prescription,
  onViewFull,
  onDownload,
  onDuplicate,
  onRevoke,
}: {
  prescription: {
    id: number;
    patientName: string;
    doctorName: string;
    medications: Array<{ name: string; dosage: string; frequency: string }>;
    validUntil: string;
    status: "active" | "expired";
    issuedDate: string;
  };
  onViewFull: (id: number) => void;
  onDownload: (id: number) => void;
  onDuplicate: (id: number) => void;
  onRevoke: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const displayMeds = expanded ? prescription.medications : prescription.medications.slice(0, 2);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Pill className="h-6 w-6 text-purple-600" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Prescription Issued</h3>
            <p className="text-sm text-gray-600">{prescription.patientName}</p>
            <p className="text-xs text-gray-500 mt-1">by {prescription.doctorName}</p>
            <p className="text-xs text-gray-500">Issued: {prescription.issuedDate}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
          prescription.status === "active"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700"
        }`}>
          {prescription.status === "active" ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {prescription.status === "active" ? "Active" : "Expired"}
        </div>
      </div>

      {/* Medication List */}
      <div className="mb-4 rounded-lg bg-gray-50 p-4">
        <h4 className="mb-3 text-sm font-semibold text-gray-900">Medications</h4>
        <div className="space-y-2">
          {displayMeds.map((med, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">
                {med.name} {med.dosage}
              </span>
              <span className="text-gray-600 italic">{med.frequency}</span>
            </div>
          ))}
          {prescription.medications.length > 2 && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700"
            >
              +{prescription.medications.length - 2} more
              <ChevronDown className="h-3 w-3" />
            </button>
          )}
          {expanded && prescription.medications.length > 2 && (
            <button
              onClick={() => setExpanded(false)}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700"
            >
              Show less
              <ChevronUp className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Valid Until */}
      <div className="mb-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
        <span className="text-gray-600">Valid Until:</span>
        <span className="font-semibold text-gray-900">{prescription.validUntil}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewFull(prescription.id)}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <Eye className="h-4 w-4" />
          View
        </button>
        <button
          onClick={() => onDownload(prescription.id)}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
        <button
          onClick={() => onDuplicate(prescription.id)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          title="Duplicate prescription"
        >
          <Copy className="h-4 w-4" />
        </button>
        <button
          onClick={() => onRevoke(prescription.id)}
          className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          title="Revoke prescription"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Prescription Builder Modal
function PrescriptionBuilderModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [medications, setMedications] = useState([
    { drug: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");

  if (!isOpen) return null;

  const addMedication = () => {
    setMedications([...medications, { drug: "", dosage: "", frequency: "", duration: "" }]);
  };

  const removeMedication = (idx: number) => {
    setMedications(medications.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Create New Prescription</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-6">
          {/* Patient Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Patient *
            </label>
            <div className="relative">
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="">Choose a patient...</option>
                <option value="john-doe">John Doe</option>
                <option value="jane-smith">Jane Smith</option>
                <option value="mike-wilson">Mike Wilson</option>
              </select>

              {/* Allergy Alert */}
              {selectedPatient && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Allergy Alerts</p>
                    <p className="text-xs text-amber-800 mt-1">Penicillin, Sulfonamides</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Diagnosis/Condition *
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g., Type 2 Diabetes, Hypertension"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Medications Table */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Medications *</label>
              <button
                type="button"
                onClick={addMedication}
                className="text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                + Add medication
              </button>
            </div>

            <div className="space-y-3">
              {medications.map((med, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Drug name"
                    value={med.drug}
                    onChange={(e) => {
                      const newMeds = [...medications];
                      newMeds[idx].drug = e.target.value;
                      setMedications(newMeds);
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(e) => {
                      const newMeds = [...medications];
                      newMeds[idx].dosage = e.target.value;
                      setMedications(newMeds);
                    }}
                    className="w-24 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Frequency"
                    value={med.frequency}
                    onChange={(e) => {
                      const newMeds = [...medications];
                      newMeds[idx].frequency = e.target.value;
                      setMedications(newMeds);
                    }}
                    className="w-32 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={med.duration}
                    onChange={(e) => {
                      const newMeds = [...medications];
                      newMeds[idx].duration = e.target.value;
                      setMedications(newMeds);
                    }}
                    className="w-32 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  {medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedication(idx)}
                      className="rounded-lg border border-red-300 p-2 text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Doctor's Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Doctor's Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Special instructions, contraindications, follow-up notes..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Valid From
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Valid Until
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Live PDF Preview */}
          <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-700">PDF Preview</p>
              <QrCode className="h-6 w-6 text-gray-400" />
            </div>
            <div className="h-64 rounded-lg border-2 border-dashed border-gray-300 bg-white flex items-center justify-center">
              <div className="text-center">
                <FileText className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">PDF preview will appear here</p>
              </div>
            </div>
          </div>

          {/* Digital Signature */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Digital Signature
            </label>
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
              <p className="text-sm text-gray-600">Signature will be added automatically</p>
              <p className="text-xs text-gray-500 mt-1">Dr. Sarah Johnson - Verified</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
              Create & Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Template Library Modal
function TemplateLibraryModal({
  isOpen,
  onClose,
  onSelectTemplate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: string) => void;
}) {
  const templates = [
    {
      name: "Diabetes Management",
      conditions: "Type 2 Diabetes",
      meds: ["Metformin", "Glipizide"],
    },
    {
      name: "Hypertension Control",
      conditions: "High Blood Pressure",
      meds: ["Lisinopril", "Amlodipine"],
    },
    {
      name: "Cardio Protection",
      conditions: "Cardiovascular Disease",
      meds: ["Atorvastatin", "Aspirin", "Beta-blocker"],
    },
    {
      name: "Thyroid Management",
      conditions: "Hypothyroidism",
      meds: ["Levothyroxine"],
    },
    {
      name: "Respiratory Support",
      conditions: "Asthma/COPD",
      meds: ["Albuterol", "Fluticasone"],
    },
    {
      name: "Antibiotics - Standard",
      conditions: "Bacterial Infection",
      meds: ["Amoxicillin", "Azithromycin"],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Prescription Templates</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {templates.map((template, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectTemplate(template.name);
                onClose();
              }}
              className="rounded-lg border border-gray-300 p-4 text-left transition hover:border-purple-600 hover:bg-purple-50"
            >
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{template.conditions}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {template.meds.map((med, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700"
                  >
                    {med}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// PDF Preview Modal
function PDFPreviewModal({
  isOpen,
  onClose,
  prescription,
}: {
  isOpen: boolean;
  onClose: () => void;
  prescription?: {
    patientName: string;
    doctorName: string;
    medications: Array<{ name: string; dosage: string; frequency: string }>;
    validUntil: string;
  };
}) {
  if (!isOpen || !prescription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Prescription Preview</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PDF Content Simulation */}
        <div className="space-y-6 rounded-lg border-2 border-gray-300 bg-white p-8">
          {/* Header */}
          <div className="border-b-2 border-gray-300 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">PRESCRIPTION</h1>
            <p className="text-sm text-gray-600 mt-1">Healthcare Provider Authorization</p>
          </div>

          {/* Doctor & Patient Info */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-semibold text-gray-600">PRESCRIBING PHYSICIAN</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{prescription.doctorName}</p>
              <p className="text-sm text-gray-600">License: MD-12345</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600">PATIENT NAME</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{prescription.patientName}</p>
              <p className="text-sm text-gray-600">DOB: 01/15/1975</p>
            </div>
          </div>

          {/* Medications */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-3">MEDICATIONS</p>
            <div className="space-y-2">
              {prescription.medications.map((med, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium text-gray-900">
                    {med.name} {med.dosage}
                  </span>
                  <span className="text-gray-600 text-sm">{med.frequency}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Validity */}
          <div className="grid grid-cols-2 gap-8 border-t-2 border-gray-300 pt-4">
            <div>
              <p className="text-xs font-semibold text-gray-600">VALID UNTIL</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{prescription.validUntil}</p>
            </div>
            <div className="text-right">
              <div className="inline-block rounded border-2 border-gray-300 p-4 bg-gray-50">
                <QrCode className="h-16 w-16 text-gray-400" />
                <p className="text-xs text-gray-600 mt-1">QR Code</p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700">
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Prescriptions Page Component
export default function DoctorPrescriptions() {
  const { user } = useUser();
  const [notificationCount] = useState(3);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [filterTab, setFilterTab] = useState<"active" | "all" | "history">("active");
  const doctorName = "Dr. Sarah Johnson";

  const prescriptions = [
    {
      id: 1,
      patientName: "John Doe",
      doctorName: "Dr. Sarah Johnson",
      medications: [
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
        { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily at night" },
        { name: "Aspirin", dosage: "75mg", frequency: "Once daily" },
      ],
      validUntil: "Feb 15, 2026",
      status: "active" as const,
      issuedDate: "Jan 16, 2026",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      doctorName: "Dr. Sarah Johnson",
      medications: [
        { name: "Amlodipine", dosage: "5mg", frequency: "Once daily" },
        { name: "Hydrochlorothiazide", dosage: "25mg", frequency: "Once daily" },
      ],
      validUntil: "Mar 20, 2026",
      status: "active" as const,
      issuedDate: "Dec 20, 2025",
    },
    {
      id: 3,
      patientName: "Mike Wilson",
      doctorName: "Dr. Sarah Johnson",
      medications: [
        { name: "Levothyroxine", dosage: "75mcg", frequency: "Once daily" },
      ],
      validUntil: "Jan 10, 2026",
      status: "expired" as const,
      issuedDate: "Jul 10, 2025",
    },
  ];

  const filteredPrescriptions =
    filterTab === "active"
      ? prescriptions.filter((p) => p.status === "active")
      : filterTab === "history"
      ? prescriptions.filter((p) => p.status === "expired")
      : prescriptions;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        active="prescriptions"
        userName={user?.fullName || "Doctor"}
        userImage={user?.imageUrl}
        userRole="Doctor"
        navItems={[
          { id: "dashboard", label: "Dashboard", icon: Home, href: "/doctor/dashboard" },
          { id: "patients", label: "Patients", icon: Users, href: "/doctor/patients" },
          { id: "appointments", label: "Appointments", icon: Calendar, href: "/doctor/appointments" },
          { id: "documents", label: "Documents", icon: Folder, href: "/doctor/documents" },
          { id: "prescriptions", label: "Prescriptions", icon: Pill, href: "/doctor/prescriptions" },
          { id: "wellness", label: "Wellness Library", icon: BookOpen, href: "/doctor/wellness" },
          { id: "chat", label: "Chat Support", icon: MessageCircle, href: "/doctor/chat" },
          { id: "community", label: "Community", icon: User, href: "/doctor/community" },
          { id: "teleconsultation", label: "Teleconsultation", icon: Video, href: "/doctor/teleconsultation" },
        ]}
      />

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
                placeholder="Search prescriptions..."
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
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-8">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Pill className="h-7 w-7 text-purple-600" />
                Prescriptions
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Create, manage, and track patient prescriptions
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTemplate(true)}
                className="flex items-center gap-2 rounded-lg border border-purple-300 bg-purple-50 px-6 py-3 font-semibold text-purple-700 shadow-sm transition hover:bg-purple-100"
              >
                <BookOpen className="h-5 w-5" />
                Templates
              </button>
              <button
                onClick={() => setShowBuilder(true)}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-purple-700"
              >
                <Plus className="h-5 w-5" />
                New Prescription
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilterTab("active")}
              className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
                filterTab === "active"
                  ? "bg-purple-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Active ({prescriptions.filter((p) => p.status === "active").length})
            </button>
            <button
              onClick={() => setFilterTab("all")}
              className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
                filterTab === "all"
                  ? "bg-purple-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All ({prescriptions.length})
            </button>
            <button
              onClick={() => setFilterTab("history")}
              className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
                filterTab === "history"
                  ? "bg-purple-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              History ({prescriptions.filter((p) => p.status === "expired").length})
            </button>
          </div>

          {/* Prescriptions Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredPrescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
                onViewFull={(id) => {
                  setSelectedPrescription(prescription);
                  setShowPDFPreview(true);
                }}
                onDownload={(id) => {
                  // Handle download
                  console.log("Download prescription", id);
                }}
                onDuplicate={(id) => {
                  setShowBuilder(true);
                  // Pre-fill builder with duplicate data
                }}
                onRevoke={(id) => {
                  // Handle revoke
                  console.log("Revoke prescription", id);
                }}
              />
            ))}
          </div>

          {filteredPrescriptions.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <Pill className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600">No prescriptions found</p>
              <button
                onClick={() => setShowBuilder(true)}
                className="mt-4 rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white hover:bg-purple-700"
              >
                Create First Prescription
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <PrescriptionBuilderModal isOpen={showBuilder} onClose={() => setShowBuilder(false)} />
      <TemplateLibraryModal
        isOpen={showTemplate}
        onClose={() => setShowTemplate(false)}
        onSelectTemplate={(template) => {
          console.log("Selected template:", template);
        }}
      />
      <PDFPreviewModal
        isOpen={showPDFPreview}
        onClose={() => setShowPDFPreview(false)}
        prescription={selectedPrescription}
      />
    </div>
  );
}