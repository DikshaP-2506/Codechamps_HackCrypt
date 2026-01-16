require('dotenv').config();
const mongoose = require('mongoose');

const PhysicalVitals = require('./models/PhysicalVitals');
const Prescription = require('./models/Prescription');
const Appointment = require('./models/Appointment');
const Notification = require('./models/Notification');

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare';

// Defaults; can be overridden by CLI args or env PATIENT_IDS (comma-separated)
const DEFAULT_PATIENT_IDS = [
  '696a1b0578b8c4728d28e090', // Pradnya
  '696a13b6192926693917edfc'  // Harshal
];
const DOCTOR_ID = process.env.SEED_DOCTOR_ID || 'DOC_123'; // Mixed type supported

async function connectDB() {
  console.log('🔗 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to', mongoose.connection.host, '/', mongoose.connection.name);
}

function toObjectId(id) {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    return id; // Fallback to raw id when not an ObjectId
  }
}

async function seedVitals(patientId) {
  const entries = [
    {
      patient_id: patientId,
      recorded_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      systolic_bp: 118,
      diastolic_bp: 76,
      heart_rate: 72,
      blood_sugar: 95,
      respiratory_rate: 16,
      temperature: 98.4,
      spo2: 98,
      weight: 60,
      hb: 13.2,
      bmi: 22.1,
      measurement_method: 'manual_entry',
      notes: 'Routine check-up vitals recorded.'
    },
    {
      patient_id: patientId,
      recorded_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      systolic_bp: 124,
      diastolic_bp: 82,
      heart_rate: 78,
      blood_sugar: 110,
      respiratory_rate: 17,
      temperature: 99.1,
      spo2: 97,
      weight: 60.5,
      hb: 13.0,
      bmi: 22.3,
      measurement_method: 'wearable_api',
      notes: 'Wearable sync results.'
    },
    {
      patient_id: patientId,
      recorded_at: new Date(),
      systolic_bp: 115,
      diastolic_bp: 74,
      heart_rate: 70,
      blood_sugar: 92,
      respiratory_rate: 15,
      temperature: 98.2,
      spo2: 99,
      weight: 60.2,
      hb: 13.4,
      bmi: 22.2,
      measurement_method: 'patient_sync',
      notes: 'Morning vitals.'
    }
  ];
  const res = await PhysicalVitals.insertMany(entries);
  return res.map(d => d._id);
}

async function seedPrescriptions(patientId, doctorId) {
  const entries = [
    {
      patient_id: patientId,
      doctor_id: doctorId,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      medication_name: 'Amoxicillin 500mg',
      dosage: '500 mg',
      frequency: 'Twice daily',
      duration_days: 7,
      instructions: 'Take after meals. Complete full course.',
      qr_code_url: '',
      is_active: false,
      completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
    },
    {
      patient_id: patientId,
      doctor_id: doctorId,
      created_at: new Date(),
      medication_name: 'Vitamin D3 1000 IU',
      dosage: '1000 IU',
      frequency: 'Once daily',
      duration_days: 30,
      instructions: 'Take with breakfast.',
      qr_code_url: '',
      is_active: true
    }
  ];
  const res = await Prescription.insertMany(entries);
  return res.map(d => d._id);
}

async function seedAppointments(patientId, doctorId) {
  const entries = [
    {
      patient_id: patientId,
      doctor_id: doctorId,
      status: 'completed',
      appointment_type: 'consultation',
      start_time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      duration_minutes: 30,
      notes: 'Initial consultation. Advised lifestyle changes.',
      reminder_sent_24h: true,
      reminder_sent_1h: true,
      is_recurring: false,
      recurrence_pattern: 'none'
    },
    {
      patient_id: patientId,
      doctor_id: doctorId,
      status: 'scheduled',
      appointment_type: 'follow_up',
      start_time: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      duration_minutes: 20,
      notes: 'Follow-up on vitals and prescription adherence.',
      reminder_sent_24h: false,
      reminder_sent_1h: false,
      is_recurring: false,
      recurrence_pattern: 'none'
    }
  ];
  const res = await Appointment.insertMany(entries);
  return res.map(d => d._id);
}

async function seedNotifications(patientId) {
  const entries = [
    {
      recipient_id: patientId,
      patient_id: patientId,
      notification_type: 'appointment_reminder',
      title: 'Upcoming Appointment Reminder',
      body: 'You have a follow-up appointment in 5 days.',
      data: { days_until: 5 },
      is_read: false,
      sent_at: new Date()
    },
    {
      recipient_id: patientId,
      patient_id: patientId,
      notification_type: 'prescription_refill',
      title: 'Prescription Refill Reminder',
      body: 'Time to refill Vitamin D3 prescription.',
      data: { medication: 'Vitamin D3 1000 IU' },
      is_read: false,
      sent_at: new Date()
    },
    {
      recipient_id: patientId,
      patient_id: patientId,
      notification_type: 'health_alert',
      title: 'Health Alert: Elevated BP',
      body: 'Your recent BP reading was slightly elevated. Monitor regularly.',
      data: { systolic_bp: 124, diastolic_bp: 82 },
      is_read: true,
      sent_at: new Date(Date.now() - 1000 * 60 * 60),
      read_at: new Date(Date.now() - 1000 * 60 * 30)
    }
  ];
  const res = await Notification.insertMany(entries);
  return res.map(d => d._id);
}

async function main() {
  try {
    await connectDB();
    const cliIds = process.argv.slice(2);
    const envIds = (process.env.PATIENT_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
    const targetIds = cliIds.length ? cliIds : (envIds.length ? envIds : DEFAULT_PATIENT_IDS);

    const doctorId = DOCTOR_ID; // Mixed type allows string or ObjectId
    console.log('🩺 Using Doctor ID:', doctorId);

    for (const rawId of targetIds) {
      const patientId = toObjectId(rawId);
      console.log('\n==============================================');
      console.log('👤 Seeding for Patient ID:', patientId.toString ? patientId.toString() : patientId);

      const vitalsIds = await seedVitals(patientId);
      console.log(`✅ Vitals inserted: ${vitalsIds.length}`, vitalsIds.map(String));

      const rxIds = await seedPrescriptions(patientId, doctorId);
      console.log(`✅ Prescriptions inserted: ${rxIds.length}`, rxIds.map(String));

      const apptIds = await seedAppointments(patientId, doctorId);
      console.log(`✅ Appointments inserted: ${apptIds.length}`, apptIds.map(String));

      const notifIds = await seedNotifications(patientId);
      console.log(`✅ Notifications inserted: ${notifIds.length}`, notifIds.map(String));
    }

    console.log('\n🎉 Mock data seeding completed successfully for', targetIds.length, 'patient(s).');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
  }
}

main();
