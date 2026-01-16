"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Settings, HelpCircle, User, LogOut, Search } from "lucide-react";
import { useUser, useAuth } from "@clerk/nextjs";

interface PatientTopBarProps {
  userName: string;
  userImage?: string;
  notificationCount?: number;
  onLogout?: () => void;
  searchPlaceholder?: string;
}

export function PatientTopBar({
  userName,
  userImage,
  notificationCount = 0,
  onLogout,
  searchPlaceholder = "Search...",
}: PatientTopBarProps) {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
      return;
    }
    await signOut({ redirectUrl: "/sign-in" });
  };

  return (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 w-96">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="flex-1 border-none bg-transparent text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
              <Bell className="h-6 w-6" />
            </button>
            {notificationCount > 0 && (
              <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {notificationCount}
              </div>
            )}
          </div>

          <button className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
            <Settings className="h-6 w-6" />
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center rounded-full border-2 border-emerald-200 p-0 transition hover:border-emerald-300"
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
                <div className="p-2">
                  {[
                    { label: "Profile", icon: User, href: "/patient/profile" },
                    { label: "Account Settings", icon: Settings, href: "/patient/settings" },
                    { label: "Help & Support", icon: HelpCircle, href: "/help" },
                  ].map(({ label, icon: Icon, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-emerald-50"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
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
