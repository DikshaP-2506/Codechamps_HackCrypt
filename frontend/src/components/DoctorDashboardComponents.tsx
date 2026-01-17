// Doctor Dashboard Components
"use client";

import { useState, useEffect } from "react";
import { Users, Calendar, AlertTriangle, TrendingUp, Activity, Pill, Clock } from "lucide-react";
import { patientAPI, vitalsAPI, prescriptionsAPI, appointmentsAPI, notificationsAPI } from "@/lib/api";

// Doctor's Patient List
export function DoctorPatientList({ doctorId }: { doctorId: string }) {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError("");
        console.log("Fetching patients from API...");
        const data = await patientAPI.getAll(page, 10, search);
        console.log("API Response:", data);
        
        if (data.success) {
          setPatients(data.data || []);
          console.log("Patients loaded:", data.data?.length || 0);
        } else {
          setError(data.message || "Failed to fetch patients");
          console.error("API returned error:", data.message);
        }
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to load patients. Please check if the backend server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [page, search]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">My Patients</h3>
        <Users className="h-5 w-5 text-emerald-600" />
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded"></div>)}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-xs text-red-700 underline hover:text-red-800"
          >
            Refresh page
          </button>
        </div>
      ) : patients.length === 0 ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">No patients found</p>
          <p className="text-xs text-yellow-600 mt-1">Try adjusting your search or check if patients exist in the database</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-300 transition cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{patient.name}</p>
                  <p className="text-xs text-gray-600">
                    {patient.gender} • {patient.blood_group}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  patient.is_active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {patient.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 text-sm border border-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Doctor's Appointments Today
export function DoctorAppointmentsToday({ doctorId }: { doctorId: string }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const data = await appointmentsAPI.getByDoctorId(doctorId, today);
        setAppointments(data.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [doctorId]);

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
        <h3 className="font-semibold text-gray-900">Today's Appointments</h3>
        <Calendar className="h-5 w-5 text-emerald-600" />
      </div>

      {appointments.length === 0 ? (
        <p className="text-sm text-gray-600">No appointments today</p>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div key={apt._id} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {new Date(apt.start_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-xs text-gray-600">Patient ID: {apt.patient_id}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {apt.appointment_type === 'video_call' ? '📹 Virtual' : '🏥 In-person'} •
                    {apt.duration_minutes} min
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                  apt.status === 'confirmed'
                    ? 'bg-emerald-200 text-emerald-700'
                    : apt.status === 'scheduled'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
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

// Doctor's Patient Vitals Monitor
export function DoctorPatientVitalsMonitor({ patientId }: { patientId: string }) {
  const [vitals, setVitals] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const data = await vitalsAPI.getLatest(patientId);
        const vitalsData = data.data;
        setVitals(vitalsData);

        // Check for abnormal values
        if (vitalsData.systolic_bp > 140 || vitalsData.diastolic_bp > 90) {
          setAlert("High Blood Pressure Detected");
        } else if (vitalsData.temperature > 99 || vitalsData.temperature < 97) {
          setAlert("Abnormal Temperature");
        } else if (vitalsData.spo2 < 95) {
          setAlert("Low Oxygen Level");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVitals();
  }, [patientId]);

  if (loading || !vitals) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse h-40 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border-2 bg-white p-6 shadow-sm ${
      alert ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Patient Vitals</h3>
        {alert && <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />}
      </div>

      {alert && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-sm font-medium text-red-700">{alert}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-600">BP</p>
          <p className="font-bold text-lg">{vitals.systolic_bp}/{vitals.diastolic_bp}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-600">HR</p>
          <p className="font-bold text-lg">{vitals.heart_rate}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-600">SpO₂</p>
          <p className="font-bold text-lg">{vitals.spo2}%</p>
        </div>
      </div>
    </div>
  );
}

// Doctor's Prescription Management
export function DoctorPrescriptionList({ patientId }: { patientId: string }) {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await prescriptionsAPI.getByPatientId(patientId);
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
        <h3 className="font-semibold text-gray-900">Patient Prescriptions</h3>
        <Pill className="h-5 w-5 text-emerald-600" />
      </div>

      {prescriptions.length === 0 ? (
        <p className="text-sm text-gray-600">No prescriptions</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {prescriptions.map((rx) => (
            <div key={rx._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{rx.medication_name}</p>
                  <p className="text-xs text-gray-600">{rx.dosage} • {rx.frequency}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  rx.is_active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {rx.is_active ? 'Active' : 'Completed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Pending Reminders
export function PendingReminders() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const data = await appointmentsAPI.getPendingReminders();
        const pending = Array.isArray(data?.data) ? data.data : [];
        setReminders(pending);
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  const handleSendReminder = async (appointmentId: string, reminderType: string) => {
    await appointmentsAPI.markReminderSent(appointmentId, reminderType);
    setReminders(reminders.filter(r => r._id !== appointmentId));
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse h-48">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Pending Reminders</h3>
        {reminders.length > 0 && (
          <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {reminders.length}
          </span>
        )}
      </div>

      {reminders.length === 0 ? (
        <p className="text-sm text-gray-600">No pending reminders</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {reminders.slice(0, 5).map((reminder) => (
            <div key={reminder._id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-700">
                    Appointment: {new Date(reminder.start_time).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Patient ID: {reminder.patient_id}</p>
                </div>
              </div>
              <button
                onClick={() => handleSendReminder(reminder._id, '24h')}
                className="mt-2 w-full bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-1 rounded transition"
              >
                Send Reminder
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Doctor Stats Card
export function DoctorStatsCard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const aptStats = await appointmentsAPI.getStats();
        const rxStats = await prescriptionsAPI.getStats();
        setStats({
          appointments: aptStats.data,
          prescriptions: rxStats.data,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse h-40">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs text-gray-600 mb-2">Total Appointments</p>
        <p className="text-3xl font-bold text-emerald-600">
          {stats.appointments?.total || 0}
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs text-gray-600 mb-2">Pending</p>
        <p className="text-3xl font-bold text-yellow-600">
          {stats.appointments?.pending || 0}
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs text-gray-600 mb-2">Active Prescriptions</p>
        <p className="text-3xl font-bold text-blue-600">
          {stats.prescriptions?.active || 0}
        </p>
      </div>
    </div>
  );
}
