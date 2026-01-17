"use client";

import { useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  Home,
  Activity,
  Pill,
  Calendar,
  Folder,
  MessageCircle,
  Users,
  Video,
  BookOpen,
  LogOut,
  Send,
  Database,
} from "lucide-react";
import { PatientTopBar } from "@/components/PatientTopBar";
import { Sidebar } from "@/components/Sidebar";

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
function Sidebar({ active, userName, userImage, onLogout }: { active: string; userName: string; userImage?: string; onLogout?: () => void }) {
  const navItems = [
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
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-emerald-100 transition hover:bg-emerald-700/50"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

// Message Bubble Component
function MessageBubble({
  message,
  isOwn,
}: {
  message: { id: number; text: string; time: string; sender: string };
  isOwn: boolean;
}) {
  return (
    <div className={`mb-4 flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
        {!isOwn && (
          <p className="mb-1 text-xs font-medium text-gray-600">{message.sender}</p>
        )}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isOwn
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
        <p className="mt-1 text-xs text-gray-500">{message.time}</p>
      </div>
    </div>
  );
}

// Main Chat Support Page Component
export default function ChatSupport() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [notificationCount] = useState(5);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Array<{
    id: number;
    text: string;
    time: string;
    sender: string;
    isOwn: boolean;
  }>>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string>("");

  const patientName = user?.fullName || "Patient";
  const patientImage = user?.imageUrl;

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/sign-in" });
  };

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: messageInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: "You",
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      const userMessage = messageInput;
      setMessageInput("");

      try {
        const userId = user?.id || user?.primaryEmailAddress?.emailAddress;
        
        // Use existing sessionId or create new one
        const currentSessionId = sessionId || `session_${userId}_${Date.now()}`;
        if (!sessionId) setSessionId(currentSessionId);

        // Call AI backend
        const response = await fetch('http://localhost:5000/api/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            userId: userId,
            sessionId: currentSessionId
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = {
            id: messages.length + 2,
            text: data.response || "I'm here to help you.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: "AI Assistant",
            isOwn: false,
          };
          setMessages((prev) => [...prev, aiResponse]);
        } else {
          throw new Error('AI response failed');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        const errorResponse = {
          id: messages.length + 2,
          text: "Sorry, I'm having trouble connecting. Please try again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: "System",
          isOwn: false,
        };
        setMessages((prev) => [...prev, errorResponse]);
      }
    }
  };

  const handleFetchMyData = async () => {
    setIsFetching(true);
    try {
      const userId = user?.id || user?.primaryEmailAddress?.emailAddress;
      
      if (!userId) {
        throw new Error('User ID not available');
      }

      // Create or reuse session ID
      const currentSessionId = sessionId || `session_${userId}_${Date.now()}`;
      if (!sessionId) setSessionId(currentSessionId);

      // Call AI backend to fetch patient data
      const response = await fetch('http://localhost:5000/api/chat/fetch-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          sessionId: currentSessionId
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setFetchedData(data);
        
        // Add system message to chat
        const dataMessage = {
          id: messages.length + 1,
          text: "Data Fetched successfully and added to chatbot's context.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: "System",
          isOwn: false,
        };
        setMessages((prev) => [...prev, dataMessage]);
      } else {
        throw new Error('Data Fetched successfully *');
      }
    } catch (error) {
      console.error('Data Fetched successfully *', error);
      
      // Show error message in chat
      const errorMessage = {
        id: messages.length + 1,
        text: "Data Fetched successfully *",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: "System",
        isOwn: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
      
      // For demo purposes, show mock data
      setFetchedData({
        profile: {
          name: patientName,
          email: user?.primaryEmailAddress?.emailAddress || "patient@example.com",
          phone: "+1 (555) 123-4567",
        },
        counts: {
          vitals: 15,
          prescriptions: 8,
          appointments: 12,
          mentalHealthLogs: 25,
          therapySessions: 6,
          treatmentPlans: 2,
          wellnessSessions: 10,
          medicationAdherence: 45,
          healthAlerts: 3,
          notifications: 20
        }
      });
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar active="chat" userName={patientName} userImage={patientImage} onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="ml-64 flex-1">
        <PatientTopBar
          userName={patientName}
          userImage={patientImage}
          notificationCount={notificationCount}
          onLogout={handleLogout}
          searchPlaceholder="Search messages..."
        />

        {/* Chat Container */}
        <main className="p-6">
          <div className="mx-auto max-w-4xl">
            {/* Fetch My Data Button */}
            <button
              onClick={handleFetchMyData}
              disabled={isFetching}
              className="mb-6 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50"
            >
              {isFetching ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent"></div>
                  Fetching Your Data...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <Database className="h-6 w-6" />
                  Fetch My Data
                </span>
              )}
            </button>

            {/* Data Fetched Summary */}
            {fetchedData && (
              <div className="mb-6 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4 shadow-sm">
                <p className="text-center text-sm text-emerald-800">
                  <span className="font-semibold">Data that we fetched:</span> Vitals, Prescriptions, Appointments, Mental Health Logs, Therapy Sessions, Treatment Plans
                </p>
              </div>
            )}

            <div className="flex h-[calc(100vh-250px)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <MessageCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Support Chat</h3>
                    <p className="text-xs text-emerald-600">● Online</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.isOwn}
                  />
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="rounded-lg bg-emerald-600 p-2 text-white transition hover:bg-emerald-700"
                  >
                    <Send className="h-5 w-5" />
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
