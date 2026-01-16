require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeModel, createConversationChain, initializeConversation, getAIResponse } = require('./aiIntegration');
const { fetchPatientData, formatPatientData, logFetchedData } = require('./dataFetcher');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory session storage
const sessions = new Map();

// Initialize Groq Model
const model = initializeModel(process.env.GROQ_API_KEY);

/**
 * Get or create session
 * @param {string} sessionId - Session ID
 * @returns {Object} Session object
 */
function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    const { chain, memory } = createConversationChain(model);
    
    sessions.set(sessionId, {
      chain,
      memory,
      patientData: null,
      createdAt: new Date(),
    });
  }
  return sessions.get(sessionId);
}

// ========================================
// API Routes
// ========================================

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
    const hasPatientData = !!session.patientData;
    
    // Get AI response
    const response = await getAIResponse(session.chain, message, hasPatientData);
    
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
    
    // Fetch patient data from main backend - resolve Clerk ID to numeric patient_id
    const patientData = await fetchPatientData(userId, clerkUserId || userId, process.env.MAIN_BACKEND_URL);
    
    if (patientData.error) {
      return res.status(404).json({ 
        success: false, 
        error: patientData.error 
      });
    }
    
    // Store patient data in session
    const session = getSession(sessionId);
    session.patientData = patientData;
    
    // Log fetched data details to terminal
    logFetchedData(patientData);
    
    // Initialize conversation with system prompt and patient data
    const formattedData = formatPatientData(patientData);
    await initializeConversation(session.chain, formattedData);
    
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
        wellnessSessions: 0,
        medicationAdherence: 0,
        healthAlerts: 0,
        notifications: 0
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

// ========================================
// Start Server
// ========================================

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

// ========================================
// Cleanup
// ========================================

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
