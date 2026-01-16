const mongoose = require('mongoose');

const communityMemberSchema = new mongoose.Schema(
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
    role: {
      type: String,
      enum: ['creator', 'member'],
      default: 'member',
    },
    joined_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'community_members',
  }
);

communityMemberSchema.index({ group_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('CommunityMember', communityMemberSchema);
