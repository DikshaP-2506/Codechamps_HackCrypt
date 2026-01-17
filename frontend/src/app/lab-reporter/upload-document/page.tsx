'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface Patient {
  clerk_user_id: string;
  name: string;
  _id: string;
  blood_group?: string;
  allergies?: string[];
}

interface UploadedDocument {
  _id: string;
  file_name: string;
  file_url: string;
  document_type: string;
  uploaded_at: string;
}

export default function LabReporterUploadPage() {
  const { user } = useUser();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [recentUploads, setRecentUploads] = useState<UploadedDocument[]>([]);
  
  const [formData, setFormData] = useState({
    document_type: 'Lab Report',
    category: 'lab_results',
    description: '',
    test_date: new Date().toISOString().split('T')[0],
    priority: 'normal',
  });

  // Search patients
  const searchPatients = async (query: string) => {
    if (query.length < 2) {
      setPatients([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/patients?search=${query}&limit=10`);
      const data = await response.json();
      
      if (data.success) {
        setPatients(data.data);
      }
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };

  // Handle file upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !selectedPatient || !user?.id) {
      alert('Please select both a patient and a file');
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', selectedFile);
    uploadFormData.append('patient_id', selectedPatient.clerk_user_id || selectedPatient._id);
    uploadFormData.append('uploaded_by', user.id);
    uploadFormData.append('document_type', formData.document_type);
    uploadFormData.append('category', formData.category);
    uploadFormData.append('description', formData.description);
    
    // Add metadata
    const metadata = {
      test_date: formData.test_date,
      priority: formData.priority,
      uploaded_by_name: user.fullName || user.username || 'Lab Reporter',
    };
    uploadFormData.append('metadata', JSON.stringify(metadata));

    try {
      const response = await fetch('http://localhost:5000/api/medical-documents/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Document uploaded successfully!');
        
        // Reset form
        setSelectedFile(null);
        setSelectedPatient(null);
        setSearchTerm('');
        setFormData({
          document_type: 'Lab Report',
          category: 'lab_results',
          description: '',
          test_date: new Date().toISOString().split('T')[0],
          priority: 'normal',
        });
        
        // Add to recent uploads
        setRecentUploads([data.data, ...recentUploads].slice(0, 5));
      } else {
        alert('❌ Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Upload Medical Documents</h1>
        <p className="text-gray-600 mt-2">Upload lab reports and medical documents for patients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form - Left Side */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpload} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            
            {/* Patient Search */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                1. Search Patient
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  searchPatients(e.target.value);
                }}
                placeholder="Search by name or ID..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              
              {/* Patient Search Results */}
              {patients.length > 0 && !selectedPatient && (
                <div className="mt-2 border rounded-lg max-h-48 overflow-y-auto">
                  {patients.map((patient) => (
                    <button
                      key={patient._id}
                      type="button"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setSearchTerm('');
                        setPatients([]);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition"
                    >
                      <p className="font-semibold text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">
                        {patient.blood_group && `Blood Group: ${patient.blood_group}`}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Patient Display */}
              {selectedPatient && (
                <div className="mt-3 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">✓ Selected: {selectedPatient.name}</p>
                      <p className="text-sm text-gray-600">
                        {selectedPatient.blood_group && `Blood Group: ${selectedPatient.blood_group}`}
                      </p>
                      {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                        <p className="text-sm text-red-600 mt-1">
                          ⚠️ Allergies: {selectedPatient.allergies.join(', ')}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPatient(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* File Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                2. Select Document
              </label>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                accept="image/*,application/pdf"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-2">
                  📄 {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>

            {/* Document Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Document Type</label>
                <select
                  value={formData.document_type}
                  onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Lab Report">Lab Report</option>
                  <option value="Blood Test">Blood Test</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="MRI Scan">MRI Scan</option>
                  <option value="CT Scan">CT Scan</option>
                  <option value="Ultrasound">Ultrasound</option>
                  <option value="ECG">ECG</option>
                  <option value="Pathology Report">Pathology Report</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="lab_results">Lab Results</option>
                  <option value="imaging">Imaging</option>
                  <option value="medical_records">Medical Records</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Test Date</label>
                <input
                  type="date"
                  value={formData.test_date}
                  onChange={(e) => setFormData({ ...formData, test_date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes/Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add any important notes about this document..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !selectedFile || !selectedPatient}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
            >
              {uploading ? '⏳ Uploading to Cloudinary...' : '📤 Upload Document'}
            </button>
          </form>
        </div>

        {/* Recent Uploads - Right Side */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Recent Uploads</h2>
            
            {recentUploads.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No recent uploads</p>
            ) : (
              <div className="space-y-3">
                {recentUploads.map((doc) => (
                  <div key={doc._id} className="border rounded-lg p-3">
                    <p className="font-medium text-sm text-gray-900 truncate">{doc.file_name}</p>
                    <p className="text-xs text-gray-600">{doc.document_type}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(doc.uploaded_at).toLocaleString()}
                    </p>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal-600 hover:underline mt-1 inline-block"
                    >
                      View Document →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Tips */}
          <div className="bg-blue-50 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-sm text-blue-900 mb-2">📋 Upload Tips</h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Supported: PDF, JPG, PNG</li>
              <li>• Max file size: 10MB</li>
              <li>• Use clear, high-resolution scans</li>
              <li>• Add detailed descriptions</li>
              <li>• Mark urgent cases appropriately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
