const MentalHealthLog = require('../models/MentalHealthLog');

// @desc    Create a new mental health log entry (Patient Feature)
// @route   POST /api/mental-health
// @access  Patient/Doctor
exports.createMentalHealthLog = async (req, res) => {
  try {
    const {
      patient_id,
      recorded_by,
      mood_rating,
      stress_level,
      anxiety_level,
      sleep_hours,
      sleep_quality,
      phq9_score,
      gad7_score,
      notes
    } = req.body;

    // Validation
    if (!patient_id || !recorded_by) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID and Recorded By are required'
      });
    }

    const mentalHealthLog = new MentalHealthLog({
      patient_id,
      recorded_by,
      recorded_date: new Date(),
      mood_rating,
      stress_level,
      anxiety_level,
      sleep_hours,
      sleep_quality,
      phq9_score,
      gad7_score,
      notes
    });

    const savedLog = await mentalHealthLog.save();

    res.status(201).json({
      success: true,
      message: 'Mental health log created successfully',
      data: savedLog
    });
  } catch (error) {
    console.error('Error creating mental health log:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating mental health log',
      error: error.message
    });
  }
};

// @desc    Get all mental health logs for a patient (Doctor Feature)
// @route   GET /api/mental-health/patient/:patientId
// @access  Doctor/Patient
exports.getPatientMentalHealthLogs = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { startDate, endDate, limit = 50 } = req.query;

    let query = { patient_id: patientId };

    // Date range filter
    if (startDate || endDate) {
      query.recorded_date = {};
      if (startDate) query.recorded_date.$gte = new Date(startDate);
      if (endDate) query.recorded_date.$lte = new Date(endDate);
    }

    const logs = await MentalHealthLog.find(query)
      .sort({ recorded_date: -1 })
      .limit(parseInt(limit));

    // Calculate statistics
    const stats = await calculateMentalHealthStats(patientId, startDate, endDate);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
      statistics: stats
    });
  } catch (error) {
    console.error('Error fetching mental health logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mental health logs',
      error: error.message
    });
  }
};

// @desc    Get a single mental health log by ID
// @route   GET /api/mental-health/:id
// @access  Doctor/Patient
exports.getMentalHealthLogById = async (req, res) => {
  try {
    const log = await MentalHealthLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Mental health log not found'
      });
    }

    res.status(200).json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error('Error fetching mental health log:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mental health log',
      error: error.message
    });
  }
};

// @desc    Update a mental health log
// @route   PUT /api/mental-health/:id
// @access  Doctor
exports.updateMentalHealthLog = async (req, res) => {
  try {
    const log = await MentalHealthLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Mental health log not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mental health log updated successfully',
      data: log
    });
  } catch (error) {
    console.error('Error updating mental health log:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating mental health log',
      error: error.message
    });
  }
};

// @desc    Delete a mental health log
// @route   DELETE /api/mental-health/:id
// @access  Doctor/Admin
exports.deleteMentalHealthLog = async (req, res) => {
  try {
    const log = await MentalHealthLog.findByIdAndDelete(req.params.id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Mental health log not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mental health log deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting mental health log:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting mental health log',
      error: error.message
    });
  }
};

// @desc    Get mental health analytics/statistics (Doctor Feature)
// @route   GET /api/mental-health/analytics/:patientId
// @access  Doctor
exports.getMentalHealthAnalytics = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { period = '30' } = req.query; // Default to last 30 days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const stats = await calculateMentalHealthStats(patientId, startDate);

    // Get trend data
    const trendData = await MentalHealthLog.aggregate([
      {
        $match: {
          patient_id: patientId,
          recorded_date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$recorded_date' }
          },
          avgMoodRating: { $avg: '$mood_rating' },
          avgStressLevel: { $avg: '$stress_level' },
          avgSleepHours: { $avg: '$sleep_hours' },
          avgSleepQuality: { $avg: '$sleep_quality' },
          avgGad7: { $avg: '$gad7_score' },
          avgPhq9: { $avg: '$phq9_score' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period: `${period} days`,
        statistics: stats,
        trends: trendData
      }
    });
  } catch (error) {
    console.error('Error fetching mental health analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mental health analytics',
      error: error.message
    });
  }
};

// @desc    Quick mood log entry (Patient Feature - Simplified)
// @route   POST /api/mental-health/quick-log
// @access  Patient
exports.quickMoodLog = async (req, res) => {
  try {
    const { patient_id, mood_rating, stress_level, anxiety_level, notes } = req.body;

    if (!patient_id || !mood_rating) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID and mood rating are required'
      });
    }

    const quickLog = new MentalHealthLog({
      patient_id,
      recorded_by: patient_id, // Patient records their own mood
      recorded_date: new Date(),
      mood_rating,
      stress_level: stress_level || 'Medium',
      anxiety_level: anxiety_level || 'Medium',
      notes
    });

    const savedLog = await quickLog.save();

    res.status(201).json({
      success: true,
      message: 'Mood logged successfully!',
      data: savedLog
    });
  } catch (error) {
    console.error('Error logging quick mood:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging mood',
      error: error.message
    });
  }
};

// @desc    Get recent mood logs (last 7 days)
// @route   GET /api/mental-health/recent/:patientId
// @access  Patient/Doctor
exports.getRecentMoodLogs = async (req, res) => {
  try {
    const { patientId } = req.params;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await MentalHealthLog.find({
      patient_id: patientId,
      recorded_date: { $gte: sevenDaysAgo }
    })
      .sort({ recorded_date: -1 })
      .limit(7);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching recent mood logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent mood logs',
      error: error.message
    });
  }
};

// Helper function to calculate statistics
async function calculateMentalHealthStats(patientId, startDate, endDate) {
  try {
    const matchQuery = { patient_id: patientId };
    
    if (startDate || endDate) {
      matchQuery.recorded_date = {};
      if (startDate) matchQuery.recorded_date.$gte = new Date(startDate);
      if (endDate) matchQuery.recorded_date.$lte = new Date(endDate);
    }

    const stats = await MentalHealthLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          avgMoodRating: { $avg: '$mood_rating' },
          avgSleepHours: { $avg: '$sleep_hours' },
          avgSleepQuality: { $avg: '$sleep_quality' },
          avgGad7Score: { $avg: '$gad7_score' },
          avgPhq9Score: { $avg: '$phq9_score' },
          totalLogs: { $sum: 1 },
          lowStressCount: {
            $sum: {
              $cond: [{ $in: ['$stress_level', ['Low', 'low']] }, 1, 0]
            }
          },
          mediumStressCount: {
            $sum: {
              $cond: [{ $in: ['$stress_level', ['Medium', 'medium']] }, 1, 0]
            }
          },
          highStressCount: {
            $sum: {
              $cond: [{ $in: ['$stress_level', ['High', 'high']] }, 1, 0]
            }
          }
        }
      }
    ]);

    return stats[0] || {};
  } catch (error) {
    console.error('Error calculating statistics:', error);
    return {};
  }
}

module.exports = exports;
