// Patient Dashboard Components
"use client";

import { useState, useEffect } from "react";
import { Activity, TrendingUp, AlertCircle, Pill, Calendar, Bell } from "lucide-react";
import { vitalsAPI, prescriptionsAPI, appointmentsAPI, notificationsAPI, patientAPI } from "@/lib/api";

// Latest Vitals Card
export function LatestVitalsCard({ patientId }: { patientId: string }) {
  const [vitals, setVitals] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        setLoading(true);
        const data = await vitalsAPI.getLatest(patientId);
        setVitals(data.data);
      } catch (err) {
        setError("Failed to load vitals");
      } finally {
        setLoading(false);
      }
    };

    fetchVitals();
  }, [patientId]);

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
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await prescriptionsAPI.getActiveByPatientId(patientId);
        setPrescriptions(data.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
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
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentsAPI.getByPatientId(patientId, true);
        setAppointments(data.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const countData = await notificationsAPI.getUnreadCount(recipientId);
        setUnreadCount(countData.data?.unread_count || 0);

        const notifData = await notificationsAPI.getByRecipientId(recipientId, false);
        setNotifications(notifData.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [recipientId]);

  const handleMarkAsRead = async (notificationId: string) => {
    await notificationsAPI.markAsRead(notificationId);
    setNotifications(notifications.map(n =>
      n._id === notificationId ? { ...n, is_read: true } : n
    ));
    setUnreadCount(Math.max(0, unreadCount - 1));
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
          {notifications.slice(0, 5).map((notif) => (
            <div
              key={notif._id}
              className={`p-3 rounded-lg border ${
                notif.is_read
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-blue-50 border-blue-200'
              } cursor-pointer hover:shadow-sm transition`}
              onClick={() => !notif.is_read && handleMarkAsRead(notif._id)}
            >
              <div className="flex items-start gap-2">
                {notif.notification_type === 'health_alert' && (
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                {notif.notification_type === 'appointment_reminder' && (
                  <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                )}
                {notif.notification_type === 'prescription_refill' && (
                  <Pill className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{notif.body}</p>
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
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await patientAPI.getById(patientId);
        setPatient(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [patientId]);

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
