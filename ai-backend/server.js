require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ChatGroq } = require('@langchain/groq');
const { BufferMemory } = require('langchain/memory');
const { ConversationChain } = require('langchain/chains');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory session storage
const sessions = new Map();

// Initialize Groq Chat Model
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,
  maxTokens: 1024,
});

// Mental Health System Prompt
const SYSTEM_PROMPT = `You are Dr. Mindwell, a compassionate and professional mental health assistant for the HackCrypt Health Platform.

Your role:
- Provide empathetic, non-judgmental support
- Help users track their mental health
- Suggest coping strategies and self-care tips
- Recognize crisis situations and recommend professional help
- NEVER diagnose or prescribe medication
- Always encourage users to consult licensed therapists for serious concerns

Guidelines:
- Be warm, friendly, and supportive
- Use simple, clear language
- Ask follow-up questions to understand their feelings
- Validate their emotions
- Suggest practical coping techniques (breathing exercises, journaling, mindfulness)
- If detecting crisis keywords (suicide, self-harm, severe depression), provide crisis hotline numbers

Crisis Response:
If user mentions: suicide, self-harm, wanting to die, feeling hopeless
Respond: "I'm really concerned about what you're sharing. Please reach out to a crisis hotline immediately: National Suicide Prevention Lifeline: 988 or 1-800-273-8255. You can also text HOME to 741741. Your life matters and help is available."

When patient data is provided:
- Reference their health conditions if relevant to mental health
- Consider how physical health (vitals, medications) may affect mood
- Acknowledge their ongoing treatments and appointments
- Be personalized but maintain professional boundaries`;

// Get or create session
function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    const memory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'history',
    });
    
    const chain = new ConversationChain({
      llm: model,
      memory: memory,
    });
    
    sessions.set(sessionId, {
      chain,
      memory,
      patientData: null,
      createdAt: new Date(),
    });
  }
  return sessions.get(sessionId);
}

// Format patient data for AI context
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

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'AI Backend is running',
    sessions: sessions.size 
  });
});

// POST /api/chat/message - Send message to AI
app.post('/api/chat/message', async (req, res) => {
  try {
    const { sessionId, message, userId } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'sessionId and message are required' 
      });
    }
    
    const session = getSession(sessionId);
    
    // Always include patient context if available
    let fullMessage = message;
    if (session.patientData) {
      const contextPrefix = `\n[CONTEXT: You have access to the patient's health data. Reference it when relevant.]\n`;
      fullMessage = contextPrefix + message;
    }
    
    // Get AI response
    const response = await session.chain.call({ input: fullMessage });
    
    res.json({
      success: true,
      response: response.response,
      sessionId: sessionId
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get AI response',
      details: error.message 
    });
  }
});

// POST /api/chat/fetch-data - Fetch patient data
app.post('/api/chat/fetch-data', async (req, res) => {
  try {
    const { sessionId, userId, clerkUserId } = req.body;
    
    if (!sessionId || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'sessionId and userId are required' 
      });
    }
    
    // Fetch patient data from main backend
    const MAIN_BACKEND = process.env.MAIN_BACKEND_URL || 'http://localhost:5000';
    
    // Fetch all patient data in parallel
    const [
      patientRes,
      vitalsRes,
      prescriptionsRes,
      appointmentsRes,
      mentalHealthRes,
      therapyRes,
      treatmentRes
    ] = await Promise.allSettled([
      fetch(`${MAIN_BACKEND}/api/patients/${userId}`),
      fetch(`${MAIN_BACKEND}/api/physical-vitals/patient/${userId}/latest`),
      fetch(`${MAIN_BACKEND}/api/prescriptions/patient/${userId}?is_active=true`),
      fetch(`${MAIN_BACKEND}/api/appointments/patient/${userId}?limit=5`),
      fetch(`${MAIN_BACKEND}/api/mental-health/patient/${userId}?limit=7`),
      fetch(`${MAIN_BACKEND}/api/therapy/patient/${userId}?limit=5`),
      fetch(`${MAIN_BACKEND}/api/treatment-plans/patient/${userId}?is_active=true`)
    ]);
    
    const patientData = {
      profile: patientRes.status === 'fulfilled' && patientRes.value.ok ? await patientRes.value.json() : null,
      latestVitals: vitalsRes.status === 'fulfilled' && vitalsRes.value.ok ? await vitalsRes.value.json() : null,
      activePrescriptions: prescriptionsRes.status === 'fulfilled' && prescriptionsRes.value.ok ? (await prescriptionsRes.value.json()).data || [] : [],
      recentAppointments: appointmentsRes.status === 'fulfilled' && appointmentsRes.value.ok ? (await appointmentsRes.value.json()).data || [] : [],
      mentalHealthLogs: mentalHealthRes.status === 'fulfilled' && mentalHealthRes.value.ok ? (await mentalHealthRes.value.json()).data || [] : [],
      therapySessions: therapyRes.status === 'fulfilled' && therapyRes.value.ok ? (await therapyRes.value.json()).data || [] : [],
      treatmentPlans: treatmentRes.status === 'fulfilled' && treatmentRes.value.ok ? (await treatmentRes.value.json()).data || [] : []
    };
    
    // Store patient data in session
    const session = getSession(sessionId);
    session.patientData = patientData;
    
    // Log fetched data details to terminal
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
    
    // Initialize conversation with system prompt and patient data
    const initMessage = SYSTEM_PROMPT + formatPatientData(patientData) + '\n\nGreet the patient and let them know you have their health data loaded and ready to discuss.';
    const aiResponse = await session.chain.call({ input: initMessage });
    
    console.log('Patient data loaded for session:', sessionId);
    
    res.json({
      success: true,
      message: 'Your complete health data has been loaded',
      dataFetched: {
        profile: !!patientData.profile,
        vitals: patientData.latestVitals ? 1 : 0,
        prescriptions: patientData.activePrescriptions.length,
        appointments: patientData.recentAppointments.length,
        mentalHealthLogs: patientData.mentalHealthLogs.length,
        therapySessions: patientData.therapySessions.length,
        treatmentPlans: patientData.treatmentPlans.length,
        wellnessSessions: 0, // Not implemented yet
        medicationAdherence: 0, // Not implemented yet
        healthAlerts: 0, // Not implemented yet
        notifications: 0 // Not implemented yet
      }
    });
    
  } catch (error) {
    console.error('Fetch data error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch patient data',
      details: error.message 
    });
  }
});

// DELETE /api/chat/session - Clear session
app.delete('/api/chat/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (sessions.has(sessionId)) {
    sessions.delete(sessionId);
    res.json({ success: true, message: 'Session cleared' });
  } else {
    res.status(404).json({ success: false, error: 'Session not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   AI Mental Health Chatbot Backend   ║
║   Port: ${PORT}                           ║
║   Model: Llama 3.3 70B (Groq)         ║
║   Time: ${new Date().toLocaleString()}  ║
╚════════════════════════════════════════╝
  `);
  
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
    console.warn('⚠️  WARNING: GROQ_API_KEY not set in .env file!');
    console.warn('   Get your API key from: https://console.groq.com/keys\n');
  }
});

// Cleanup old sessions every hour
setInterval(() => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  for (const [sessionId, session] of sessions.entries()) {
    if (session.createdAt < oneHourAgo) {
      sessions.delete(sessionId);
      console.log(`Cleaned up old session: ${sessionId}`);
    }
  }
}, 60 * 60 * 1000);

module.exports = app;
