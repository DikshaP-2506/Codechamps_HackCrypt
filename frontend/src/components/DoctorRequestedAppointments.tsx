"use client";

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PatientInfo {
  _id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
}

interface RequestedAppointment {
  _id: string;
  patient_id: string;
  patient?: PatientInfo;
  appointment_type: string;
  appointment_reason?: string;
  reason?: string;
  preferred_dates: string[];
  preferred_times?: string[];
  status: string;
  created_at: string;
}

interface ApprovalFormData {
  scheduled_date: string;
  start_time: string;
  end_time: string;
  location?: string;
}

interface RejectionFormData {
  rejection_reason: string;
}

export default function DoctorRequestedAppointments({ doctorId }: { doctorId: string }) {
  const [appointments, setAppointments] = useState<RequestedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<RequestedAppointment | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [approvalData, setApprovalData] = useState<ApprovalFormData>({
    scheduled_date: '',
    start_time: '',
    end_time: '',
    location: ''
  });
  const [rejectionData, setRejectionData] = useState<RejectionFormData>({
    rejection_reason: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequestedAppointments();
  }, [doctorId]);

  const fetchRequestedAppointments = async () => {
    console.log('Fetching requested appointments for doctor ID:', doctorId);
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/appointments/doctor/${doctorId}/requested`);
      
      console.log('Requested appointments API response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch requested appointments');
      }
      
      const data = await response.json();
      console.log('Requested appointments data:', data);
      console.log('Requested appointments count:', data.count);
      console.log('Requested appointments array:', data.data);
      setAppointments(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching appointments');
      console.error('Error fetching requested appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (appointment: RequestedAppointment) => {
    setSelectedAppointment(appointment);
    // Pre-fill with first preferred date if available
    if (appointment.preferred_dates && appointment.preferred_dates.length > 0) {
      setApprovalData({
        ...approvalData,
        scheduled_date: appointment.preferred_dates[0]
      });
    }
    setShowApprovalModal(true);
  };

  const handleReject = (appointment: RequestedAppointment) => {
    setSelectedAppointment(appointment);
    setShowRejectionModal(true);
  };

  const submitApproval = async () => {
    if (!selectedAppointment) return;
    
    // Validation
    if (!approvalData.scheduled_date || !approvalData.start_time || !approvalData.end_time) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const response = await fetch(`/api/appointments/${selectedAppointment._id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(approvalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve appointment');
      }

      // Refresh the list
      await fetchRequestedAppointments();
      
      // Close modal and reset
      setShowApprovalModal(false);
      setSelectedAppointment(null);
      setApprovalData({
        scheduled_date: '',
        start_time: '',
        end_time: '',
        location: ''
      });
    } catch (err: any) {
      setError(err.message || 'Error approving appointment');
      console.error('Error approving appointment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const submitRejection = async () => {
    if (!selectedAppointment) return;
    
    // Validation
    if (!rejectionData.rejection_reason || rejectionData.rejection_reason.trim().length < 10) {
      setError('Please provide a detailed reason (at least 10 characters)');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const response = await fetch(`/api/appointments/${selectedAppointment._id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rejectionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject appointment');
      }

      // Refresh the list
      await fetchRequestedAppointments();
      
      // Close modal and reset
      setShowRejectionModal(false);
      setSelectedAppointment(null);
      setRejectionData({
        rejection_reason: ''
      });
    } catch (err: any) {
      setError(err.message || 'Error rejecting appointment');
      console.error('Error rejecting appointment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getPatientName = (appointment: RequestedAppointment): string => {
    if (!appointment.patient) return 'Unknown Patient';
    return `${appointment.patient.firstName} ${appointment.patient.lastName}`;
  };

  const getPatientContact = (appointment: RequestedAppointment): string => {
    if (!appointment.patient) return '';
    return appointment.patient.email || '';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeSlot = (slot: string): string => {
    const mapping: { [key: string]: string } = {
      'morning': '8:00 AM - 12:00 PM',
      'afternoon': '12:00 PM - 5:00 PM',
      'evening': '5:00 PM - 8:00 PM'
    };
    return mapping[slot.toLowerCase()] || slot;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Requested Appointments
          {appointments.length > 0 && (
            <span className="ml-3 px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
              {appointments.length}
            </span>
          )}
        </h2>
      </div>

      {error && !showApprovalModal && !showRejectionModal && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No pending appointment requests</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <User className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {getPatientName(appointment)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getPatientContact(appointment)}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  {appointment.appointment_type.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Preferred Dates:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {appointment.preferred_dates.map((date, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          {formatDate(date)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Preferred Times:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {appointment.preferred_times?.map((slot, index) => (
                        <span key={index} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                          {formatTimeSlot(slot)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {appointment.reason || appointment.appointment_reason || 'No reason provided'}
                  </p>
                </div>

                <p className="text-xs text-gray-500">
                  Requested on {formatDate(appointment.created_at)}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(appointment)}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(appointment)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Approve Appointment</h3>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Patient: <span className="font-semibold">{getPatientName(selectedAppointment.patient_id)}</span>
              </p>
              <p className="text-sm text-gray-600">
                Type: <span className="font-semibold">{selectedAppointment.appointment_type.replace('_', ' ')}</span>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Final Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={approvalData.scheduled_date}
                  onChange={(e) => setApprovalData({ ...approvalData, scheduled_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={approvalData.start_time}
                    onChange={(e) => setApprovalData({ ...approvalData, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={approvalData.end_time}
                    onChange={(e) => setApprovalData({ ...approvalData, end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={approvalData.location}
                  onChange={(e) => setApprovalData({ ...approvalData, location: e.target.value })}
                  placeholder="e.g., Room 201, Main Building"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedAppointment(null);
                  setError(null);
                  setApprovalData({
                    scheduled_date: '',
                    start_time: '',
                    end_time: '',
                    location: ''
                  });
                }}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitApproval}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Approving...
                  </>
                ) : (
                  'Confirm Approval'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-bold text-gray-800">Reject Appointment</h3>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Patient: <span className="font-semibold">{getPatientName(selectedAppointment.patient_id)}</span>
              </p>
              <p className="text-sm text-gray-600">
                Type: <span className="font-semibold">{selectedAppointment.appointment_type.replace('_', ' ')}</span>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionData.rejection_reason}
                onChange={(e) => setRejectionData({ rejection_reason: e.target.value })}
                placeholder="Please provide a clear reason for rejecting this appointment request..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 10 characters ({rejectionData.rejection_reason.length}/10)
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setSelectedAppointment(null);
                  setError(null);
                  setRejectionData({
                    rejection_reason: ''
                  });
                }}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Rejecting...
                  </>
                ) : (
                  'Confirm Rejection'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
