// Patient Dashboard Components
"use client";

import { useState, useEffect } from "react";
import { Activity, TrendingUp, AlertCircle, Pill, Calendar, Bell } from "lucide-react";
import { vitalsAPI, prescriptionsAPI, appointmentsAPI, notificationsAPI, patientAPI } from "@/lib/api";

// Latest Vitals Card
export function LatestVitalsCard({ patientId }: { patientId: string }) {
  // Hardcoded demo data
  const vitals = {
    systolic_bp: 120,
    diastolic_bp: 80,
    heart_rate: 72,
    temperature: 98.6,
    spo2: 98,
    weight: 70,
    height: 175,
    recorded_at: new Date().toISOString()
  };

  const loading = false;
  const error = null;

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse h-80">
        <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-3 bg-gray-100 rounded"></div>)}
        </div>
      </div>
    );
  }

  if (error || !vitals) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">{error || "No vitals data available"}</p>
      </div>
    );
  }

  const getStatusColor = (value: number, type: string) => {
    switch (type) {
      case 'systolic':
        return value > 140 ? 'text-red-600' : value > 130 ? 'text-yellow-600' : 'text-emerald-600';
      case 'heart_rate':
        return value > 100 ? 'text-red-600' : value < 60 ? 'text-yellow-600' : 'text-emerald-600';
      case 'temperature':
        return value > 99 ? 'text-red-600' : value < 97 ? 'text-blue-600' : 'text-emerald-600';
      default:
        return 'text-emerald-600';
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Latest Vitals</h3>
        <Activity className="h-5 w-5 text-emerald-600" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">Blood Pressure</p>
          <p className={`text-lg font-bold ${getStatusColor(vitals.systolic_bp, 'systolic')}`}>
            {vitals.systolic_bp}/{vitals.diastolic_bp}
          </p>
          <p className="text-xs text-gray-500">mmHg</p>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">Heart Rate</p>
          <p className={`text-lg font-bold ${getStatusColor(vitals.heart_rate, 'heart_rate')}`}>
            {vitals.heart_rate}
          </p>
          <p className="text-xs text-gray-500">bpm</p>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">Temperature</p>
          <p className={`text-lg font-bold ${getStatusColor(vitals.temperature, 'temperature')}`}>
            {vitals.temperature}°F
          </p>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">SpO₂</p>
          <p className={`text-lg font-bold ${vitals.spo2 < 95 ? 'text-red-600' : 'text-emerald-600'}`}>
            {vitals.spo2}%
          </p>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">Weight</p>
          <p className="text-lg font-bold text-emerald-600">{vitals.weight}</p>
          <p className="text-xs text-gray-500">kg</p>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">BMI</p>
          <p className="text-lg font-bold text-emerald-600">{vitals.bmi}</p>
        </div>
      </div>

      {vitals.notes && (
        <p className="mt-4 text-xs text-gray-600 italic">{vitals.notes}</p>
      )}
    </div>
  );
}

// Vitals Trend Chart
export function VitalsTrendChart({ patientId }: { patientId: string }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await vitalsAPI.getStats(patientId, 30);
        setStats(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [patientId]);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse h-64">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Vitals Trend (30 days)</h3>
        <TrendingUp className="h-5 w-5 text-emerald-600" />
      </div>

      {stats && (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Blood Pressure</span>
              <span className="text-xs text-gray-500">
                {stats.systolic_bp_avg ? `Avg: ${stats.systolic_bp_avg.toFixed(0)}` : 'N/A'}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{
                  width: `${Math.min(
                    ((stats.systolic_bp_avg || 0) / 180) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Heart Rate</span>
              <span className="text-xs text-gray-500">
                {stats.heart_rate_avg ? `Avg: ${stats.heart_rate_avg.toFixed(0)}` : 'N/A'}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${Math.min(((stats.heart_rate_avg || 0) / 120) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Temperature</span>
              <span className="text-xs text-gray-500">
                {stats.temperature_avg ? `Avg: ${stats.temperature_avg.toFixed(1)}°F` : 'N/A'}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500"
                style={{
                  width: `${Math.min(
                    ((stats.temperature_avg || 0) / 105) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Active Prescriptions Widget
export function ActivePrescriptionsWidget({ patientId }: { patientId: string }) {
  // Hardcoded demo data
  const prescriptions = [
    {
      _id: '1',
      medication_name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '30 days',
      instructions: 'Take with water in the morning'
    },
    {
      _id: '2',
      medication_name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '90 days',
      instructions: 'Take with meals'
    },
    {
      _id: '3',
      medication_name: 'Aspirin',
      dosage: '81mg',
      frequency: 'Once daily',
      duration: 'Ongoing',
      instructions: 'Take after breakfast'
    }
  ];
  
  const loading = false;

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse h-64">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Active Medications</h3>
        <Pill className="h-5 w-5 text-emerald-600" />
      </div>

      {prescriptions.length === 0 ? (
        <p className="text-sm text-gray-600">No active prescriptions</p>
      ) : (
        <div className="space-y-3">
          {prescriptions.slice(0, 5).map((rx) => (
            <div key={rx._id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 text-sm">{rx.medication_name}</p>
                <p className="text-xs text-gray-600">{rx.dosage} • {rx.frequency}</p>
                <p className="text-xs text-gray-500 mt-1">Instructions: {rx.instructions}</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                {rx.duration_days}d
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Upcoming Appointments Widget
export function UpcomingAppointmentsWidget({ patientId }: { patientId: string }) {
  // Hardcoded demo data
  const appointments = [
    {
      _id: '1',
      start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      appointment_type: 'video_call',
      status: 'confirmed',
      doctor_name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist'
    },
    {
      _id: '2',
      start_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      appointment_type: 'in_person',
      status: 'confirmed',
      doctor_name: 'Dr. Michael Chen',
      specialization: 'General Physician'
    },
    {
      _id: '3',
      start_time: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      appointment_type: 'video_call',
      status: 'pending',
      doctor_name: 'Dr. Emily Rodriguez',
      specialization: 'Dermatologist'
    }
  ];
  
  const loading = false;

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse h-64">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Upcoming Appointments</h3>
        <Calendar className="h-5 w-5 text-emerald-600" />
      </div>

      {appointments.length === 0 ? (
        <p className="text-sm text-gray-600">No upcoming appointments</p>
      ) : (
        <div className="space-y-3">
          {appointments.slice(0, 3).map((apt) => (
            <div key={apt._id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {new Date(apt.start_time).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(apt.start_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {apt.appointment_type === 'video_call' ? '📹 Virtual' : '🏥 In-person'}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  apt.status === 'confirmed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Notification Center
export function NotificationCenter({ recipientId }: { recipientId: string }) {
  // Hardcoded demo data
  const notifications = [
    {
      _id: '1',
      title: 'Appointment Reminder',
      message: 'You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM',
      type: 'reminder',
      is_read: false,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
      _id: '2',
      title: 'Lab Results Available',
      message: 'Your blood test results are now available to view',
      type: 'lab_result',
      is_read: false,
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
    },
    {
      _id: '3',
      title: 'Prescription Refill Due',
      message: 'Your Lisinopril prescription needs to be refilled in 3 days',
      type: 'prescription',
      is_read: true,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      _id: '4',
      title: 'Health Tip',
      message: 'Remember to stay hydrated! Aim for 8 glasses of water daily',
      type: 'health_tip',
      is_read: true,
      created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      _id: '5',
      title: 'New Message',
      message: 'Dr. Johnson has replied to your query about medication dosage',
      type: 'message',
      is_read: false,
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
    }
  ];

  const [localNotifications, setLocalNotifications] = useState(notifications);
  const unreadCount = localNotifications.filter(n => !n.is_read).length;
  const loading = false;

  const handleMarkAsRead = (notificationId: string) => {
    setLocalNotifications(localNotifications.map(n =>
      n._id === notificationId ? { ...n, is_read: true } : n
    ));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded"></div>)}
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-gray-600">No notifications</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {localNotifications.slice(0, 5).map((notif) => (
            <div
              key={notif._id}
              className={`p-3 rounded-lg border ${
                notif.is_read
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-emerald-50 border-emerald-200'
              } cursor-pointer hover:shadow-sm transition`}
              onClick={() => !notif.is_read && handleMarkAsRead(notif._id)}
            >
              <div className="flex items-start gap-2">
                {notif.type === 'lab_result' && (
                  <AlertCircle className="h-4 w-4 text-[#006045] flex-shrink-0 mt-0.5" />
                )}
                {notif.type === 'reminder' && (
                  <Calendar className="h-4 w-4 text-[#006045] flex-shrink-0 mt-0.5" />
                )}
                {notif.type === 'prescription' && (
                  <Pill className="h-4 w-4 text-[#006045] flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Health Summary Card
export function HealthSummaryCard({ patientId }: { patientId: string }) {
  // Hardcoded demo data
  const patient = {
    blood_group: 'O+',
    date_of_birth: '1990-05-15',
    allergies: ['Penicillin', 'Peanuts'],
    chronic_conditions: ['Hypertension'],
    gender: 'Male',
    height: 175,
    weight: 70
  };
  
  const loading = false;

  if (loading || !patient) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Health Profile</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-600">Blood Type</p>
          <p className="font-semibold text-gray-900">{patient.blood_group}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-600">Age</p>
          <p className="font-semibold text-gray-900">
            {new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()} years
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-600">Allergies</p>
          <p className="font-semibold text-gray-900">{patient.allergies?.length || 0}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-600">Chronic Conditions</p>
          <p className="font-semibold text-gray-900">{patient.chronic_conditions?.length || 0}</p>
        </div>
      </div>
    </div>
  );
}
