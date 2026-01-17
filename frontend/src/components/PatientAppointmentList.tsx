"use client";

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, AlertCircle, CheckCircle, XCircle, FileText } from 'lucide-react';

interface DoctorInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Appointment {
  _id: string;
  doctor_id: string | DoctorInfo;
  appointment_type: string;
  appointment_reason: string;
  preferred_dates?: string[];
  preferred_time_slots?: string[];
  scheduled_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  status: 'requested' | 'approved' | 'rejected' | 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
  created_at: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
}

interface PatientAppointmentListProps {
  patientId: string;
}

export default function PatientAppointmentList({ patientId }: PatientAppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'all' | 'requested' | 'approved' | 'rejected' | 'completed'>('all');

  useEffect(() => {
    fetchAppointments();
  }, [patientId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/appointments/patient/${patientId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      setAppointments(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDoctorName = (doctor: string | DoctorInfo): string => {
    if (typeof doctor === 'string') return 'Unknown Doctor';
    return `Dr. ${doctor.firstName} ${doctor.lastName}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatTimeSlot = (slot: string): string => {
    const mapping: { [key: string]: string } = {
      'morning': '8:00 AM - 12:00 PM',
      'afternoon': '12:00 PM - 5:00 PM',
      'evening': '5:00 PM - 8:00 PM'
    };
    return mapping[slot.toLowerCase()] || slot;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'requested':
        return <Clock className="w-5 h-5" />;
      case 'approved':
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      case 'completed':
        return <Calendar className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (selectedTab === 'all') return true;
    return apt.status === selectedTab;
  });

  const getTabCount = (tab: string) => {
    if (tab === 'all') return appointments.length;
    return appointments.filter(apt => apt.status === tab).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {[
          { key: 'all', label: 'All Appointments' },
          { key: 'requested', label: 'Pending' },
          { key: 'approved', label: 'Approved' },
          { key: 'rejected', label: 'Rejected' },
          { key: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key as any)}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              selectedTab === tab.key
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
              {getTabCount(tab.key)}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {selectedTab === 'all' ? 'No appointments found' : `No ${selectedTab} appointments`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <User className="w-6 h-6 text-emerald-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {getDoctorName(appointment.doctor_id)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {appointment.appointment_type.replace('_', ' ').toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(appointment.status)}`}>
                  {getStatusIcon(appointment.status)}
                  <span className="text-sm font-medium">{appointment.status.toUpperCase()}</span>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-3">
                {/* For Requested Status */}
                {appointment.status === 'requested' && (
                  <>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-yellow-900 mb-2">
                        ⏳ Awaiting doctor's approval
                      </p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Your Preferred Dates:</p>
                          <div className="flex flex-wrap gap-2">
                            {appointment.preferred_dates?.map((date, index) => (
                              <span key={index} className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-yellow-300">
                                {formatDate(date)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Your Preferred Times:</p>
                          <div className="flex flex-wrap gap-2">
                            {appointment.preferred_time_slots?.map((slot, index) => (
                              <span key={index} className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-yellow-300">
                                {formatTimeSlot(slot)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* For Approved/Confirmed Status */}
                {(appointment.status === 'approved' || appointment.status === 'confirmed') && appointment.scheduled_date && (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-green-900 mb-3">
                        ✅ Appointment Confirmed
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-700" />
                          <div>
                            <p className="text-xs text-gray-600">Date</p>
                            <p className="text-sm font-semibold text-gray-900">{formatDate(appointment.scheduled_date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-700" />
                          <div>
                            <p className="text-xs text-gray-600">Time</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {appointment.start_time && formatTime(appointment.start_time)}
                              {appointment.end_time && ` - ${formatTime(appointment.end_time)}`}
                            </p>
                          </div>
                        </div>
                        {appointment.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-700" />
                            <div>
                              <p className="text-xs text-gray-600">Location</p>
                              <p className="text-sm font-semibold text-gray-900">{appointment.location}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* For Rejected Status */}
                {appointment.status === 'rejected' && appointment.rejection_reason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <FileText className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-gray-700">{appointment.rejection_reason}</p>
                      </div>
                    </div>
                    <p className="text-xs text-red-700 mt-2">
                      Rejected on {formatDate(appointment.rejected_at || appointment.created_at)}
                    </p>
                  </div>
                )}

                {/* Appointment Reason */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Appointment Reason:</p>
                  <p className="text-sm text-gray-800">{appointment.appointment_reason}</p>
                </div>

                {/* Timestamps */}
                <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span>Requested: {formatDate(appointment.created_at)}</span>
                  {appointment.approved_at && (
                    <span>Approved: {formatDate(appointment.approved_at)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
