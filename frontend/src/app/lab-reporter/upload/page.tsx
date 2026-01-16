"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Upload,
  List,
  Search,
  CheckCircle2,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
  User,
  X,
  Calendar,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Download,
  Trash2,
  Plus,
  ChevronDown,
  Info,
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
      className="flex items-center justify-center rounded-full border border-gray-200 bg-gradient-to-br from-teal-100 to-teal-50 font-mono font-semibold text-teal-700"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

// Sidebar Component
function Sidebar({ active }: { active: string }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/lab-reporter/dashboard" },
    { id: "upload", label: "Upload Reports", icon: Upload, href: "/lab-reporter/upload" },
    { id: "my-uploads", label: "My Uploads", icon: List, href: "/lab-reporter/my-uploads" },
    { id: "pending", label: "Pending Review", icon: AlertCircle, href: "/lab-reporter/pending" },
    { id: "verified", label: "Verified Reports", icon: CheckCircle2, href: "/lab-reporter/verified" },
    { id: "analytics", label: "Analytics", icon: HelpCircle, href: "/lab-reporter/analytics" },
    { id: "settings", label: "Settings", icon: Settings, href: "/lab-reporter/settings" },
  ];

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-gradient-to-b from-teal-700 to-teal-800 text-white">
      {/* Profile Section */}
      <div className="border-b border-teal-600 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Avatar name="Lab Technician" size={48} />
          <div className="flex-1">
            <p className="font-semibold text-white">Lab Technician</p>
            <p className="text-xs text-teal-200">Lab Reporter</p>
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
                    ? "bg-teal-600 text-white"
                    : "text-teal-100 hover:bg-teal-600/50"
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
      <div className="border-t border-teal-600 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-teal-100 transition hover:bg-teal-600/50">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

// Upload Zone Component
function UploadZone({
  onFilesSelected,
  isDragging,
  onDragEnter,
  onDragLeave,
  onDrop,
}: {
  onFilesSelected: (files: FileList) => void;
  isDragging: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition ${
        isDragging
          ? "border-teal-600 bg-teal-50"
          : "border-teal-600 bg-gray-50 hover:bg-teal-50 hover:border-solid"
      }`}
      style={{ minHeight: "300px" }}
    >
      <Upload className={`h-16 w-16 mb-4 ${isDragging ? "text-teal-600 animate-pulse" : "text-teal-500"}`} />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        📤 Drag & Drop Files Here
      </h3>
      <p className="text-gray-600 mb-4">or click to browse from computer</p>
      <input
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.dcm"
        onChange={(e) => e.target.files && onFilesSelected(e.target.files)}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
      >
        Browse Files
      </label>
      <p className="mt-4 text-sm text-gray-500">
        Supported: PDF, JPG, PNG, DICOM (Max 25MB)
      </p>
    </div>
  );
}

// Patient Search Component
function PatientSearch({
  onSelectPatient,
}: {
  onSelectPatient: (patient: any) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  const mockPatients = [
    { id: "P-12847", name: "John Doe", age: 45, gender: "M", bloodGroup: "O+", allergies: "Penicillin" },
    { id: "P-13892", name: "Jane Smith", age: 32, gender: "F", bloodGroup: "A+", allergies: "None" },
    { id: "P-14523", name: "Mike Wilson", age: 58, gender: "M", bloodGroup: "B+", allergies: "None" },
    { id: "P-15678", name: "Sarah Brown", age: 29, gender: "F", bloodGroup: "AB+", allergies: "Latex" },
  ];

  const filteredPatients = mockPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Search Patient *
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="🔍 Search by name, ID, or phone..."
          className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      {/* Autocomplete Dropdown */}
      {showResults && searchTerm && filteredPatients.length > 0 && (
        <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
          {filteredPatients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => {
                onSelectPatient(patient);
                setSearchTerm("");
                setShowResults(false);
              }}
              className="w-full border-b border-gray-100 p-4 text-left transition hover:bg-gray-50 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Avatar name={patient.name} size={40} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{patient.name}</p>
                  <p className="text-sm text-gray-600">
                    ID: {patient.id} | Age: {patient.age} | {patient.gender}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Selected Patient Card Component
function SelectedPatientCard({
  patient,
  onRemove,
}: {
  patient: any;
  onRemove: () => void;
}) {
  const dob = "15/03/1980";
  
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Selected Patient</h3>
        <button
          onClick={onRemove}
          className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-start gap-3">
        <Avatar name={patient.name} size={48} />
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{patient.name}</p>
          <p className="text-sm text-gray-600">ID: {patient.id}</p>
          <p className="text-sm text-gray-600">DOB: {dob} ({patient.age} years)</p>
          <p className="text-sm text-gray-600">Blood Group: {patient.bloodGroup}</p>
          {patient.allergies !== "None" && (
            <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-red-600">
              <AlertCircle className="h-4 w-4" />
              ⚠️ Allergies: {patient.allergies}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// File Preview Component
function FilePreview({
  file,
  onRemove,
}: {
  file: { name: string; size: number; warning?: string };
  onRemove: () => void;
}) {
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  const isImage = ["jpg", "jpeg", "png"].includes(fileExt || "");
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isImage ? (
            <ImageIcon className="h-5 w-5 text-blue-600" />
          ) : (
            <FileText className="h-5 w-5 text-red-600" />
          )}
          <span className="font-medium text-gray-900">{file.name}</span>
          <span className="text-sm text-gray-500">{sizeMB} MB</span>
        </div>
        <button
          onClick={onRemove}
          className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="h-32 rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-sm text-gray-500">[Preview thumbnail]</p>
      </div>
      {file.warning ? (
        <p className="mt-2 flex items-center gap-1 text-sm text-orange-600">
          <AlertCircle className="h-4 w-4" />
          {file.warning}
        </p>
      ) : (
        <p className="mt-2 flex items-center gap-1 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          ✓ File validated
        </p>
      )}
    </div>
  );
}

// Bulk Upload Modal
function BulkUploadModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [bulkFiles, setBulkFiles] = useState([
    { name: "blood_test_p12847.pdf", patient: "Auto", status: "✓" },
    { name: "xray_p13892.jpg", patient: "Manual", status: "⚠️" },
    { name: "mri_p14523.pdf", patient: "Auto", status: "✓" },
    { name: "ultrasound_p12847.pdf", patient: "Auto", status: "✓" },
    { name: "ecg_p15678.pdf", patient: "Manual", status: "⚠️" },
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            📋 Bulk Upload Mode
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-6 text-gray-600">Upload multiple reports at once</p>

        {/* Bulk Drop Zone */}
        <div className="mb-6 rounded-xl border-2 border-dashed border-teal-600 bg-gray-50 p-8 text-center">
          <Upload className="mx-auto mb-3 h-12 w-12 text-teal-600" />
          <p className="text-gray-700 font-medium">Drag multiple files or folders here</p>
        </div>

        {/* Template Download */}
        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Template Download:</p>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Download className="h-4 w-4" />
            📥 Download CSV Template for batch metadata
          </button>
        </div>

        {/* Bulk Upload Queue */}
        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-gray-900">
            Bulk Upload Queue ({bulkFiles.length} files)
          </h3>
          <div className="space-y-2 rounded-lg border border-gray-300 bg-white p-4">
            {bulkFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b border-gray-100 py-2 last:border-b-0"
              >
                <span className="text-sm text-gray-700">
                  {idx + 1}. {file.name}
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm ${
                      file.patient === "Auto" ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    [Patient: {file.patient}]
                  </span>
                  <span>{file.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File Naming Convention Info */}
        <div className="mb-6 rounded-lg bg-gray-100 p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">File Naming Convention:</p>
              <p className="text-sm text-gray-600 mt-1">
                reporttype_patientid_date.extension
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Example: bloodtest_P12847_20260116.pdf
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel Bulk Upload
          </button>
          <button className="flex-1 rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white transition hover:bg-teal-700">
            Process All Files
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Upload Page Component
export default function LabReporterUpload() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: number; warning?: string }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [notificationCount] = useState(5);

  // Form state
  const [reportType, setReportType] = useState("");
  const [testDate, setTestDate] = useState("");
  const [laboratory, setLaboratory] = useState("");
  const [testCategory, setTestCategory] = useState("");
  const [priority, setPriority] = useState("normal");
  const [orderingDoctor, setOrderingDoctor] = useState("");
  const [notes, setNotes] = useState("");
  const [notifyPatient, setNotifyPatient] = useState(true);
  const [notifyDoctor, setNotifyDoctor] = useState(true);

  const reportTypes = [
    "Blood Test",
    "X-Ray",
    "CT Scan",
    "MRI Scan",
    "Ultrasound",
    "ECG/EKG",
    "Pathology Report",
    "Microbiology Culture",
    "Other (specify)",
  ];

  const laboratories = ["Hematology", "Radiology", "Cardiology", "Pathology", "Microbiology"];
  const categories = ["Routine", "Follow-up", "Emergency", "Pre-operative"];
  const doctors = ["Dr. Sarah Lee", "Dr. John Smith", "Dr. Emily Brown", "Dr. Mike Wilson"];

  const handleFilesSelected = (files: FileList) => {
    const newFiles = Array.from(files).map((file) => {
      const warning = file.size < 500000 ? "Low resolution (review recommended)" : undefined;
      return { name: file.name, size: file.size, warning };
    });
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log("Submitting upload...");
    // Handle form submission
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar active="upload" />

      {/* Main Content Area */}
      <div className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 border-b border-gray-200 bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Page Title */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">Upload Reports</h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowBulkUpload(true)}
                className="flex items-center gap-2 rounded-lg border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"
              >
                <Upload className="h-4 w-4" />
                Bulk Upload
              </button>
              <button className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
                <Bell className="h-6 w-6" />
                {notificationCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {notificationCount}
                  </span>
                )}
              </button>
              <button className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
                <Settings className="h-6 w-6" />
              </button>
              <div className="rounded-full border-2 border-teal-200">
                <Avatar name="Lab Technician" size={40} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-8">
          {/* Upload Zone */}
          <div className="mb-8">
            <UploadZone
              onFilesSelected={handleFilesSelected}
              isDragging={isDragging}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
          </div>

          {/* Upload Form */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Patient & Report Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Selection */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Patient Selection</h2>
                <PatientSearch onSelectPatient={setSelectedPatient} />

                {selectedPatient && (
                  <div className="mt-4">
                    <SelectedPatientCard
                      patient={selectedPatient}
                      onRemove={() => setSelectedPatient(null)}
                    />
                  </div>
                )}
              </div>

              {/* Report Details Form */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Report Details</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Report Type */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Report Type *
                    </label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="">Select type...</option>
                      {reportTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Test Date */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Test Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={testDate}
                        onChange={(e) => setTestDate(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Laboratory/Department */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Laboratory/Department *
                    </label>
                    <select
                      value={laboratory}
                      onChange={(e) => setLaboratory(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="">Select lab...</option>
                      {laboratories.map((lab) => (
                        <option key={lab} value={lab}>
                          {lab}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Test Category */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Test Category
                    </label>
                    <select
                      value={testCategory}
                      onChange={(e) => setTestCategory(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="">Select category...</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority Level */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Priority Level
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="priority"
                          value="normal"
                          checked={priority === "normal"}
                          onChange={(e) => setPriority(e.target.value)}
                          className="h-4 w-4 text-teal-600"
                        />
                        <span className="text-sm text-gray-700">⚪ Normal</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="priority"
                          value="urgent"
                          checked={priority === "urgent"}
                          onChange={(e) => setPriority(e.target.value)}
                          className="h-4 w-4 text-teal-600"
                        />
                        <span className="text-sm text-gray-700">⚪ Urgent</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="priority"
                          value="emergency"
                          checked={priority === "emergency"}
                          onChange={(e) => setPriority(e.target.value)}
                          className="h-4 w-4 text-teal-600"
                        />
                        <span className="text-sm text-gray-700">⚪ Emergency</span>
                      </label>
                    </div>
                  </div>

                  {/* Ordering Doctor */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Ordering Doctor
                    </label>
                    <select
                      value={orderingDoctor}
                      onChange={(e) => setOrderingDoctor(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="">Select doctor...</option>
                      {doctors.map((doc) => (
                        <option key={doc} value={doc}>
                          {doc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Report Notes */}
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Report Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    maxLength={500}
                    placeholder="Add any additional observations or notes about this report..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <p className="mt-1 text-right text-xs text-gray-500">
                    [{notes.length}/500]
                  </p>
                </div>

                {/* Notification Checkboxes */}
                <div className="mt-4 space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notifyPatient}
                      onChange={(e) => setNotifyPatient(e.target.checked)}
                      className="h-4 w-4 rounded text-teal-600"
                    />
                    <span className="text-sm text-gray-700">☑️ Notify patient when verified</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notifyDoctor}
                      onChange={(e) => setNotifyDoctor(e.target.checked)}
                      className="h-4 w-4 rounded text-teal-600"
                    />
                    <span className="text-sm text-gray-700">☑️ Notify ordering doctor</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - File Preview */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sticky top-24">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Uploaded Files ({uploadedFiles.length})
                  </h2>
                  <label
                    htmlFor="add-more-files"
                    className="cursor-pointer text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    [+ Add More]
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.dcm"
                    onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
                    className="hidden"
                    id="add-more-files"
                  />
                </div>

                <div className="space-y-4">
                  {uploadedFiles.map((file, idx) => (
                    <FilePreview key={idx} file={file} onRemove={() => handleRemoveFile(idx)} />
                  ))}

                  {uploadedFiles.length === 0 && (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                      <FileText className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-500">No files uploaded yet</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button className="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50">
                    Save as Draft
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedPatient || uploadedFiles.length === 0}
                    className="w-full rounded-lg bg-teal-600 px-4 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Upload & Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bulk Upload Modal */}
      <BulkUploadModal isOpen={showBulkUpload} onClose={() => setShowBulkUpload(false)} />
    </div>
  );
}
