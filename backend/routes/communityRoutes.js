const express = require('express');
const {
  createCommunityGroup,
  listCommunityGroups,
  getCommunityGroup,
  joinCommunityGroup,
  leaveCommunityGroup,
  sendCommunityMessage,
  approveCommunityRequest,
  deleteCommunityGroup,
  listCommunityMessages,
  setAllGroupsPublic,
} = require('../controllers/communityController');

const router = express.Router();

router.get('/', listCommunityGroups);
router.post('/', createCommunityGroup);
router.post('/set-all-public', setAllGroupsPublic); // Migration endpoint
router.get('/:id', getCommunityGroup);
router.post('/:id/join', joinCommunityGroup);
router.post('/:id/leave', leaveCommunityGroup);
router.post('/:id/messages', sendCommunityMessage);
router.get('/:id/messages', listCommunityMessages);
router.post('/:id/requests/:requestId/approve', approveCommunityRequest);
router.delete('/:id', deleteCommunityGroup);

module.exports = router;
