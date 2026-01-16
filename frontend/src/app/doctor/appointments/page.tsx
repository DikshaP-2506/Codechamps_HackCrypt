"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  Home,
  BarChart2,
  FileText,
  Pill,
  Target,
  Video,
  Heart,
  Settings,
  LogOut,
  Bell,
  Menu,
} from "lucide-react";

type Appointment = {
  id: string;
  time: string;
  duration: string;
  type: "Consultation" | "Follow-up" | "Therapy Session" | "Lab Review";
  patientName: string;
  reason: string;
  location: { mode: "In-person" | "Virtual"; detail: string };
};

const appointmentsMock: Appointment[] = [
  {
    id: "1",
    time: "09:30 AM",
    duration: "30 mins",
    type: "Consultation",
    patientName: "Michael Chen",
    reason: "Hypertension Check",
    location: { mode: "In-person", detail: "Clinic Room A" },
  },
  {
    id: "2",
    time: "10:45 AM",
    duration: "20 mins",
    type: "Follow-up",
    patientName: "Emma Wilson",
    reason: "Diabetes Review",
    location: { mode: "Virtual", detail: "Zoom" },
  },
  {
    id: "3",
    time: "12:00 PM",
    duration: "45 mins",
    type: "Therapy Session",
    patientName: "David Kim",
    reason: "Mental Health Check",
    location: { mode: "In-person", detail: "Clinic Room C" },
  },
  {
    id: "4",
    time: "02:00 PM",
    duration: "15 mins",
    type: "Lab Review",
    patientName: "Patricia Brown",
    reason: "Blood Test Results",
    location: { mode: "Virtual", detail: "Teams" },
  },
];

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

function Sidebar() {
  const navItems = [
    { label: "Dashboard", icon: Home, href: "/doctor/dashboard" },
    { label: "Patients", icon: Users, href: "/doctor/patients" },
    { label: "Appointments", icon: Calendar, href: "/doctor/appointments" },
    { label: "Analytics", icon: BarChart2, href: "/doctor/analytics" },
    { label: "Documents", icon: FileText, href: "/doctor/documents" },
    { label: "Prescriptions", icon: Pill, href: "/doctor/prescriptions" },
    { label: "Treatment Plans", icon: Target, href: "/doctor/treatment-plans" },
    { label: "Teleconsultation", icon: Video, href: "/doctor/teleconsultation" },
    { label: "Wellness Library", icon: Heart, href: "/doctor/wellness" },
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
        {navItems.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 text-white/70 hover:bg-emerald-700/40`}
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

function TopBar() {
  return (
    <div className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3 flex-1">
          <button className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative hidden w-80 sm:block">
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>
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
        </div>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentsMock);

  function removeOne(id: string) {
    setAppointments((s) => s.filter((a) => a.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:pl-60">
        <TopBar />

        <div className="max-w-7xl mx-auto p-6">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-emerald-800">Appointments</h1>
            <p className="text-sm text-gray-600 mt-1">Today's Schedule - January 16, 2026</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((a) => (
              <div key={a.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition relative">
                <button
                  onClick={() => removeOne(a.id)}
                  className="absolute right-4 top-4 rounded-md border border-gray-200 bg-white p-1 text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  ✕
                </button>

                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-emerald-800">{a.time}</div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                      {a.duration}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      a.type === "Consultation" ? "bg-emerald-100 text-emerald-800" : a.type === "Follow-up" ? "bg-pink-100 text-pink-800" : a.type === "Therapy Session" ? "bg-violet-100 text-violet-800" : "bg-sky-100 text-sky-800"
                    }`}>{a.type}</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-4 flex items-center gap-4">
                  <Avatar name={a.patientName} size={44} />
                  <div>
                    <div className="font-semibold text-emerald-800">{a.patientName}</div>
                    <div className="text-sm text-gray-500">{a.reason}</div>

                    <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-3.866 0-7 3.134-7 7v1h14v-1c0-3.866-3.134-7-7-7z" /></svg>
                      {a.location.mode} - {a.location.detail}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-md flex items-center justify-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Start
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
