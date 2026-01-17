"use client";

import React from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
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
} from "lucide-react";

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

function Sidebar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const userName = user?.fullName || user?.firstName || user?.lastName || "Doctor";
  const userImage = user?.imageUrl;

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

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
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col bg-emerald-900 md:flex">
      <div className="border-b border-emerald-700 px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <div className="transition-transform hover:scale-105">
            <Avatar name={userName} imageUrl={userImage} size={56} />
          </div>
          <div className="text-center">
            <h3 className="text-base font-semibold text-white">{userName}</h3>
            <p className="text-sm text-white/70">Cardiologist</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname?.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive ? "bg-emerald-100/20 text-white" : "text-white/70 hover:bg-emerald-700/40"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-emerald-700 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 py-3 text-red-400 transition-all hover:bg-red-500 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:pl-64">
        <main className="min-h-screen px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
