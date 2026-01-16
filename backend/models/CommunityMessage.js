const mongoose = require('mongoose');

const communityMessageSchema = new mongoose.Schema(
  {
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommunityGroup',
      required: true,
      index: true,
    },
    sender_id: {
      type: String,
      required: true,
    },
    sender_name: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'community_messages',
  }
);

module.exports = mongoose.model('CommunityMessage', communityMessageSchema);
