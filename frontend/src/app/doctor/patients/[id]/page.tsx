'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Activity, FileText, Pill, Calendar, Heart, AlertCircle } from 'lucide-react';

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
}

interface Vital {
  _id: string;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  heart_rate: number;
  temperature: number;
  oxygen_saturation: number;
  respiratory_rate: number;
  weight?: number;
  height?: number;
  bmi?: number;
  recorded_at: string;
  recorded_by: string;
  notes?: string;
}

interface MedicalDocument {
  _id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  document_type: string;
  category: string;
  description?: string;
  uploaded_at: string;
  report_details?: {
    test_date?: string;
    laboratory?: string;
    test_category?: string;
    priority?: string;
    ordering_doctor?: string;
    report_notes?: string;
  };
}

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'documents' | 'history'>('overview');

  useEffect(() => {
    if (patientId) {
      fetchPatientDetails();
      fetchPatientVitals();
      fetchPatientDocuments();
    }
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${patientId}`);
      const data = await response.json();
      if (data.success) {
        setPatient(data.data);
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };

  const fetchPatientVitals = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/physical-vitals/patient/${patientId}?limit=50`);
      const data = await response.json();
      if (data.success) {
        setVitals(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching vitals:', error);
    }
  };

  const fetchPatientDocuments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/medical-documents/patient/${patientId}`);
      const data = await response.json();
      if (data.success) {
        setDocuments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getBPStatus = (systolic: number, diastolic: number) => {
    if (systolic >= 140 || diastolic >= 90) return { text: 'High', color: 'text-red-600 bg-red-100' };
    if (systolic < 90 || diastolic < 60) return { text: 'Low', color: 'text-blue-600 bg-blue-100' };
    return { text: 'Normal', color: 'text-green-600 bg-green-100' };
  };

  const getHeartRateStatus = (hr: number) => {
    if (hr > 100) return { text: 'High', color: 'text-red-600 bg-red-100' };
    if (hr < 60) return { text: 'Low', color: 'text-blue-600 bg-blue-100' };
    return { text: 'Normal', color: 'text-green-600 bg-green-100' };
  };

  const getOxygenStatus = (o2: number) => {
    if (o2 < 90) return { text: 'Critical', color: 'text-red-600 bg-red-100' };
    if (o2 < 95) return { text: 'Low', color: 'text-yellow-600 bg-yellow-100' };
    return { text: 'Normal', color: 'text-green-600 bg-green-100' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-gray-600 mt-4">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Patient not found</p>
          <button
            onClick={() => router.push('/doctor/patients')}
            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/doctor/patients')}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Patients
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-emerald-600">
                    {patient.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <span>Age: {calculateAge(patient.date_of_birth)} years</span>
                    <span>•</span>
                    <span>Gender: {patient.gender}</span>
                    <span>•</span>
                    <span>Blood: {patient.blood_group || 'N/A'}</span>
                    <span>•</span>
                    <span>ID: {patient._id}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {patient.allergies && patient.allergies.length > 0 && (
                      <span className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full font-medium">
                        ⚠️ {patient.allergies.length} Allergies
                      </span>
                    )}
                    {patient.chronic_conditions && patient.chronic_conditions.length > 0 && (
                      <span className="px-3 py-1 text-xs bg-orange-100 text-orange-800 rounded-full font-medium">
                        {patient.chronic_conditions.length} Chronic Conditions
                      </span>
                    )}
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      patient.is_active !== false 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {patient.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'vitals', label: `Vitals (${vitals.length})`, icon: Activity },
                { id: 'documents', label: `Documents (${documents.length})`, icon: FileText },
                { id: 'history', label: 'Medical History', icon: Heart },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center gap-2 py-4 border-b-2 transition ${
                    activeTab === id
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Phone Number</label>
                    <p className="font-medium text-gray-900">{patient.phone_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Address</label>
                    <p className="font-medium text-gray-900">{patient.address || 'Not provided'}</p>
                  </div>
                  <div className="pt-3 border-t">
                    <label className="text-sm text-gray-600">Emergency Contact</label>
                    <p className="font-medium text-gray-900">{patient.emergency_contact_name || 'Not provided'}</p>
                    {patient.emergency_contact_phone && (
                      <p className="text-sm text-gray-600">{patient.emergency_contact_phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Vitals</p>
                    <p className="text-2xl font-bold text-blue-600">{vitals.length}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Documents</p>
                    <p className="text-2xl font-bold text-purple-600">{documents.length}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Allergies</p>
                    <p className="text-2xl font-bold text-red-600">{patient.allergies?.length || 0}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Conditions</p>
                    <p className="text-2xl font-bold text-orange-600">{patient.chronic_conditions?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* Latest Vitals */}
              {vitals.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-emerald-600" />
                    Latest Vitals
                    <span className="text-sm text-gray-500 font-normal ml-2">
                      ({formatDate(vitals[0].recorded_at)})
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(() => {
                      const latest = vitals[0];
                      const bpStatus = getBPStatus(latest.blood_pressure_systolic, latest.blood_pressure_diastolic);
                      const hrStatus = getHeartRateStatus(latest.heart_rate);
                      const o2Status = getOxygenStatus(latest.oxygen_saturation);
                      
                      return (
                        <>
                          <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">Blood Pressure</p>
                            <p className="text-xl font-bold text-gray-900">
                              {latest.blood_pressure_systolic}/{latest.blood_pressure_diastolic}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${bpStatus.color}`}>
                              {bpStatus.text}
                            </span>
                          </div>
                          <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">Heart Rate</p>
                            <p className="text-xl font-bold text-gray-900">{latest.heart_rate} bpm</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${hrStatus.color}`}>
                              {hrStatus.text}
                            </span>
                          </div>
                          <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">Oxygen Saturation</p>
                            <p className="text-xl font-bold text-gray-900">{latest.oxygen_saturation}%</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${o2Status.color}`}>
                              {o2Status.text}
                            </span>
                          </div>
                          <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">Temperature</p>
                            <p className="text-xl font-bold text-gray-900">{latest.temperature}°F</p>
                            <span className="text-xs px-2 py-1 rounded-full text-gray-600 bg-gray-100">
                              {latest.temperature >= 99.5 ? 'Elevated' : 'Normal'}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Vitals Tab */}
          {activeTab === 'vitals' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Vitals History</h3>
              {vitals.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No vitals recorded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vitals.map((vital) => {
                    const bpStatus = getBPStatus(vital.blood_pressure_systolic, vital.blood_pressure_diastolic);
                    const hrStatus = getHeartRateStatus(vital.heart_rate);
                    const o2Status = getOxygenStatus(vital.oxygen_saturation);
                    
                    return (
                      <div key={vital._id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{formatDate(vital.recorded_at)}</p>
                            {vital.notes && (
                              <p className="text-sm text-gray-600 mt-1">{vital.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div>
                            <p className="text-xs text-gray-600">Blood Pressure</p>
                            <p className="font-semibold">{vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${bpStatus.color}`}>
                              {bpStatus.text}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Heart Rate</p>
                            <p className="font-semibold">{vital.heart_rate} bpm</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${hrStatus.color}`}>
                              {hrStatus.text}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">O2 Saturation</p>
                            <p className="font-semibold">{vital.oxygen_saturation}%</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${o2Status.color}`}>
                              {o2Status.text}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Temperature</p>
                            <p className="font-semibold">{vital.temperature}°F</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Respiratory</p>
                            <p className="font-semibold">{vital.respiratory_rate}/min</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Medical Documents</h3>
              {documents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc._id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {doc.file_type.includes('pdf') ? (
                              <span className="text-2xl">📄</span>
                            ) : (
                              <span className="text-2xl">🖼️</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900">{doc.file_name}</h4>
                            <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-600">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {doc.document_type}
                              </span>
                              <span>{formatFileSize(doc.file_size)}</span>
                              <span>•</span>
                              <span>{formatDate(doc.uploaded_at)}</span>
                            </div>
                            {doc.description && (
                              <p className="text-sm text-gray-600 mt-2">{doc.description}</p>
                            )}
                            {doc.report_details && (
                              <div className="mt-2 text-xs text-gray-600 space-y-1">
                                {doc.report_details.test_date && (
                                  <p>📅 Test Date: {new Date(doc.report_details.test_date).toLocaleDateString()}</p>
                                )}
                                {doc.report_details.laboratory && (
                                  <p>🏥 Lab: {doc.report_details.laboratory}</p>
                                )}
                                {doc.report_details.ordering_doctor && (
                                  <p>👨‍⚕️ Doctor: {doc.report_details.ordering_doctor}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition text-sm"
                          >
                            View
                          </a>
                          <a
                            href={doc.file_url}
                            download
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition text-sm"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Medical History Tab */}
          {activeTab === 'history' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Allergies */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Allergies
                </h3>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="space-y-2">
                    {patient.allergies.map((allergy, idx) => (
                      <div key={idx} className="px-3 py-2 bg-red-50 text-red-800 rounded-lg border border-red-200">
                        <p className="font-medium">{allergy}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No allergies recorded</p>
                )}
              </div>

              {/* Chronic Conditions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-orange-600" />
                  Chronic Conditions
                </h3>
                {patient.chronic_conditions && patient.chronic_conditions.length > 0 ? (
                  <div className="space-y-2">
                    {patient.chronic_conditions.map((condition, idx) => (
                      <div key={idx} className="px-3 py-2 bg-orange-50 text-orange-800 rounded-lg border border-orange-200">
                        <p className="font-medium">{condition}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No chronic conditions recorded</p>
                )}
              </div>

              {/* Past Surgeries */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Pill className="h-5 w-5 text-purple-600" />
                  Past Surgeries
                </h3>
                {patient.past_surgeries && patient.past_surgeries.length > 0 ? (
                  <div className="space-y-2">
                    {patient.past_surgeries.map((surgery, idx) => (
                      <div key={idx} className="px-3 py-2 bg-purple-50 text-purple-800 rounded-lg border border-purple-200">
                        <p className="font-medium">{surgery}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No past surgeries recorded</p>
                )}
              </div>

              {/* Family History */}
              {patient.family_history && (
                <div className="bg-white rounded-lg shadow-md p-6 md:col-span-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Family History</h3>
                  <p className="text-gray-700">{patient.family_history}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
