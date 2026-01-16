// Data Fetcher Module - Handles fetching patient data from main backend

/**
 * Resolves Clerk ID to numeric patient_id by querying patients collection
 * @param {string} clerkUserId - Clerk user ID from frontend
 * @param {string} backendUrl - Main backend URL
 * @returns {Promise<string|null>} Numeric patient_id or null if not found
 */
async function resolvePatientId(clerkUserId, backendUrl) {
  const MAIN_BACKEND = backendUrl || process.env.MAIN_BACKEND_URL || 'http://localhost:5000';
  
  try {
    // Fetch patient by clerk_user_id
    const response = await fetch(`${MAIN_BACKEND}/api/patients/by-clerk/${clerkUserId}`);
    
    if (response.ok) {
      const patient = await response.json();
      // Return the numeric patient_id (or _id if numeric patient_id doesn't exist)
      return patient.patient_id || patient._id;
    }
  } catch (error) {
    console.warn(`Could not resolve patient ID for clerk user ${clerkUserId}:`, error.message);
  }
  
  return null;
}

/**
 * Fetches all patient data from the main backend
 * @param {string} patientId - Numeric patient ID (or Clerk ID to resolve)
 * @param {string} clerkUserId - Clerk user ID (optional, for resolution)
 * @param {string} backendUrl - Main backend URL
 * @returns {Promise<Object>} Patient data object
 */
async function fetchPatientData(patientId, clerkUserId, backendUrl) {
  const MAIN_BACKEND = backendUrl || process.env.MAIN_BACKEND_URL || 'http://localhost:5000';
  
  let resolvedPatientId = patientId;
  
  // If Clerk ID provided, resolve to numeric patient_id
  if (clerkUserId && !Number(patientId)) {
    console.log(`Resolving Clerk ID ${clerkUserId} to patient_id...`);
    const resolved = await resolvePatientId(clerkUserId, MAIN_BACKEND);
    if (resolved) {
      resolvedPatientId = resolved;
      console.log(`Resolved to patient_id: ${resolvedPatientId}`);
    } else {
      console.warn(`Could not resolve Clerk ID ${clerkUserId}`);
      return { error: 'Patient not found' };
    }
  }
  
  console.log(`Fetching patient data for patient_id: ${resolvedPatientId} from ${MAIN_BACKEND}`);
  
  // Fetch all patient data in parallel using numeric patient_id
  const [
    patientRes,
    vitalsRes,
    prescriptionsRes,
    appointmentsRes,
    mentalHealthRes,
    therapyRes,
    treatmentRes
  ] = await Promise.allSettled([
    fetch(`${MAIN_BACKEND}/api/patients/${resolvedPatientId}`),
    fetch(`${MAIN_BACKEND}/api/physical-vitals/patient/${resolvedPatientId}`),
    fetch(`${MAIN_BACKEND}/api/prescriptions/patient/${resolvedPatientId}?is_active=true`),
    fetch(`${MAIN_BACKEND}/api/appointments/patient/${resolvedPatientId}?limit=5`),
    fetch(`${MAIN_BACKEND}/api/mental-health/patient/${resolvedPatientId}?limit=7`),
    fetch(`${MAIN_BACKEND}/api/therapy/patient/${resolvedPatientId}?limit=5`),
    fetch(`${MAIN_BACKEND}/api/treatment-plans/patient/${resolvedPatientId}?is_active=true`)
  ]);
  
  const patientData = {
    patientId: resolvedPatientId,
    profile: patientRes.status === 'fulfilled' && patientRes.value.ok ? await patientRes.value.json() : null,
    latestVitals: vitalsRes.status === 'fulfilled' && vitalsRes.value.ok ? await vitalsRes.value.json() : null,
    activePrescriptions: prescriptionsRes.status === 'fulfilled' && prescriptionsRes.value.ok ? (await prescriptionsRes.value.json()).data || [] : [],
    recentAppointments: appointmentsRes.status === 'fulfilled' && appointmentsRes.value.ok ? (await appointmentsRes.value.json()).data || [] : [],
    mentalHealthLogs: mentalHealthRes.status === 'fulfilled' && mentalHealthRes.value.ok ? (await mentalHealthRes.value.json()).data || [] : [],
    therapySessions: therapyRes.status === 'fulfilled' && therapyRes.value.ok ? (await therapyRes.value.json()).data || [] : [],
    treatmentPlans: treatmentRes.status === 'fulfilled' && treatmentRes.value.ok ? (await treatmentRes.value.json()).data || [] : []
  };
  
  return patientData;
}

/**
 * Formats patient data for AI context
 * @param {Object} data - Patient data object
 * @returns {string} Formatted patient data string
 */
function formatPatientData(data) {
  let formatted = '\n\n--- PATIENT HEALTH CONTEXT ---\n';
  
  if (data.profile) {
    formatted += `\nPATIENT PROFILE:\n`;
    formatted += `Name: ${data.profile.name || 'N/A'}\n`;
    formatted += `Age: ${data.profile.age || 'N/A'}, Gender: ${data.profile.gender || 'N/A'}\n`;
    if (data.profile.chronic_conditions?.length > 0) {
      formatted += `Chronic Conditions: ${data.profile.chronic_conditions.join(', ')}\n`;
    }
    if (data.profile.allergies?.length > 0) {
      formatted += `Allergies: ${data.profile.allergies.join(', ')}\n`;
    }
  }
  
  if (data.latestVitals) {
    formatted += `\nLATEST VITALS:\n`;
    if (data.latestVitals.systolic_bp && data.latestVitals.diastolic_bp) {
      formatted += `BP: ${data.latestVitals.systolic_bp}/${data.latestVitals.diastolic_bp}\n`;
    }
    if (data.latestVitals.heart_rate) formatted += `Heart Rate: ${data.latestVitals.heart_rate} bpm\n`;
    if (data.latestVitals.temperature) formatted += `Temperature: ${data.latestVitals.temperature}°F\n`;
    if (data.latestVitals.spo2) formatted += `SpO2: ${data.latestVitals.spo2}%\n`;
    if (data.latestVitals.blood_sugar) formatted += `Blood Sugar: ${data.latestVitals.blood_sugar} mg/dL\n`;
  }
  
  if (data.activePrescriptions?.length > 0) {
    formatted += `\nACTIVE MEDICATIONS (${data.activePrescriptions.length}):\n`;
    data.activePrescriptions.slice(0, 5).forEach(rx => {
      formatted += `- ${rx.medication_name} ${rx.dosage}, ${rx.frequency}\n`;
    });
  }
  
  if (data.recentAppointments?.length > 0) {
    formatted += `\nRECENT APPOINTMENTS (${data.recentAppointments.length}):\n`;
    data.recentAppointments.slice(0, 3).forEach(apt => {
      const date = new Date(apt.start_time).toLocaleDateString();
      formatted += `- ${date}: ${apt.appointment_type} (${apt.status})\n`;
    });
  }
  
  if (data.mentalHealthLogs?.length > 0) {
    const avgMood = (data.mentalHealthLogs.reduce((sum, log) => sum + (log.mood_score || 0), 0) / data.mentalHealthLogs.length).toFixed(1);
    formatted += `\nMENTAL HEALTH (Last ${data.mentalHealthLogs.length} logs):\n`;
    formatted += `Average Mood Score: ${avgMood}/10\n`;
    const latestLog = data.mentalHealthLogs[0];
    if (latestLog) {
      if (latestLog.stress_level) formatted += `Recent Stress: ${latestLog.stress_level}\n`;
      if (latestLog.anxiety_level) formatted += `Recent Anxiety: ${latestLog.anxiety_level}\n`;
      if (latestLog.sleep_hours) formatted += `Sleep: ${latestLog.sleep_hours} hrs\n`;
    }
  }
  
  if (data.therapySessions?.length > 0) {
    formatted += `\nTHERAPY SESSIONS (${data.therapySessions.length} total):\n`;
    data.therapySessions.slice(0, 2).forEach(session => {
      const date = new Date(session.session_date).toLocaleDateString();
      formatted += `- ${date}: ${session.session_type}, Progress: ${session.progress_score}/10\n`;
    });
  }
  
  if (data.treatmentPlans?.length > 0) {
    formatted += `\nACTIVE TREATMENT PLANS:\n`;
    data.treatmentPlans.forEach(plan => {
      formatted += `- ${plan.condition_name}\n`;
      if (plan.treatment_goals) formatted += `  Goals: ${JSON.stringify(plan.treatment_goals)}\n`;
    });
  }
  
  formatted += '\n--- END PATIENT CONTEXT ---\n\n';
  return formatted;
}

/**
 * Logs fetched data details to console
 * @param {string} sessionId - Session ID
 * @param {string} userId - User ID
 * @param {Object} patientData - Patient data object
 */
function logFetchedData(sessionId, userId, patientData) {
  console.log('\n========================================');
  console.log('📊 PATIENT DATA FETCHED');
  console.log('========================================');
  console.log('Session ID:', sessionId);
  console.log('User ID:', userId);
  console.log('\n✓ Profile:', patientData.profile ? `Found (${patientData.profile.name || 'N/A'})` : 'Not found');
  console.log('✓ Latest Vitals:', patientData.latestVitals ? 'Found' : 'Not found');
  if (patientData.latestVitals) {
    console.log(`  - BP: ${patientData.latestVitals.systolic_bp || 'N/A'}/${patientData.latestVitals.diastolic_bp || 'N/A'}`);
    console.log(`  - Heart Rate: ${patientData.latestVitals.heart_rate || 'N/A'} bpm`);
    console.log(`  - Temperature: ${patientData.latestVitals.temperature || 'N/A'}°F`);
    console.log(`  - SpO2: ${patientData.latestVitals.spo2 || 'N/A'}%`);
  }
  console.log('✓ Active Prescriptions:', patientData.activePrescriptions.length);
  console.log('✓ Recent Appointments:', patientData.recentAppointments.length);
  console.log('✓ Mental Health Logs:', patientData.mentalHealthLogs.length);
  console.log('✓ Therapy Sessions:', patientData.therapySessions.length);
  console.log('✓ Treatment Plans:', patientData.treatmentPlans.length);
  console.log('========================================\n');
}

module.exports = {
  fetchPatientData,
  formatPatientData,
  logFetchedData
};
