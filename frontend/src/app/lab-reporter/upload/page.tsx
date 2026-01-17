"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
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
function Sidebar({ active, userData }: { active: string; userData: any }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/lab-reporter/dashboard" },
    { id: "upload", label: "Upload Reports", icon: Upload, href: "/lab-reporter/upload" },
    
  ];

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-gradient-to-b from-teal-700 to-teal-800 text-white">
      {/* Profile Section */}
      <div className="border-b border-teal-600 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Avatar name={userData?.name || "Lab Reporter"} size={48} />
          <div className="flex-1">
            <p className="font-semibold text-white">{userData?.name || "Loading..."}</p>
            <p className="text-xs text-teal-200">{userData?.role === 'lab_reporter' ? 'Lab Reporter' : 'Lab Technician'}</p>
            
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

// No separate patient search component needed - using simple text input

// File Preview Component
function FilePreview({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  const isImage = ["jpg", "jpeg", "png"].includes(fileExt || "");
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
  const warning = file.size < 500000 ? "Low resolution (review recommended)" : undefined;

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
      {warning ? (
        <p className="mt-2 flex items-center gap-1 text-sm text-orange-600">
          <AlertCircle className="h-4 w-4" />
          {warning}
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




// Main Upload Page Component
export default function LabReporterUpload() {
  const { user } = useUser();
  const [patientName, setPatientName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<Array<File>>([]);
  const [isDragging, setIsDragging] = useState(false);
  
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

  // Doctors list from database
  const [doctors, setDoctors] = useState<Array<{ id: string; name: string; specialization?: string }>>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Fetch user data from database
  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/profile?clerkId=${user?.id}`);
      const data = await response.json();
      if (data.success) {
        setUserData(data.user);
      } else {
        // Fallback to Clerk data
        setUserData({
          name: user?.fullName || user?.firstName + ' ' + user?.lastName,
          email: user?.primaryEmailAddress?.emailAddress,
          id: user?.id,
          role: 'lab_reporter'
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to Clerk data
      setUserData({
        name: user?.fullName || user?.firstName + ' ' + user?.lastName,
        email: user?.primaryEmailAddress?.emailAddress,
        id: user?.id,
        role: 'lab_reporter'
      });
    }
  };

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/doctors');
      const data = await response.json();
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoadingDoctors(false);
    }
  };

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

  const handleFilesSelected = (files: FileList) => {
    const newFiles = Array.from(files);
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

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please select at least one file to upload');
      return;
    }

    if (!patientName.trim()) {
      alert('Please enter patient name before uploading');
      return;
    }

    // Upload each file
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      
      try {
        const formData = new FormData();
        
        formData.append('file', file);
        formData.append('patient_id', patientName);
        formData.append('uploaded_by', 'lab_reporter_id'); // Replace with actual lab reporter ID
        formData.append('document_type', reportType || 'Lab Report');
        formData.append('category', testCategory || 'lab_results');
        formData.append('description', notes);
        formData.append('notify_patient', notifyPatient.toString());
        formData.append('notify_doctor', notifyDoctor.toString());
        
        const metadata = {
          test_date: testDate,
          laboratory: laboratory,
          test_category: testCategory,
          ordering_doctor: orderingDoctor,
          priority: priority,
          report_notes: notes
        };
        formData.append('metadata', JSON.stringify(metadata));

        // Upload to backend (Cloudinary)
        const uploadResponse = await fetch('http://localhost:5000/api/medical-documents/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await uploadResponse.json();

        if (!data.success) {
          alert(`Failed to upload ${file.name}: ${data.message}`);
        } else {
          console.log(`Successfully uploaded ${file.name} to Cloudinary`);
        }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        alert(`Error uploading ${file.name}. Please try again.`);
      }
    }

    // Success
    alert('All files uploaded successfully to Cloudinary!');
    
    // Reset form
    setUploadedFiles([]);
    setPatientName('');
    setReportType('');
    setTestDate('');
    setLaboratory('');
    setTestCategory('');
    setPriority('normal');
    setOrderingDoctor('');
    setNotes('');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar active="upload" userData={userData} />

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
              {/* Patient Name Input */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Patient Information</h2>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    required
                  />
                </div>
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
                      disabled={loadingDoctors}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {loadingDoctors ? 'Loading doctors...' : 'Select doctor...'}
                      </option>
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.name}>
                          {doc.name} {doc.specialization ? `- ${doc.specialization}` : ''}
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
                    disabled={uploadedFiles.length === 0}
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

      
    </div>
  );
}
