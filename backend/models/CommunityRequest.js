const mongoose = require('mongoose');

const communityRequestSchema = new mongoose.Schema(
  {
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommunityGroup',
      required: true,
      index: true,
    },
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'pending',
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'community_requests',
  }
);

module.exports = mongoose.model('CommunityRequest', communityRequestSchema);
