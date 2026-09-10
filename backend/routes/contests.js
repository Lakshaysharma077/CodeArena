const express = require('express');
const router = express.Router();
const { dataStore } = require('../data/store');

// @route GET /api/contests
router.get('/', (req, res) => {
  const { status = 'ALL', userId = 'usr_demo' } = req.query;
  let list = dataStore.contests.map(c => ({
    ...c,
    registered: (c.registeredUsers || []).includes(userId)
  }));

  if (status !== 'ALL') {
    list = list.filter(c => c.status === status);
  }
  res.json({ contests: list });
});

// @route POST /api/contests/:id/register
router.post('/:id/register', (req, res) => {
  const { id } = req.params;
  const { userId = 'usr_demo' } = req.body || {};
  const contest = dataStore.registerForContest(id, userId);

  if (!contest) {
    return res.status(404).json({ message: 'Contest not found' });
  }

  res.json({
    message: 'Successfully registered for contest',
    contest: {
      ...contest,
      registered: true
    }
  });
});

module.exports = router;
