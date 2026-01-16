# Component Usage Guide

## Patient Dashboard Components

### 1. LatestVitalsCard
```tsx
import { LatestVitalsCard } from "@/components/PatientDashboardComponents";

<LatestVitalsCard patientId={patientId} />
```
**Props:**
- `patientId: string` - The patient's unique ID

**Displays:**
- Blood Pressure (Systolic/Diastolic)
- Heart Rate (bpm)
- Temperature (°F)
- SpO₂ (%)
- Weight (kg)
- BMI
- Notes from latest reading

**Status Colors:**
- 🟢 Green: Normal range
- 🟡 Yellow: Slightly elevated
- 🔴 Red: Critical/Abnormal

---

### 2. VitalsTrendChart
```tsx
import { VitalsTrendChart } from "@/components/PatientDashboardComponents";

<VitalsTrendChart patientId={patientId} />
```
**Props:**
- `patientId: string` - The patient's unique ID

**Shows:**
- 30-day trend analysis
- Average values for BP, HR, Temperature
- Visual progress bars
- Trend comparison

---

### 3. ActivePrescriptionsWidget
```tsx
import { ActivePrescriptionsWidget } from "@/components/PatientDashboardComponents";

<ActivePrescriptionsWidget patientId={patientId} />
```
**Props:**
- `patientId: string` - The patient's unique ID

**Displays:**
- Medication name
- Dosage
- Frequency
- Duration in days
- Instructions
- Up to 5 active prescriptions

---

### 4. UpcomingAppointmentsWidget
```tsx
import { UpcomingAppointmentsWidget } from "@/components/PatientDashboardComponents";

<UpcomingAppointmentsWidget patientId={patientId} />
```
**Props:**
- `patientId: string` - The patient's unique ID

**Displays:**
- Appointment date
- Time
- Appointment type (Virtual/In-person)
- Status (Confirmed/Scheduled)
- Up to 3 upcoming appointments

---

### 5. NotificationCenter
```tsx
import { NotificationCenter } from "@/components/PatientDashboardComponents";

<NotificationCenter recipientId={recipientId} />
```
**Props:**
- `recipientId: string` - The user's recipient ID (usually same as user ID)

**Features:**
- Unread notification count badge
- Mark notifications as read
- Supports multiple notification types:
  - 🏥 Appointment reminders
  - ⚠️ Health alerts
  - 💊 Prescription refills
  - 🧪 Lab results
- Displays up to 5 recent notifications
- Scrollable for more

---

### 6. HealthSummaryCard
```tsx
import { HealthSummaryCard } from "@/components/PatientDashboardComponents";

<HealthSummaryCard patientId={patientId} />
```
**Props:**
- `patientId: string` - The patient's unique ID

**Displays:**
- Blood type (e.g., O+, A-, B+)
- Age (calculated from DOB)
- Number of allergies
- Number of chronic conditions

---

## Doctor Dashboard Components

### 1. DoctorPatientList
```tsx
import { DoctorPatientList } from "@/components/DoctorDashboardComponents";

<DoctorPatientList doctorId={doctorId} />
```
**Props:**
- `doctorId: string` - The doctor's unique ID

**Features:**
- Search functionality
- Pagination (10 patients per page)
- Shows: Name, Gender, Blood Type, Active Status
- Previous/Next page buttons
- Real-time search filtering

---

### 2. DoctorAppointmentsToday
```tsx
import { DoctorAppointmentsToday } from "@/components/DoctorDashboardComponents";

<DoctorAppointmentsToday doctorId={doctorId} />
```
**Props:**
- `doctorId: string` - The doctor's unique ID

**Displays:**
- Today's appointment times
- Patient ID
- Appointment type (Virtual/In-person)
- Duration in minutes
- Status (Confirmed/Scheduled)
- Color-coded status badges

---

### 3. DoctorPatientVitalsMonitor
```tsx
import { DoctorPatientVitalsMonitor } from "@/components/DoctorDashboardComponents";

<DoctorPatientVitalsMonitor patientId={patientId} />
```
**Props:**
- `patientId: string` - The patient's unique ID

**Features:**
- Quick vital check
- Abnormal value alerts with warnings
- Shows: BP, HR, SpO₂
- Visual alert system for critical readings
- Red background warning for abnormal values

**Alert Triggers:**
- BP > 140/90: High Blood Pressure
- Temperature outside 97-99°F: Abnormal Temperature
- SpO₂ < 95%: Low Oxygen Level

---

### 4. DoctorPrescriptionList
```tsx
import { DoctorPrescriptionList } from "@/components/DoctorDashboardComponents";

<DoctorPrescriptionList patientId={patientId} />
```
**Props:**
- `patientId: string` - The patient's unique ID

**Displays:**
- Medication name
- Dosage
- Frequency
- Active/Completed status
- Color-coded status badges
- Scrollable list (up to 5 visible)

---

### 5. PendingReminders
```tsx
import { PendingReminders } from "@/components/DoctorDashboardComponents";

<PendingReminders />
```
**Features:**
- No props required
- Shows pending appointment reminders
- Badge with count
- One-click "Send Reminder" button
- Removes reminder after sending
- Shows appointment time and patient ID

---

### 6. DoctorStatsCard
```tsx
import { DoctorStatsCard } from "@/components/DoctorDashboardComponents";

<DoctorStatsCard />
```
**Features:**
- No props required
- Displays 3 key metrics:
  - Total appointments
  - Pending appointments
  - Active prescriptions
- Color-coded numbers
- Real-time data from backend

---

## API Utilities Usage

### Vitals API
```tsx
import { vitalsAPI } from "@/lib/api";

// Get latest vitals for patient
const vitals = await vitalsAPI.getLatest(patientId);

// Get vitals trends (last 30 days)
const stats = await vitalsAPI.getStats(patientId, 30);

// Create new vital record
await vitalsAPI.create({
  patient_id: patientId,
  systolic_bp: 120,
  diastolic_bp: 80,
  heart_rate: 75,
  temperature: 98.6,
  spo2: 98
});
```

### Prescriptions API
```tsx
import { prescriptionsAPI } from "@/lib/api";

// Get active prescriptions
const rx = await prescriptionsAPI.getActiveByPatientId(patientId);

// Get all prescriptions for patient
const allRx = await prescriptionsAPI.getByPatientId(patientId);

// Create prescription
await prescriptionsAPI.create({
  patient_id: patientId,
  doctor_id: doctorId,
  medication_name: "Metformin",
  dosage: "500mg",
  frequency: "Twice a day",
  duration_days: 30
});
```

### Appointments API
```tsx
import { appointmentsAPI } from "@/lib/api";

// Get upcoming appointments
const upcoming = await appointmentsAPI.getByPatientId(patientId, true);

// Get today's appointments for doctor
const today = await appointmentsAPI.getByDoctorId(doctorId, todayDate);

// Get pending reminders
const reminders = await appointmentsAPI.getPendingReminders();

// Send reminder
await appointmentsAPI.markReminderSent(appointmentId, "24h");
```

### Notifications API
```tsx
import { notificationsAPI } from "@/lib/api";

// Get unread count
const count = await notificationsAPI.getUnreadCount(recipientId);

// Get notifications
const notifs = await notificationsAPI.getByRecipientId(recipientId);

// Mark as read
await notificationsAPI.markAsRead(notificationId);

// Create notification
await notificationsAPI.create({
  recipient_id: recipientId,
  notification_type: "appointment_reminder",
  title: "Appointment Reminder",
  body: "Your appointment is in 24 hours",
  data: { /* ... */ }
});
```

---

## Complete Patient Dashboard Example

```tsx
"use client";

import {
  LatestVitalsCard,
  VitalsTrendChart,
  ActivePrescriptionsWidget,
  UpcomingAppointmentsWidget,
  NotificationCenter,
  HealthSummaryCard,
} from "@/components/PatientDashboardComponents";

export default function PatientDashboard() {
  const patientId = "user_123"; // From Clerk auth

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Health Dashboard</h1>

      {/* Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <LatestVitalsCard patientId={patientId} />
        <VitalsTrendChart patientId={patientId} />
        <HealthSummaryCard patientId={patientId} />
      </div>

      {/* Medications and Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ActivePrescriptionsWidget patientId={patientId} />
        <UpcomingAppointmentsWidget patientId={patientId} />
      </div>

      {/* Notifications */}
      <NotificationCenter recipientId={patientId} />
    </main>
  );
}
```

---

## Complete Doctor Dashboard Example

```tsx
"use client";

import {
  DoctorPatientList,
  DoctorAppointmentsToday,
  DoctorPatientVitalsMonitor,
  DoctorPrescriptionList,
  PendingReminders,
  DoctorStatsCard,
} from "@/components/DoctorDashboardComponents";

export default function DoctorDashboard() {
  const doctorId = "doc_123"; // From Clerk auth

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>

      {/* Statistics */}
      <section className="mb-8">
        <DoctorStatsCard />
      </section>

      {/* Today's Schedule and Reminders */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <DoctorAppointmentsToday doctorId={doctorId} />
        </div>
        <PendingReminders />
      </section>

      {/* Patient Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DoctorPatientList doctorId={doctorId} />
        </div>
        <div className="space-y-6">
          <DoctorPatientVitalsMonitor patientId="patient_123" />
          <DoctorPrescriptionList patientId="patient_123" />
        </div>
      </div>
    </main>
  );
}
```

---

## Error Handling

All components include built-in error handling:

```tsx
// Loading state
<div className="animate-pulse h-40 bg-gray-100 rounded"></div>

// Error message
<p className="text-sm text-gray-600">Failed to load vitals</p>

// No data state
<p className="text-sm text-gray-600">No notifications</p>
```

---

## Performance Tips

1. **Memoization**: Components re-fetch on prop changes
2. **Pagination**: Patient list limits results to 10 per page
3. **Caching**: Consider implementing React Query for caching
4. **Lazy Loading**: Components load data independently
5. **Error Boundaries**: Wrap in error boundaries for production

---

## Customization

All components can be customized by:
- Modifying Tailwind CSS classes
- Changing color schemes
- Adjusting grid layouts
- Adding/removing sections
- Customizing API calls in `src/lib/api.ts`

---

**Last Updated:** January 16, 2026
**Status:** ✅ Ready for Production
