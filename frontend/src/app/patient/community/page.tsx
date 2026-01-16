"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Home,
  Activity,
  Pill,
  Calendar,
  Folder,
  MessageCircle,
  Users,
  User,
  Settings,
  LogOut,
  BookOpen,
  Search,
  Plus,
} from "lucide-react";
import { communityAPI } from "@/lib/api";
import CommunityCard from "../CommunityCard";
import { Button } from "@/components/ui/button";

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

// Sidebar Component
function Sidebar({ active, userName, userImage }: { active: string; userName: string; userImage?: string }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/patient/dashboard" },
    { id: "health", label: "My Health", icon: Activity, href: "/patient/health" },
    { id: "appointments", label: "Appointments", icon: Calendar, href: "/patient/appointments" },
    { id: "documents", label: "Documents", icon: Folder, href: "/patient/documents" },
    { id: "medications", label: "Medications", icon: Pill, href: "/patient/medications" },
    { id: "wellness", label: "Wellness Library", icon: BookOpen, href: "/patient/wellness" },
    { id: "chat", label: "Chat Support", icon: MessageCircle, href: "/patient/chat" },
    { id: "community", label: "Community", icon: Users, href: "/patient/community" },
  ];

  const { signOut } = useAuth();

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white">
      {/* Profile Section */}
      <div className="border-b border-emerald-700 p-6">
        <div className="mb-4 flex items-center gap-3">
          <Avatar name={userName} imageUrl={userImage} size={48} />
          <div className="flex-1">
            <p className="font-semibold text-white">{userName}</p>
            <p className="text-xs text-emerald-200">Patient</p>
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
                    ? "bg-emerald-700 text-white"
                    : "text-emerald-100 hover:bg-emerald-700/50"
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
      <div className="border-t border-emerald-700 p-4">
        <button
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-emerald-100 transition hover:bg-emerald-700/50"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

interface CommunityGroup {
  _id: string;
  name: string;
  topic?: string;
  description?: string;
  visibility: "public" | "private";
  creator_id: string;
  memberCount?: number;
  isMember?: boolean;
}

interface CommunityMessage {
  _id: string;
  sender_id: string;
  sender_name: string;
  text: string;
  created_at: string;
}

export default function CommunityPage() {
  const { user } = useUser();
  const userId = user?.id;
  const userName = useMemo(
    () => user?.fullName || user?.primaryEmailAddress?.emailAddress || "Patient",
    [user]
  );
  const userImage = user?.imageUrl;

  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "public" | "mine">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    topic: "",
    description: "",
    visibility: "public" as "public" | "private",
  });
  const [creating, setCreating] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(null);
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const res = await communityAPI.list(userId || undefined);
      if (res.success) {
        setGroups(res.groups || []);
      }
    } catch (err) {
      console.error("Failed to load communities", err);
    } finally {
      setLoading(false);
    }
  };

  const openGroup = async (id: string) => {
    const group = groups.find((g) => g._id === id);
    if (!group) return;
    setSelectedGroup(group);
    try {
      const res = await communityAPI.listMessages(id, userId || undefined);
      if (res.success) {
        setMessages(res.messages || []);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const handleJoin = async (id: string) => {
    if (!userId) return;
    setActionId(id);
    try {
      await communityAPI.join(id, userId);
      await loadGroups();
    } catch (err) {
      console.error("Join failed", err);
    } finally {
      setActionId(null);
    }
  };

  const handleLeave = async (id: string) => {
    if (!userId) return;
    setActionId(id);
    try {
      await communityAPI.leave(id, userId);
      await loadGroups();
    } catch (err) {
      console.error("Leave failed", err);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!userId) return;
    setActionId(id);
    try {
      await communityAPI.delete(id, userId);
      await loadGroups();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setActionId(null);
    }
  };

  const handleCreateCommunity = async () => {
    if (!userId || !createForm.name.trim()) return;
    setCreating(true);
    try {
      const res = await communityAPI.create(createForm, userId, userName);
      if (res.success) {
        setShowCreateModal(false);
        setCreateForm({ name: "", topic: "", description: "", visibility: "public" });
        await loadGroups();
      }
    } catch (err) {
      console.error("Create failed", err);
    } finally {
      setCreating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedGroup || !messageText.trim() || !userId) return;
    setSendingMessage(true);
    try {
      const res = await communityAPI.sendMessage(
        selectedGroup._id,
        messageText.trim(),
        userId,
        userName
      );
      if (res.success) {
        setMessageText("");
        await openGroup(selectedGroup._id);
      }
    } catch (err) {
      console.error("Send message failed", err);
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredGroups = useMemo(() => {
    let filtered = groups;

    // Filter by tab
    if (activeTab === "public") {
      filtered = filtered.filter((g) => g.visibility === "public");
    } else if (activeTab === "mine") {
      filtered = filtered.filter((g) => g.isMember || g.creator_id === userId);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.name.toLowerCase().includes(query) ||
          g.topic?.toLowerCase().includes(query) ||
          g.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [groups, activeTab, searchQuery, userId]);

  useEffect(() => {
    loadGroups();
  }, [userId]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar active="community" userName={userName} userImage={userImage} />

      {/* Main Content Area */}
      <div className="ml-64 flex-1">
        {/* Main Content */}
        <div className="p-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Community</h1>
            <p className="mt-2 text-lg text-gray-600">
              Join communities to exchange tips, track progress, and stay accountable.
            </p>
          </div>

          {/* Controls Section */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Tabs and Create Button */}
          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="inline-flex rounded-lg bg-white p-1 shadow-sm">
              <button
                onClick={() => setActiveTab("all")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  activeTab === "all"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("public")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  activeTab === "public"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setActiveTab("mine")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  activeTab === "mine"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                My Communities
              </button>
            </div>

            {/* Create Button */}
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-emerald-600 px-5 py-2.5 text-white shadow-md hover:bg-emerald-700"
            >
              <Plus className="h-5 w-5" />
              Create Community
            </Button>
          </div>
        </div>

        {/* Communities Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
              <p className="mt-4 text-gray-600">Loading communities...</p>
            </div>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">No communities found</p>
              <p className="mt-1 text-sm text-gray-600">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Be the first to create a community!"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <CommunityCard
                key={group._id}
                group={group}
                onJoin={handleJoin}
                onDelete={handleDelete}
                onOpen={openGroup}
                onLeave={handleLeave}
                joining={actionId === group._id}
                isMember={group.isMember}
                requestSent={false}
                isCreator={group.creator_id === userId}
              />
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Create Community</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                title="Close modal"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Community Name *</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g., Diabetes Support Group"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Topic */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Topic</label>
                <input
                  type="text"
                  value={createForm.topic}
                  onChange={(e) => setCreateForm({ ...createForm, topic: e.target.value })}
                  placeholder="e.g., Diabetes Management"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Share what this community is about..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>


            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <Button
                onClick={() => setShowCreateModal(false)}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCommunity}
                disabled={creating || !createForm.name.trim()}
                className="bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Right-Side Chat Drawer */}
      {selectedGroup && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setSelectedGroup(null)}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 z-50 h-full w-full flex-col bg-white shadow-2xl sm:max-w-md flex">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedGroup.name}</h2>
                <p className="text-sm text-gray-600">{selectedGroup.topic}</p>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                title="Close chat"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        msg.sender_id === userId
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-gray-900 border border-gray-200"
                      }`}
                    >
                      {msg.sender_id !== userId && (
                        <p className="text-xs font-medium mb-1 opacity-75">{msg.sender_name}</p>
                      )}
                      <p className="text-sm break-words">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender_id === userId ? "text-emerald-100" : "text-gray-400"
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !messageText.trim()}
                  className="bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 px-4 py-2"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
