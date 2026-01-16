"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  Home,
  Users,
  Calendar,
  BarChart2,
  FileText,
  Pill,
  Target,
  Video,
  Heart,
  Settings,
  LogOut,
  Bell,
  Search,
  Filter,
  UserPlus,
  Edit,
  Printer,
  Share2,
  Archive,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Activity,
  ClipboardList,
  FileHeart,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
  Droplet,
  Cake,
  HelpCircle,
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
      className="flex items-center justify-center rounded-full border border-gray-200 bg-gradient-to-br from-emerald-100 to-emerald-50 font-mono font-semibold text-emerald-700"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

// Sidebar Component (reused from dashboard)
function Sidebar() {
  const navItems = [
    { label: "Dashboard", icon: Home, href: "/doctor/dashboard" },
    { label: "Patients", icon: Users, active: true, href: "/doctor/patients" },
    { label: "Appointments", icon: Calendar, href: "/doctor/appointments" },
    { label: "Analytics", icon: BarChart2, href: "/doctor/analytics" },
    { label: "Documents", icon: FileText, href: "/doctor/documents" },
    { label: "Prescriptions", icon: Pill, href: "/doctor/prescriptions" },
    { label: "Treatment Plans", icon: Target, href: "/doctor/treatment-plans" },
    { label: "Teleconsultation", icon: Video, href: "/doctor/teleconsultation" },
    { label: "Wellness Library", icon: Heart, href: "/doctor/wellness" },
    { label: "Collaboration", icon: Users, href: "/doctor/collaboration" },
    { label: "Settings", icon: Settings, href: "/doctor/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-60 flex-col bg-emerald-900 md:flex">
      <div className="border-b border-emerald-700 px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <div className="transition-transform hover:scale-105">
            <Avatar name="Dr. Emily Carter" size={56} />
          </div>
          <div className="text-center">
            <h3 className="text-base font-semibold text-white">Dr. Emily Carter</h3>
            <p className="text-sm text-white/70">Cardiologist</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, icon: Icon, active, href }) => (
          <Link
            key={label}
            href={href}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-emerald-100/20 text-white"
                : "text-white/70 hover:bg-emerald-700/40"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-emerald-700 p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 py-3 text-red-400 transition-all hover:bg-red-500 hover:text-white">
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

// Top Bar Component
function TopBar() {
  const { signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    signOut({ redirectUrl: "/sign-in" });
  };

  return (
    <div className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3 flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
              <Bell className="h-6 w-6" />
            </button>
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse-soft">
              5
            </div>
          </div>

          <button className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:rotate-45 duration-300">
            <Settings className="h-6 w-6" />
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center rounded-full border border-gray-200 p-1 transition hover:border-gray-300"
            >
              <Avatar name="Emily Carter" size={40} />
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

// Patient Card Component
function PatientCard({
  patient,
  isSelected,
  onClick,
}: {
  patient: any;
  isSelected: boolean;
  onClick: () => void;
}) {
  const riskColor =
    patient.riskLevel === "High"
      ? "bg-red-500"
      : patient.riskLevel === "Medium"
      ? "bg-yellow-500"
      : "bg-emerald-500";

  return (
    <div
      onClick={onClick}
      className={`mb-3 cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
        isSelected
          ? "border-emerald-500 bg-emerald-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar name={patient.name} size={48} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {patient.name}
            </h3>
            <div className={`h-2 w-2 rounded-full ${riskColor}`} />
          </div>
          <p className="text-xs text-gray-500">{patient.id}</p>
          <p className="mt-1 text-xs text-gray-600">
            {patient.age} • {patient.gender}
          </p>
          <div className="mt-2">
            <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
              {patient.condition}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Last visit: {patient.lastVisit}
          </p>
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ patient }: { patient: any }) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Last Visit", value: patient.lastVisit, icon: Calendar },
          { label: "Next Appointment", value: patient.nextAppt, icon: Clock },
          { label: "Total Visits", value: patient.totalVisits, icon: Activity },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-200 bg-gray-50 p-4"
          >
            <div className="flex items-center gap-2 text-gray-600">
              <stat.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <p className="mt-2 text-lg font-semibold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Contact Info */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-base font-semibold text-gray-900">
          Contact Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{patient.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{patient.email}</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
            <span className="text-sm text-gray-700">{patient.address}</span>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <h3 className="text-base font-semibold text-red-900">
            Emergency Contact
          </h3>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">
            {patient.emergencyContact.name} ({patient.emergencyContact.relation})
          </p>
          <p className="text-sm text-gray-700">
            {patient.emergencyContact.phone}
          </p>
        </div>
      </div>

      {/* Care Team */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Care Team</h3>
        <div className="space-y-3">
          {patient.careTeam.map((member: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3">
              <Avatar name={member.name} size={36} />
              <div>
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment Plans */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-base font-semibold text-gray-900">
          Active Treatment Plans
        </h3>
        <div className="space-y-3">
          {patient.treatmentPlans.map((plan: any, idx: number) => (
            <div
              key={idx}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <p className="text-sm font-medium text-gray-900">{plan.name}</p>
              <p className="mt-1 text-xs text-gray-600">{plan.duration}</p>
              <div className="mt-2">
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${plan.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Medical History Tab Component
function MedicalHistoryTab({ patient }: { patient: any }) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const sections = [
    {
      id: "chronic",
      title: "Chronic Conditions",
      icon: Activity,
      items: patient.medicalHistory.chronicConditions,
    },
    {
      id: "allergies",
      title: "Allergies",
      icon: AlertCircle,
      items: patient.medicalHistory.allergies,
      highlight: true,
    },
    {
      id: "surgeries",
      title: "Past Surgeries",
      icon: ClipboardList,
      items: patient.medicalHistory.surgeries,
    },
    {
      id: "family",
      title: "Family History",
      icon: Users,
      items: patient.medicalHistory.familyHistory,
    },
    {
      id: "immunizations",
      title: "Immunizations",
      icon: FileHeart,
      items: patient.medicalHistory.immunizations,
    },
  ];

  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const isExpanded = expandedSections.includes(section.id);
        return (
          <div
            key={section.id}
            className={`rounded-lg border ${
              section.highlight ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"
            }`}
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between p-4 text-left transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <section.icon
                  className={`h-5 w-5 ${
                    section.highlight ? "text-red-600" : "text-gray-600"
                  }`}
                />
                <span className="text-sm font-semibold text-gray-900">
                  {section.title}
                </span>
                <span className="text-xs text-gray-500">
                  ({section.items.length})
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {isExpanded && (
              <div className="border-t border-gray-200 p-4">
                <div className="space-y-2">
                  {section.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className={`rounded-lg ${
                        section.highlight
                          ? "bg-red-100 text-red-900"
                          : "bg-gray-50 text-gray-900"
                      } p-3`}
                    >
                      {typeof item === "string" ? (
                        <p className="text-sm">{item}</p>
                      ) : (
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          {item.date && (
                            <p className="text-xs text-gray-600">{item.date}</p>
                          )}
                          {item.notes && (
                            <p className="mt-1 text-xs text-gray-600">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Main Patients Page Component
export default function PatientsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState("PT-001234");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const patients = [
    {
      id: "PT-001234",
      name: "John Doe",
      age: 45,
      gender: "Male",
      bloodGroup: "A+",
      condition: "Hypertension",
      lastVisit: "Jan 15, 2024",
      nextAppt: "Jan 25, 2024",
      totalVisits: "24",
      riskLevel: "High",
      phone: "+1 (555) 123-4567",
      email: "john.doe@email.com",
      address: "123 Main St, New York, NY 10001",
      emergencyContact: {
        name: "Jane Doe",
        relation: "Spouse",
        phone: "+1 (555) 987-6543",
      },
      careTeam: [
        { name: "Dr. Emily Carter", role: "Primary Cardiologist" },
        { name: "Dr. Sarah Johnson", role: "Consulting Physician" },
      ],
      treatmentPlans: [
        {
          name: "Hypertension Management",
          duration: "6 months",
          progress: 65,
        },
        { name: "Cardiac Rehabilitation", duration: "3 months", progress: 40 },
      ],
      medicalHistory: {
        chronicConditions: ["Hypertension", "Type 2 Diabetes"],
        allergies: ["Penicillin", "Peanuts", "Latex"],
        surgeries: [
          {
            name: "Appendectomy",
            date: "March 2018",
            notes: "Routine procedure, no complications",
          },
          {
            name: "Knee Arthroscopy",
            date: "July 2020",
            notes: "Sports injury repair",
          },
        ],
        familyHistory: [
          "Father: Heart Disease",
          "Mother: Diabetes",
          "Brother: Asthma",
        ],
        immunizations: [
          { name: "COVID-19", date: "Dec 2023" },
          { name: "Influenza", date: "Oct 2023" },
          { name: "Tetanus", date: "Jan 2022" },
        ],
      },
    },
    {
      id: "PT-001235",
      name: "Sarah Johnson",
      age: 32,
      gender: "Female",
      bloodGroup: "O+",
      condition: "Anxiety",
      lastVisit: "Jan 12, 2024",
      nextAppt: "Jan 22, 2024",
      totalVisits: "12",
      riskLevel: "Low",
      phone: "+1 (555) 234-5678",
      email: "sarah.j@email.com",
      address: "456 Oak Ave, Brooklyn, NY 11201",
      emergencyContact: {
        name: "Michael Johnson",
        relation: "Brother",
        phone: "+1 (555) 876-5432",
      },
      careTeam: [{ name: "Dr. Emily Carter", role: "Psychiatrist" }],
      treatmentPlans: [
        { name: "Cognitive Behavioral Therapy", duration: "3 months", progress: 80 },
      ],
      medicalHistory: {
        chronicConditions: ["Generalized Anxiety Disorder"],
        allergies: ["Shellfish"],
        surgeries: [],
        familyHistory: ["Mother: Depression", "Aunt: Bipolar Disorder"],
        immunizations: [
          { name: "COVID-19", date: "Nov 2023" },
          { name: "HPV", date: "Aug 2023" },
        ],
      },
    },
    {
      id: "PT-001236",
      name: "Michael Green",
      age: 58,
      gender: "Male",
      bloodGroup: "B+",
      condition: "Diabetes",
      lastVisit: "Jan 10, 2024",
      nextAppt: "Jan 28, 2024",
      totalVisits: "36",
      riskLevel: "Medium",
      phone: "+1 (555) 345-6789",
      email: "m.green@email.com",
      address: "789 Pine Rd, Queens, NY 11375",
      emergencyContact: {
        name: "Emma Green",
        relation: "Daughter",
        phone: "+1 (555) 765-4321",
      },
      careTeam: [
        { name: "Dr. Emily Carter", role: "Endocrinologist" },
        { name: "Dr. Lisa Brown", role: "Dietitian" },
      ],
      treatmentPlans: [
        { name: "Diabetes Management", duration: "12 months", progress: 50 },
        { name: "Weight Loss Program", duration: "6 months", progress: 30 },
      ],
      medicalHistory: {
        chronicConditions: ["Type 2 Diabetes", "Obesity"],
        allergies: ["Sulfa drugs"],
        surgeries: [
          { name: "Gallbladder Removal", date: "May 2019", notes: "Laparoscopic" },
        ],
        familyHistory: ["Father: Diabetes", "Mother: Stroke", "Sister: Diabetes"],
        immunizations: [
          { name: "COVID-19", date: "Dec 2023" },
          { name: "Pneumonia", date: "Sep 2023" },
        ],
      },
    },
  ];

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "medical", label: "Medical History", icon: ClipboardList },
    { id: "vitals", label: "Vitals", icon: Activity },
    { id: "mental", label: "Mental Health", icon: Heart },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "timeline", label: "Timeline", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="md:ml-60">
        <div className="flex h-[calc(100vh-73px)]">
          {/* Left Panel - Patient List */}
          <div className="w-full lg:w-[400px] border-r border-gray-200 bg-white overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              {/* Filters */}
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                <Filter className="h-4 w-4" />
                Filters
              </button>

              {/* Add New Patient Button */}
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                <UserPlus className="h-4 w-4" />
                Add New Patient
              </button>

              {/* Patient Cards */}
              <div className="space-y-2">
                {filteredPatients.map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    isSelected={patient.id === selectedPatientId}
                    onClick={() => setSelectedPatientId(patient.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Patient Details */}
          {selectedPatient && (
            <div className="flex-1 overflow-y-auto bg-gray-50">
              <div className="p-6 space-y-6">
                {/* Patient Header */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <Avatar name={selectedPatient.name} size={96} />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {selectedPatient.name}
                        </h2>
                        <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {selectedPatient.id}
                          </span>
                          <span className="flex items-center gap-1">
                            <Cake className="h-4 w-4" />
                            {selectedPatient.age} yrs
                          </span>
                          <span>{selectedPatient.gender}</span>
                          <span className="flex items-center gap-1">
                            <Droplet className="h-4 w-4" />
                            {selectedPatient.bloodGroup}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50">
                        <Printer className="h-5 w-5" />
                      </button>
                      <button className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50">
                        <Share2 className="h-5 w-5" />
                      </button>
                      <button className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-red-50 hover:text-red-600">
                        <Archive className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                            activeTab === tab.id
                              ? "bg-emerald-100 text-emerald-700"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <tab.icon className="h-4 w-4" />
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tab Content */}
                <div>
                  {activeTab === "overview" && (
                    <OverviewTab patient={selectedPatient} />
                  )}
                  {activeTab === "medical" && (
                    <MedicalHistoryTab patient={selectedPatient} />
                  )}
                  {activeTab === "vitals" && (
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <p className="text-center text-gray-500">
                        Vitals tab content coming soon...
                      </p>
                    </div>
                  )}
                  {activeTab === "mental" && (
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <p className="text-center text-gray-500">
                        Mental Health tab content coming soon...
                      </p>
                    </div>
                  )}
                  {activeTab === "documents" && (
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <p className="text-center text-gray-500">
                        Documents tab content coming soon...
                      </p>
                    </div>
                  )}
                  {activeTab === "timeline" && (
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                      <p className="text-center text-gray-500">
                        Timeline tab content coming soon...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
