const mongoose = require('mongoose');

const liveSessionSchema = new mongoose.Schema(
  {
    sessionName: { type: String, required: true }, // patient name
    sessionUrl: { type: String, required: true },

    doctorId: { type: String, required: true },
    doctorName: String,
    doctorEmail: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('LiveSession', liveSessionSchema);
