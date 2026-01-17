"use client";

import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Home,
  Activity,
  Calendar,
  Folder,
  Pill,
  BookOpen,
  MessageCircle,
  Users,
  Video,
  LogOut,
} from "lucide-react";

// Avatar Component
function Avatar({ name, imageUrl, size = 40 }: { name: string; imageUrl?: string; size?: number }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="rounded-full border-2 border-white/20 object-cover"
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
      className="flex items-center justify-center rounded-full border-2 border-white/20 bg-white/10 font-semibold text-white backdrop-blur-sm"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  href: string;
}

interface SidebarProps {
  active: string;
  userName: string;
  userImage?: string;
  userRole?: string;
  navItems?: NavItem[];
}

export function Sidebar({ active, userName, userImage, userRole = "User", navItems }: SidebarProps) {
  const { signOut } = useClerk();
  const router = useRouter();

  // Default nav items (for patient)
  const defaultNavItems: NavItem[] = [
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

  const items = navItems || defaultNavItems;

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <div className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-[#006045] text-white shadow-xl">
      {/* Logo/Brand Section */}
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center justify-center gap-3">
          <img src="/logo.jpg" alt="DR.GUIDE Logo" className="h-16 w-16" />
          <div>
            <h1 className="text-left text-2xl font-bold tracking-wide text-white">
              DR.<span className="font-extrabold">GUIDE</span>
            </h1>
            <p className="text-left text-xs text-white/60">Healthcare Companion</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-900/50 text-white shadow-inner"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="border-t border-white/10 px-4 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
