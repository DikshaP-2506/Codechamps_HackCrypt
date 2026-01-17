"use client";

import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Activity,
  FileText,
  Edit,
  Camera,
  Save,
  X,
} from "lucide-react";
import { PatientTopBar } from "@/components/PatientTopBar";
import { Sidebar } from "@/components/Sidebar";

export default function PatientProfile() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const patientName = user?.fullName || "Patient";
  const patientImage = user?.imageUrl;

  const handleLogout = () => {
    signOut({ redirectUrl: "/sign-in" });
  };

  const [isEditing, setIsEditing] = useState(false);
  
  // Hardcoded demo data
  const [profileData, setProfileData] = useState({
    name: patientName,
    email: user?.primaryEmailAddress?.emailAddress || "patient@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    bloodGroup: "O+",
    address: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    emergencyContactName: "Jane Doe",
    emergencyContactPhone: "+1 (555) 987-6543",
    allergies: ["Penicillin", "Peanuts"],
    chronicConditions: ["Hypertension"],
    height: "175 cm",
    weight: "70 kg",
    insurance: "Blue Cross Blue Shield",
    policyNumber: "BC123456789"
  });

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar active="profile" userName={patientName} userImage={patientImage} userRole="Patient" />

      {/* Main Content Area */}
      <div className="ml-64 flex-1">
        <PatientTopBar
          userName={patientName}
          userImage={patientImage}
          notificationCount={5}
          onLogout={handleLogout}
          searchPlaceholder="Search..."
        />

        {/* Main Content */}
        <main className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-gray-600">Manage your personal information and health details</p>
          </div>

          {/* Profile Card */}
          <div className="mb-8 rounded-xl bg-gradient-to-r from-[#006045] to-emerald-700 p-8 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
                    {patientImage ? (
                      <img src={patientImage} alt={patientName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/20 text-4xl font-bold">
                        {patientName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 rounded-full bg-white p-2 text-[#006045] shadow-md hover:bg-gray-100">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                {/* Basic Info */}
                <div>
                  <h2 className="text-3xl font-bold">{profileData.name}</h2>
                  <p className="mt-2 text-emerald-100">{profileData.email}</p>
                  <div className="mt-4 flex gap-4">
                    <div className="rounded-lg bg-white/20 px-4 py-2">
                      <p className="text-xs text-emerald-100">Age</p>
                      <p className="text-lg font-bold">{calculateAge(profileData.dateOfBirth)} years</p>
                    </div>
                    <div className="rounded-lg bg-white/20 px-4 py-2">
                      <p className="text-xs text-emerald-100">Blood Group</p>
                      <p className="text-lg font-bold">{profileData.bloodGroup}</p>
                    </div>
                    <div className="rounded-lg bg-white/20 px-4 py-2">
                      <p className="text-xs text-emerald-100">Gender</p>
                      <p className="text-lg font-bold">{profileData.gender}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-lg bg-white px-6 py-3 font-semibold text-[#006045] transition-all hover:bg-gray-100"
              >
                {isEditing ? (
                  <>
                    <X className="mr-2 inline h-5 w-5" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 inline h-5 w-5" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Information Sections */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Personal Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-[#006045]" />
                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="mt-1 text-gray-900">{profileData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(profileData.dateOfBirth).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <p className="mt-1 text-gray-900">{profileData.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone Number</label>
                  <p className="mt-1 text-gray-900">{profileData.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email Address</label>
                  <p className="mt-1 text-gray-900">{profileData.email}</p>
                </div>
              </div>
            </div>

            {/* Contact & Address */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#006045]" />
                <h3 className="text-lg font-bold text-gray-900">Address</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Street Address</label>
                  <p className="mt-1 text-gray-900">{profileData.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    <p className="mt-1 text-gray-900">{profileData.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">State</label>
                    <p className="mt-1 text-gray-900">{profileData.state}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">ZIP Code</label>
                  <p className="mt-1 text-gray-900">{profileData.zipCode}</p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-[#006045]" />
                <h3 className="text-lg font-bold text-gray-900">Medical Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Blood Group</label>
                  <p className="mt-1 text-gray-900">{profileData.bloodGroup}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Height</label>
                    <p className="mt-1 text-gray-900">{profileData.height}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Weight</label>
                    <p className="mt-1 text-gray-900">{profileData.weight}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Allergies</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profileData.allergies.map((allergy, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Chronic Conditions</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profileData.chronicConditions.map((condition, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#006045]" />
                <h3 className="text-lg font-bold text-gray-900">Emergency Contact</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Name</label>
                  <p className="mt-1 text-gray-900">{profileData.emergencyContactName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Phone</label>
                  <p className="mt-1 text-gray-900">{profileData.emergencyContactPhone}</p>
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#006045]" />
                <h3 className="text-lg font-bold text-gray-900">Insurance Information</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-600">Insurance Provider</label>
                  <p className="mt-1 text-gray-900">{profileData.insurance}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Policy Number</label>
                  <p className="mt-1 text-gray-900">{profileData.policyNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button (shown when editing) */}
          {isEditing && (
            <div className="mt-8 flex justify-end">
              <button className="rounded-lg bg-[#006045] px-8 py-3 font-semibold text-white transition-all hover:bg-emerald-700">
                <Save className="mr-2 inline h-5 w-5" />
                Save Changes
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
