'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface Patient {
  _id: string;
  clerk_user_id: string;
  name: string;
  date_of_birth: string;
  gender: string;
  blood_group?: string;
  emergency_contact_phone: string;
  allergies?: string[];
  chronic_conditions?: string[];
}

interface Vital {
  _id: string;
  temperature?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  respiratory_rate?: number;
  oxygen_saturation?: number;
  recorded_at: string;
}

interface MentalHealthLog {
  _id: string;
  mood_rating?: number;
  stress_level?: string;
  anxiety_level?: string;
  sleep_hours?: number;
  gad7_score?: number;
  phq9_score?: number;
  recorded_date: string;
}

interface Document {
  _id: string;
  file_name: string;
  file_url: string;
  document_type: string;
  uploaded_at: string;
}

interface Prescription {
  _id: string;
  medication_name: string;
  dosage: string;
  prescribed_at: string;
}

interface ComprehensiveData {
  patient: Patient;
  vitals: Vital[];
  mentalHealthLogs: MentalHealthLog[];
  documents: Document[];
  prescriptions: Prescription[];
  statistics: {
    totalVitals: number;
    totalMentalHealthLogs: number;
    totalDocuments: number;
    totalPrescriptions: number;
  };
}

export default function DoctorPatientsPage() {
  const { user } = useUser();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [comprehensiveData, setComprehensiveData] = useState<ComprehensiveData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'vitals' | 'mental' | 'documents' | 'prescriptions'>('vitals');

  // Fetch doctor's patients
  useEffect(() => {
    if (user?.id) {
      fetchDoctorPatients();
    }
  }, [user?.id]);

  const fetchDoctorPatients = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`http://localhost:5001/api/patients/doctor/${user.id}`);
      const data = await response.json();

      if (data.success) {
        setPatients(data.data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  // Fetch comprehensive patient data
  const fetchPatientData = async (patient: Patient) => {
    setLoading(true);
    setSelectedPatient(patient);

    try {
      const patientId = patient.clerk_user_id || patient._id;
      const response = await fetch(`http://localhost:5001/api/patients/${patientId}/comprehensive`);
      const data = await response.json();

      if (data.success) {
        setComprehensiveData(data.data);
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
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

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">My Patients</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Patients List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Assigned Patients ({patients.length})</h2>

            {patients.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No patients assigned</p>
            ) : (
              <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                {patients.map((patient) => (
                  <button
                    key={patient._id}
                    onClick={() => fetchPatientData(patient)}
                    className={`w-full text-left p-3 rounded-lg border transition ${
                      selectedPatient?._id === patient._id
                        ? 'bg-blue-50 border-blue-500'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{patient.name}</div>
                    <div className="text-sm text-gray-600">
                      {patient.gender} • {calculateAge(patient.date_of_birth)}y • {patient.blood_group}
                    </div>
                    {patient.allergies && patient.allergies.length > 0 && (
                      <div className="text-xs text-red-600 mt-1">⚠️ Allergies</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Patient Details */}
        <div className="lg:col-span-2">
          {!selectedPatient ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">👨‍⚕️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Select a Patient
              </h3>
              <p className="text-gray-500">
                Choose a patient from the list to view their comprehensive health data
              </p>
            </div>
          ) : loading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Loading patient data...</p>
            </div>
          ) : comprehensiveData ? (
            <div className="space-y-6">
              {/* Patient Header */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{comprehensiveData.patient.name}</h2>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>Age: {calculateAge(comprehensiveData.patient.date_of_birth)}</span>
                      <span>•</span>
                      <span>{comprehensiveData.patient.gender}</span>
                      <span>•</span>
                      <span>Blood: {comprehensiveData.patient.blood_group}</span>
                      <span>•</span>
                      <span>📞 {comprehensiveData.patient.emergency_contact_phone}</span>
                    </div>
                    {comprehensiveData.patient.allergies && comprehensiveData.patient.allergies.length > 0 && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <strong>⚠️ Allergies:</strong> {comprehensiveData.patient.allergies.join(', ')}
                      </div>
                    )}
                    {comprehensiveData.patient.chronic_conditions && comprehensiveData.patient.chronic_conditions.length > 0 && (
                      <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                        <strong>📋 Conditions:</strong> {comprehensiveData.patient.chronic_conditions.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">{comprehensiveData.statistics.totalVitals}</div>
                      <div className="text-xs text-gray-600">Vitals</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="text-2xl font-bold text-purple-600">{comprehensiveData.statistics.totalMentalHealthLogs}</div>
                      <div className="text-xs text-gray-600">Mental Logs</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">{comprehensiveData.statistics.totalDocuments}</div>
                      <div className="text-xs text-gray-600">Documents</div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <div className="text-2xl font-bold text-orange-600">{comprehensiveData.statistics.totalPrescriptions}</div>
                      <div className="text-xs text-gray-600">Prescriptions</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab('vitals')}
                    className={`flex-1 py-3 px-4 font-medium transition ${
                      activeTab === 'vitals' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🩺 Vitals ({comprehensiveData.vitals.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('mental')}
                    className={`flex-1 py-3 px-4 font-medium transition ${
                      activeTab === 'mental' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🧠 Mental Health ({comprehensiveData.mentalHealthLogs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`flex-1 py-3 px-4 font-medium transition ${
                      activeTab === 'documents' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📄 Documents ({comprehensiveData.documents.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('prescriptions')}
                    className={`flex-1 py-3 px-4 font-medium transition ${
                      activeTab === 'prescriptions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    💊 Prescriptions ({comprehensiveData.prescriptions.length})
                  </button>
                </div>

                <div className="p-6 max-h-125 overflow-y-auto">
                  {/* Vitals Tab */}
                  {activeTab === 'vitals' && (
                    <div className="space-y-3">
                      {comprehensiveData.vitals.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">No vitals recorded</p>
                      ) : (
                        comprehensiveData.vitals.map((vital) => (
                          <div key={vital._id} className="border rounded-lg p-4">
                            <div className="text-sm text-gray-600 mb-2">
                              {formatDate(vital.recorded_at)}
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {vital.temperature && (
                                <div>
                                  <span className="text-xs text-gray-500">Temp:</span>
                                  <span className="ml-1 font-semibold">{vital.temperature}°F</span>
                                </div>
                              )}
                              {vital.blood_pressure_systolic && vital.blood_pressure_diastolic && (
                                <div>
                                  <span className="text-xs text-gray-500">BP:</span>
                                  <span className="ml-1 font-semibold">{vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}</span>
                                </div>
                              )}
                              {vital.heart_rate && (
                                <div>
                                  <span className="text-xs text-gray-500">HR:</span>
                                  <span className="ml-1 font-semibold">{vital.heart_rate} bpm</span>
                                </div>
                              )}
                              {vital.oxygen_saturation && (
                                <div>
                                  <span className="text-xs text-gray-500">O2:</span>
                                  <span className="ml-1 font-semibold">{vital.oxygen_saturation}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Mental Health Tab */}
                  {activeTab === 'mental' && (
                    <div className="space-y-3">
                      {comprehensiveData.mentalHealthLogs.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">No mental health logs</p>
                      ) : (
                        comprehensiveData.mentalHealthLogs.map((log) => (
                          <div key={log._id} className="border rounded-lg p-4">
                            <div className="text-sm text-gray-600 mb-2">
                              {formatDate(log.recorded_date)}
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {log.mood_rating && (
                                <div>
                                  <span className="text-xs text-gray-500">Mood:</span>
                                  <span className="ml-1 font-semibold">{log.mood_rating}/10</span>
                                </div>
                              )}
                              {log.stress_level && (
                                <div>
                                  <span className="text-xs text-gray-500">Stress:</span>
                                  <span className="ml-1 font-semibold">{log.stress_level}</span>
                                </div>
                              )}
                              {log.anxiety_level && (
                                <div>
                                  <span className="text-xs text-gray-500">Anxiety:</span>
                                  <span className="ml-1 font-semibold">{log.anxiety_level}</span>
                                </div>
                              )}
                              {log.sleep_hours && (
                                <div>
                                  <span className="text-xs text-gray-500">Sleep:</span>
                                  <span className="ml-1 font-semibold">{log.sleep_hours}h</span>
                                </div>
                              )}
                              {log.gad7_score !== undefined && (
                                <div>
                                  <span className="text-xs text-gray-500">GAD-7:</span>
                                  <span className="ml-1 font-semibold">{log.gad7_score}</span>
                                </div>
                              )}
                              {log.phq9_score !== undefined && (
                                <div>
                                  <span className="text-xs text-gray-500">PHQ-9:</span>
                                  <span className="ml-1 font-semibold">{log.phq9_score}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Documents Tab */}
                  {activeTab === 'documents' && (
                    <div className="space-y-3">
                      {comprehensiveData.documents.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">No documents uploaded</p>
                      ) : (
                        comprehensiveData.documents.map((doc) => (
                          <div key={doc._id} className="border rounded-lg p-4 flex justify-between items-center">
                            <div>
                              <div className="font-semibold">{doc.file_name}</div>
                              <div className="text-sm text-gray-600">
                                {doc.document_type} • {formatDate(doc.uploaded_at)}
                              </div>
                            </div>
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                              View
                            </a>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Prescriptions Tab */}
                  {activeTab === 'prescriptions' && (
                    <div className="space-y-3">
                      {comprehensiveData.prescriptions.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">No prescriptions</p>
                      ) : (
                        comprehensiveData.prescriptions.map((rx) => (
                          <div key={rx._id} className="border rounded-lg p-4">
                            <div className="font-semibold">{rx.medication_name}</div>
                            <div className="text-sm text-gray-600">
                              Dosage: {rx.dosage}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Prescribed: {formatDate(rx.prescribed_at)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
