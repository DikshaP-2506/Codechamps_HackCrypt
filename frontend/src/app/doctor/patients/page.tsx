'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Sidebar } from "@/components/Sidebar";
import {
  Home,
  Users,
  Calendar,
  FileText,
  Pill,
  BookOpen,
  MessageCircle,
  Target,
  Video,
} from "lucide-react";

interface Patient {
  _id: string;
  clerk_user_id?: string;
  name: string;
  date_of_birth: string;
  gender: string;
  blood_group?: string;
  phone_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  past_surgeries?: string[];
  family_history?: string;
  is_active?: boolean;
  created_at: string;
  primary_doctor_id?: {
    name: string;
    specialization: string;
  };
}

export default function DoctorPatientsPage() {
  const { user } = useUser();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPatients, setTotalPatients] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Fetch all patients
  const fetchPatients = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/patients?limit=1000';
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPatients(data.data || []);
        setTotalPatients(data.totalPatients || 0);
      } else {
        console.error('API returned error:', data.message);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      alert('Failed to fetch patients. Please ensure the backend server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = () => {
    fetchPatients();
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        active="patients"
        userName={user?.fullName || "Doctor"}
        userImage={user?.imageUrl}
        userRole="Doctor"
        navItems={[
          { id: "dashboard", label: "Dashboard", icon: Home, href: "/doctor/dashboard" },
          { id: "patients", label: "Patients", icon: Users, href: "/doctor/patients" },
          { id: "appointments", label: "Appointments", icon: Calendar, href: "/doctor/appointments" },
          { id: "documents", label: "Documents", icon: FileText, href: "/doctor/documents" },
          { id: "prescriptions", label: "Prescriptions", icon: Pill, href: "/doctor/prescriptions" },
          { id: "wellness", label: "Wellness Library", icon: BookOpen, href: "/doctor/wellness" },
          { id: "chat", label: "Chat Support", icon: MessageCircle, href: "/doctor/chat" },
          { id: "community", label: "Community", icon: Target, href: "/doctor/community" },
          { id: "teleconsultation", label: "Teleconsultation", icon: Video, href: "/doctor/teleconsultation" },
        ]}
      />
      <div className="md:pl-64">
        <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Patients</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage and view all patient records
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by patient name or phone..."
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Search
          </button>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                fetchPatients();
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            >
              Clear
            </button>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Total Patients: <span className="font-semibold text-blue-600">{totalPatients}</span>
          </p>
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-lg shadow-md">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading patients...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg mb-2">📋 No patients found</p>
            <p className="text-gray-500 text-sm">
              {searchQuery 
                ? 'Try a different search query' 
                : 'No patients registered in the system yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age / Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conditions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {(patient.name || 'Unknown').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            Registered: {formatDate(patient.created_at)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {calculateAge(patient.date_of_birth)} years
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.gender}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {patient.blood_group || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{patient.phone_number || 'N/A'}</div>
                      {patient.emergency_contact_phone && (
                        <div className="text-xs text-gray-400">
                          Emergency: {patient.emergency_contact_phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {patient.chronic_conditions && patient.chronic_conditions.length > 0 ? (
                          <div className="space-y-1">
                            {patient.chronic_conditions.slice(0, 2).map((condition, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded mr-1"
                              >
                                {condition}
                              </span>
                            ))}
                            {patient.chronic_conditions.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{patient.chronic_conditions.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </div>
                      {patient.allergies && patient.allergies.length > 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          ⚠️ {patient.allergies.length} {patient.allergies.length === 1 ? 'allergy' : 'allergies'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.is_active !== false 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a
                        href={`/doctor/patients/${patient._id}`}
                        className="text-emerald-600 hover:text-emerald-900 mr-3 font-medium"
                      >
                        View Full Profile
                      </a>
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Quick View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedPatient.name || 'Unknown'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Patient ID: {selectedPatient._id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedPatient.date_of_birth)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Age:</span>
                      <span className="ml-2 font-medium">{calculateAge(selectedPatient.date_of_birth)} years</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Gender:</span>
                      <span className="ml-2 font-medium">{selectedPatient.gender}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Blood Group:</span>
                      <span className="ml-2 font-medium">{selectedPatient.blood_group || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{selectedPatient.phone_number || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Emergency Contact:</span>
                      <span className="ml-2 font-medium">{selectedPatient.emergency_contact_name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Emergency Phone:</span>
                      <span className="ml-2 font-medium">{selectedPatient.emergency_contact_phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Address:</span>
                      <span className="ml-2 font-medium">{selectedPatient.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div className="bg-orange-50 p-4 rounded-lg col-span-1 md:col-span-2">
                  <h3 className="font-semibold text-orange-900 mb-3">Medical History</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-2">Allergies:</p>
                      {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                        <div className="space-y-1">
                          {selectedPatient.allergies.map((allergy, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded mr-1 mb-1"
                            >
                              {allergy}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-2">Chronic Conditions:</p>
                      {selectedPatient.chronic_conditions && selectedPatient.chronic_conditions.length > 0 ? (
                        <div className="space-y-1">
                          {selectedPatient.chronic_conditions.map((condition, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded mr-1 mb-1"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-2">Past Surgeries:</p>
                      {selectedPatient.past_surgeries && selectedPatient.past_surgeries.length > 0 ? (
                        <div className="space-y-1">
                          {selectedPatient.past_surgeries.map((surgery, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded mr-1 mb-1"
                            >
                              {surgery}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </div>
                  </div>
                  {selectedPatient.family_history && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 font-medium mb-1">Family History:</p>
                      <p className="text-sm text-gray-700">{selectedPatient.family_history}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}   
    </div>
      </div>
    </div>
  );
}
