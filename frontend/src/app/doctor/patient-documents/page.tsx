'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

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
  uploaded_by: string;
  patient_id: string;
  metadata?: any;
}

interface Patient {
  _id: string;
  clerk_user_id: string;
  name: string;
  blood_group?: string;
  date_of_birth?: string;
}

export default function DoctorDocumentsPage() {
  const { user } = useUser();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    document_type: '',
    category: '',
  });

  // Search patients
  const searchPatients = async (query: string) => {
    if (query.length < 2) {
      setPatients([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/patients?search=${query}&limit=10`);
      const data = await response.json();
      
      if (data.success) {
        setPatients(data.data);
      }
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };

  // Fetch documents for selected patient
  const fetchPatientDocuments = async (patientId: string) => {
    setLoading(true);
    try {
      let url = `http://localhost:5001/api/medical-documents/patient/${patientId}?limit=100`;
      
      if (filter.document_type) {
        url += `&document_type=${filter.document_type}`;
      }
      if (filter.category) {
        url += `&category=${filter.category}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientDocuments(selectedPatient.clerk_user_id || selectedPatient._id);
    }
  }, [selectedPatient, filter]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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

  const getDocumentIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    return '📋';
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      lab_results: 'bg-blue-100 text-blue-800',
      imaging: 'bg-purple-100 text-purple-800',
      medical_records: 'bg-green-100 text-green-800',
      prescriptions: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Patient Medical Documents</h1>
        <p className="text-gray-600 mt-2">View and manage patient medical records</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Patient Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Select Patient</h2>
            
            {/* Patient Search */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                searchPatients(e.target.value);
              }}
              placeholder="Search patient..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />

            {/* Search Results */}
            {patients.length > 0 && !selectedPatient && (
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                {patients.map((patient) => (
                  <button
                    key={patient._id}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setSearchTerm('');
                      setPatients([]);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b last:border-b-0 transition"
                  >
                    <p className="font-semibold text-sm text-gray-900">{patient.name}</p>
                    {patient.blood_group && (
                      <p className="text-xs text-gray-600">Blood: {patient.blood_group}</p>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Selected Patient */}
            {selectedPatient && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{selectedPatient.name}</p>
                    {selectedPatient.blood_group && (
                      <p className="text-sm text-gray-600">Blood: {selectedPatient.blood_group}</p>
                    )}
                    {selectedPatient.date_of_birth && (
                      <p className="text-xs text-gray-500 mt-1">
                        DOB: {new Date(selectedPatient.date_of_birth).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPatient(null);
                      setDocuments([]);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Filters */}
            {selectedPatient && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Document Type</label>
                  <select
                    value={filter.document_type}
                    onChange={(e) => setFilter({ ...filter, document_type: e.target.value })}
                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Blood Test">Blood Test</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="MRI Scan">MRI Scan</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="Ultrasound">Ultrasound</option>
                    <option value="ECG">ECG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Category</label>
                  <select
                    value={filter.category}
                    onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="lab_results">Lab Results</option>
                    <option value="imaging">Imaging</option>
                    <option value="medical_records">Medical Records</option>
                    <option value="prescriptions">Prescriptions</option>
                  </select>
                </div>

                <button
                  onClick={() => setFilter({ document_type: '', category: '' })}
                  className="w-full text-xs text-blue-600 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Documents */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {!selectedPatient ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Select a Patient
                </h3>
                <p className="text-gray-500">
                  Search and select a patient to view their medical documents
                </p>
              </div>
            ) : loading ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-gray-600">Loading documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Documents Found
                </h3>
                <p className="text-gray-500">
                  No medical documents available for this patient
                </p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    Medical Documents ({documents.length})
                  </h2>
                  <button
                    onClick={() => fetchPatientDocuments(selectedPatient.clerk_user_id || selectedPatient._id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                  >
                    🔄 Refresh
                  </button>
                </div>

                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="border rounded-lg p-4 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                            {getDocumentIcon(doc.file_type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{doc.file_name}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {doc.document_type}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getCategoryBadgeColor(doc.category)}`}>
                                {doc.category.replace('_', ' ')}
                              </span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                {formatFileSize(doc.file_size)}
                              </span>
                            </div>
                            {doc.description && (
                              <p className="text-sm text-gray-600 mt-2">{doc.description}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              📅 Uploaded: {formatDate(doc.uploaded_at)}
                            </p>
                            {doc.metadata?.priority && doc.metadata.priority !== 'normal' && (
                              <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                                doc.metadata.priority === 'urgent' ? 'bg-orange-100 text-orange-700' :
                                doc.metadata.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                🚨 {doc.metadata.priority.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
                          >
                            👁️ View
                          </a>
                          <a
                            href={doc.file_url}
                            download
                            className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition whitespace-nowrap"
                          >
                            ⬇️ Download
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
