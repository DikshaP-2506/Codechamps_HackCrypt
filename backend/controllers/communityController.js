const CommunityGroup = require('../models/CommunityGroup');
const CommunityMember = require('../models/CommunityMember');
const CommunityMessage = require('../models/CommunityMessage');
const CommunityRequest = require('../models/CommunityRequest');

const getUserId = (req) => req?.user?.id || req.headers['x-user-id'] || req.body?.user_id || req.query?.user_id;

const buildGroupWithMeta = async (group, userId) => {
  const memberCount = await CommunityMember.countDocuments({ group_id: group._id });
  const isMember = !!userId && (group.creator_id === userId || (await CommunityMember.exists({ group_id: group._id, user_id: userId })));
  return {
    ...group.toObject(),
    memberCount,
    isMember,
  };
};

exports.createCommunityGroup = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { name, topic, description, visibility = 'public' } = req.body || {};
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    const group = await CommunityGroup.create({
      name,
      topic: topic || '',
      description: description || '',
      visibility: visibility === 'private' ? 'private' : 'public',
      creator_id: userId,
    });

    await CommunityMember.create({ group_id: group._id, user_id: userId, role: 'creator' });

    const result = await buildGroupWithMeta(group, userId);
    return res.status(201).json({ success: true, group: result });
  } catch (err) {
    console.error('Create community group error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create community', error: err.message });
  }
};

exports.listCommunityGroups = async (req, res) => {
  try {
    const userId = getUserId(req);
    let memberGroupIds = [];

    if (userId) {
      memberGroupIds = await CommunityMember.find({ user_id: userId }).distinct('group_id');
    }

    const filter = userId
      ? { $or: [{ visibility: 'public' }, { _id: { $in: memberGroupIds } }] }
      : { visibility: 'public' };

    const groups = await CommunityGroup.find(filter).sort({ created_at: -1 });
    const groupIds = groups.map((g) => g._id);

    const counts = await CommunityMember.aggregate([
      { $match: { group_id: { $in: groupIds } } },
      { $group: { _id: '$group_id', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));

    const response = groups.map((g) => ({
      ...g.toObject(),
      memberCount: countMap.get(String(g._id)) || 0,
      isMember: !!userId && (g.creator_id === userId || memberGroupIds.some((id) => String(id) === String(g._id))),
    }));

    return res.json({ success: true, groups: response, total: response.length });
  } catch (err) {
    console.error('List community groups error:', err);
    return res.status(500).json({ success: false, message: 'Failed to list communities', error: err.message });
  }
};

exports.getCommunityGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    if (!id) return res.status(400).json({ success: false, message: 'Group id required' });

    const group = await CommunityGroup.findById(id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    const isMember = !!userId && (group.creator_id === userId || (await CommunityMember.exists({ group_id: id, user_id: userId })));
    const members = isMember ? await CommunityMember.find({ group_id: id }).lean() : [];
    const memberCount = members.length || (await CommunityMember.countDocuments({ group_id: id }));

    const messages = isMember
      ? await CommunityMessage.find({ group_id: id }).sort({ created_at: -1 }).limit(50).lean()
      : [];

    const request = !isMember && userId ? await CommunityRequest.findOne({ group_id: id, user_id: userId, status: 'pending' }) : null;

    return res.json({
      success: true,
      group: { ...group.toObject(), memberCount },
      isMember,
      members,
      messages: messages.reverse(),
      requestPending: !!request,
    });
  } catch (err) {
    console.error('Get community group error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch community', error: err.message });
  }
};

exports.joinCommunityGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    if (!id || !userId) return res.status(400).json({ success: false, message: 'Missing group id or unauthorized' });

    const group = await CommunityGroup.findById(id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    const existingMember = await CommunityMember.findOne({ group_id: id, user_id: userId });
    if (existingMember) return res.json({ success: true, message: 'Already a member' });

    if (group.visibility === 'public') {
      await CommunityMember.create({ group_id: id, user_id: userId, role: 'member' });
      return res.json({ success: true, message: 'Joined community' });
    }

    const existingRequest = await CommunityRequest.findOne({ group_id: id, user_id: userId, status: 'pending' });
    if (existingRequest) return res.json({ success: true, message: 'Request already pending', requestId: existingRequest._id });

    const reqDoc = await CommunityRequest.create({ group_id: id, user_id: userId });
    return res.json({ success: true, message: 'Request submitted', requestId: reqDoc._id });
  } catch (err) {
    console.error('Join community group error:', err);
    return res.status(500).json({ success: false, message: 'Failed to join community', error: err.message });
  }
};

exports.leaveCommunityGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    if (!id || !userId) return res.status(400).json({ success: false, message: 'Missing params' });

    const group = await CommunityGroup.findById(id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    if (group.creator_id === userId) return res.status(400).json({ success: false, message: 'Creator cannot leave their own community' });

    await CommunityMember.deleteOne({ group_id: id, user_id: userId });
    return res.json({ success: true, message: 'Left community' });
  } catch (err) {
    console.error('Leave community group error:', err);
    return res.status(500).json({ success: false, message: 'Failed to leave community', error: err.message });
  }
};

exports.approveCommunityRequest = async (req, res) => {
  try {
    const { id, requestId } = req.params;
    const userId = getUserId(req);
    if (!id || !requestId) return res.status(400).json({ success: false, message: 'Missing params' });

    const group = await CommunityGroup.findById(id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    if (group.creator_id !== userId) return res.status(403).json({ success: false, message: 'Only creator can approve' });

    const requestDoc = await CommunityRequest.findById(requestId);
    if (!requestDoc) return res.status(404).json({ success: false, message: 'Request not found' });

    await CommunityMember.create({ group_id: id, user_id: requestDoc.user_id, role: 'member' });
    await requestDoc.updateOne({ status: 'approved' });

    return res.json({ success: true, message: 'Request approved' });
  } catch (err) {
    console.error('Approve community request error:', err);
    return res.status(500).json({ success: false, message: 'Failed to approve request', error: err.message });
  }
};

exports.deleteCommunityGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    if (!id || !userId) return res.status(400).json({ success: false, message: 'Group id and user required' });

    const group = await CommunityGroup.findById(id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    if (group.creator_id !== userId) return res.status(403).json({ success: false, message: 'Only creator can delete group' });

    await Promise.all([
      CommunityMember.deleteMany({ group_id: id }),
      CommunityMessage.deleteMany({ group_id: id }),
      CommunityRequest.deleteMany({ group_id: id }),
    ]);
    await group.deleteOne();

    return res.json({ success: true, message: 'Community deleted' });
  } catch (err) {
    console.error('Delete community group error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete community', error: err.message });
  }
};

exports.sendCommunityMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const { text, sender_name } = req.body || {};

    if (!id || !userId) return res.status(400).json({ success: false, message: 'Missing params or unauthorized' });
    if (!text) return res.status(400).json({ success: false, message: 'Message text required' });

    const group = await CommunityGroup.findById(id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    const isMember = group.creator_id === userId || (await CommunityMember.exists({ group_id: id, user_id: userId }));
    if (!isMember) return res.status(403).json({ success: false, message: 'Only members can message' });

    const message = await CommunityMessage.create({
      group_id: id,
      sender_id: userId,
      sender_name: sender_name || userId,
      text,
    });

    return res.json({ success: true, message: message.toObject() });
  } catch (err) {
    console.error('Send community message error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message', error: err.message });
  }
};

exports.listCommunityMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    if (!id || !userId) return res.status(400).json({ success: false, message: 'Missing params or unauthorized' });

    const group = await CommunityGroup.findById(id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    const isMember = group.creator_id === userId || (await CommunityMember.exists({ group_id: id, user_id: userId }));
    if (!isMember) return res.status(403).json({ success: false, message: 'Only members can view messages' });

    const messages = await CommunityMessage.find({ group_id: id }).sort({ created_at: -1 }).limit(100).lean();
    return res.json({ success: true, messages: messages.reverse() });
  } catch (err) {
    console.error('List community messages error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch messages', error: err.message });
  }
};
