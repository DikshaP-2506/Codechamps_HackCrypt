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
  report_details?: {
    test_date?: string;
    laboratory?: string;
    test_category?: string;
    priority?: string;
    ordering_doctor?: string;
    report_notes?: string;
  };
}

export default function PatientDocumentsPage() {
  const { user } = useUser();
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    document_type: 'Lab Report',
    category: 'medical_records',
    description: '',
    test_date: new Date().toISOString().split('T')[0],
    laboratory: '',
    test_category: '',
    priority: 'normal',
    ordering_doctor: '',
    report_notes: '',
  });

  // Doctors list
  const [doctors, setDoctors] = useState<Array<{ id: string; name: string; specialization?: string }>>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const response = await fetch('http://localhost:5001/api/users/doctors');
      const data = await response.json();
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/medical-documents/patient/${user.id}`);
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
    fetchDocuments();
  }, [user?.id]);

  // Handle file upload
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !user?.id) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('patient_id', user.id);
    formData.append('uploaded_by', user.id);
    formData.append('document_type', uploadData.document_type);
    formData.append('category', uploadData.category);
    formData.append('description', uploadData.description);

    // Add metadata with additional fields
    const metadata = {
      test_date: uploadData.test_date,
      laboratory: uploadData.laboratory,
      test_category: uploadData.test_category,
      priority: uploadData.priority,
      ordering_doctor: uploadData.ordering_doctor,
      report_notes: uploadData.report_notes,
    };
    formData.append('metadata', JSON.stringify(metadata));

    try {
      const response = await fetch('http://localhost:5001/api/medical-documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Document uploaded successfully!');
        setSelectedFile(null);
        setUploadData({
          document_type: 'Lab Report',
          category: 'medical_records',
          description: '',
          test_date: new Date().toISOString().split('T')[0],
          laboratory: '',
          test_category: '',
          priority: 'normal',
          ordering_doctor: '',
          report_notes: '',
        });
        fetchDocuments(); // Refresh list
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

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

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">My Medical Documents</h1>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select File</label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              accept="image/*,application/pdf"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Document Type</label>
              <select
                value={uploadData.document_type}
                onChange={(e) => setUploadData({ ...uploadData, document_type: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Lab Report">Lab Report</option>
                <option value="Prescription">Prescription</option>
                <option value="X-Ray">X-Ray</option>
                <option value="MRI Scan">MRI Scan</option>
                <option value="CT Scan">CT Scan</option>
                <option value="Blood Test">Blood Test</option>
                <option value="Ultrasound">Ultrasound</option>
                <option value="ECG/EKG">ECG/EKG</option>
                <option value="Pathology Report">Pathology Report</option>
                <option value="Discharge Summary">Discharge Summary</option>
                <option value="Medical Certificate">Medical Certificate</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Test Date</label>
              <input
                type="date"
                value={uploadData.test_date}
                onChange={(e) => setUploadData({ ...uploadData, test_date: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Laboratory/Department</label>
              <select
                value={uploadData.laboratory}
                onChange={(e) => setUploadData({ ...uploadData, laboratory: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select lab...</option>
                <option value="Hematology">Hematology</option>
                <option value="Radiology">Radiology</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pathology">Pathology</option>
                <option value="Microbiology">Microbiology</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Test Category</label>
              <select
                value={uploadData.test_category}
                onChange={(e) => setUploadData({ ...uploadData, test_category: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category...</option>
                <option value="Routine">Routine</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Emergency">Emergency</option>
                <option value="Pre-operative">Pre-operative</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Priority Level</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priority"
                  value="normal"
                  checked={uploadData.priority === 'normal'}
                  onChange={(e) => setUploadData({ ...uploadData, priority: e.target.value })}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm">⚪ Normal</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priority"
                  value="urgent"
                  checked={uploadData.priority === 'urgent'}
                  onChange={(e) => setUploadData({ ...uploadData, priority: e.target.value })}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm">🟡 Urgent</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priority"
                  value="emergency"
                  checked={uploadData.priority === 'emergency'}
                  onChange={(e) => setUploadData({ ...uploadData, priority: e.target.value })}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm">🔴 Emergency</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ordering Doctor</label>
            <select
              value={uploadData.ordering_doctor}
              onChange={(e) => setUploadData({ ...uploadData, ordering_doctor: e.target.value })}
              disabled={loadingDoctors}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingDoctors ? 'Loading doctors...' : 'Select doctor...'}
              </option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name} {doc.specialization ? `- ${doc.specialization}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={uploadData.category}
              onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="medical_records">Medical Records</option>
              <option value="lab_results">Lab Results</option>
              <option value="imaging">Imaging</option>
              <option value="prescriptions">Prescriptions</option>
              <option value="insurance">Insurance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (Optional)</label>
            <textarea
              value={uploadData.description}
              onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
              placeholder="Add notes about this document..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Report Notes (Optional)</label>
            <textarea
              value={uploadData.report_notes}
              onChange={(e) => setUploadData({ ...uploadData, report_notes: e.target.value })}
              placeholder="Add any additional observations or notes about this report..."
              maxLength={500}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <p className="mt-1 text-right text-xs text-gray-500">
              [{uploadData.report_notes.length}/500]
            </p>
          </div>

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">My Documents</h2>
        
        {loading ? (
          <p className="text-center py-8 text-gray-600">Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-center py-8 text-gray-600">No documents uploaded yet</p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="border rounded-lg p-4 hover:shadow-md transition flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      {doc.file_type.includes('pdf') ? (
                        <span className="text-2xl">📄</span>
                      ) : (
                        <span className="text-2xl">🖼️</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{doc.file_name}</h3>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>{doc.document_type}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>•</span>
                        <span>{formatDate(doc.uploaded_at)}</span>
                        {doc.report_details?.priority && doc.report_details.priority !== 'normal' && (
                          <>
                            <span>•</span>
                            <span className={`font-semibold ${
                              doc.report_details.priority === 'emergency' ? 'text-red-600' : 'text-orange-600'
                            }`}>
                              {doc.report_details.priority === 'emergency' ? '🔴 EMERGENCY' : '🟡 URGENT'}
                            </span>
                          </>
                        )}
                      </div>
                      {doc.description && (
                        <p className="text-sm text-gray-700 mt-1">{doc.description}</p>
                      )}
                      {doc.report_details && (
                        <div className="text-xs text-gray-600 mt-2 space-y-1">
                          {doc.report_details.test_date && (
                            <p>📅 Test Date: {new Date(doc.report_details.test_date).toLocaleDateString()}</p>
                          )}
                          {doc.report_details.laboratory && (
                            <p>🏥 Lab: {doc.report_details.laboratory}</p>
                          )}
                          {doc.report_details.ordering_doctor && (
                            <p>👨‍⚕️ Doctor: {doc.report_details.ordering_doctor}</p>
                          )}
                          {doc.report_details.report_notes && (
                            <p>📝 Notes: {doc.report_details.report_notes}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    View
                  </a>
                  <a
                    href={doc.file_url}
                    download
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
