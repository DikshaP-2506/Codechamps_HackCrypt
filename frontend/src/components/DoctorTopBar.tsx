"use client";

import { useState } from "react";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { Bell, HelpCircle, Menu, Search, Settings, LogOut } from "lucide-react";

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

export function DoctorTopBar({
  title,
  showSearch = true,
  searchPlaceholder = "Search...",
  notificationCount = 0,
}: {
  title?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  notificationCount?: number;
}) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [profileOpen, setProfileOpen] = useState(false);

  const userName = user?.fullName || "Doctor";
  const userImage = user?.imageUrl;

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/sign-in" });
  };

  return (
    <div className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        {/* Left: optional menu/title/search */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
          {title ? (
            <h1 className="text-xl font-bold text-gray-900 truncate">{title}</h1>
          ) : null}
          {showSearch && (
            <div className="relative hidden w-80 sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
              <Bell className="h-6 w-6" />
            </button>
            {notificationCount > 0 && (
              <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse-soft">
                {notificationCount}
              </div>
            )}
          </div>

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
                  <Link
                    href="/doctor/settings"
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-emerald-50"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <button
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-emerald-50"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Help & Support</span>
                  </button>
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
