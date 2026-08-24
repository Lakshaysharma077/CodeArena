const express = require('express');
const router = express.Router();

const MOCK_CONTESTS = [
  {
    id: 'cnt_1',
    title: 'CodeArena Global Clash #42',
    slug: 'global-clash-42',
    status: 'LIVE',
    startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    endTime: new Date(Date.now() + 90 * 60 * 1000),  // 1.5 hrs left
    problemsCount: 4,
    participantsCount: 2480,
    prizes: ['$1,500 Cash Pool', 'Custom Conqueror Hoodie', 'Exclusive Discord Role'],
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    registered: true
  },
  {
    id: 'cnt_2',
    title: 'Valorant Sprint Championship 2026',
    slug: 'valorant-sprint-2026',
    status: 'UPCOMING',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // In 24h
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
    problemsCount: 5,
    participantsCount: 4120,
    prizes: ['Keychron Mechanical Keyboards', '$2,500 Prize Pool', 'Conqueror Badge'],
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    registered: false
  },
  {
    id: 'cnt_3',
    title: 'Algorithmic Warfare - Season 3 Final',
    slug: 'algorithmic-warfare-s3',
    status: 'PAST',
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    problemsCount: 4,
    participantsCount: 5890,
    prizes: ['$5,000 Grand Pool', 'Trophy'],
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    registered: true
  }
];

// @route GET /api/contests
router.get('/', (req, res) => {
  const { status = 'ALL' } = req.query;
  let list = MOCK_CONTESTS;
  if (status !== 'ALL') {
    list = list.filter(c => c.status === status);
  }
  res.json({ contests: list });
});

// @route POST /api/contests/:id/register
router.post('/:id/register', (req, res) => {
  const { id } = req.params;
  const contest = MOCK_CONTESTS.find(c => c.id === id);
  if (contest) {
    contest.registered = true;
    contest.participantsCount += 1;
  }
  res.json({ message: 'Successfully registered for contest', contest });
});

module.exports = router;
