const LiveSession = require('../models/LiveSession');

/**
 * CREATE TELECONSULTATION SESSION (DOCTOR)
 * sessionName = Patient Name
 */
exports.createLiveSession = async (req, res) => {
  try {
    const {
      sessionName, // patient name
      sessionUrl,
      doctorId,
      doctorName,
      doctorEmail,
    } = req.body;

    if (!sessionName || !sessionUrl || !doctorId) {
      return res.status(400).json({
        success: false,
        message: 'Patient name, session URL, and doctor ID are required',
      });
    }

    const session = await LiveSession.create({
      sessionName,
      sessionUrl,
      doctorId,
      doctorName: doctorName || '',
      doctorEmail: doctorEmail || '',
    });

    return res.status(201).json({ success: true, session });
  } catch (error) {
    console.error('Failed to create teleconsultation session', error);
    return res.status(500).json({ success: false, message: 'Failed to create teleconsultation session' });
  }
};

/**
 * GET TELECONSULTATION SESSIONS FOR A DOCTOR
 */
exports.getDoctorSessions = async (req, res) => {
  try {
    const { doctorId } = req.query;

    if (!doctorId) {
      return res.status(400).json({ success: false, message: 'Doctor ID is required' });
    }

    const sessions = await LiveSession.find({ doctorId }).sort({ createdAt: -1 });

    return res.json({ success: true, sessions });
  } catch (error) {
    console.error('Failed to fetch doctor sessions', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch teleconsultation sessions' });
  }
};

/**
 * GET TELECONSULTATION SESSIONS FOR PATIENT
 * (Currently shows all sessions; can be filtered later)
 */
exports.getPatientSessions = async (req, res) => {
  try {
    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ success: false, message: 'Patient ID is required' });
    }

    const sessions = await LiveSession.find({}).sort({ createdAt: -1 });

    return res.json({ success: true, sessions });
  } catch (error) {
    console.error('Failed to fetch patient sessions', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch teleconsultation sessions' });
  }
};
