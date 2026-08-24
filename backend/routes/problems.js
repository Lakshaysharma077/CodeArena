const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const { SEED_PROBLEMS } = require('../data/seedProblems');

// In-memory active catalog
let problemCatalog = [...SEED_PROBLEMS];

// Helper to sanitize problem for client view (strip hidden test cases)
const sanitizeProblem = (problem) => {
  const p = problem.toObject ? problem.toObject() : { ...problem };
  delete p.hiddenTestcases;
  return p;
};

// @route GET /api/problems
router.get('/', async (req, res) => {
  try {
    const { difficulty, topic, company, search } = req.query;
    let list = [...problemCatalog];

    if (difficulty && difficulty !== 'All') {
      list = list.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (topic && topic !== 'All') {
      list = list.filter(p => p.topics && p.topics.some(t => t.toLowerCase() === topic.toLowerCase()));
    }

    if (company && company !== 'All') {
      list = list.filter(p => p.companies && p.companies.some(c => c.toLowerCase() === company.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.topics && p.topics.some(t => t.toLowerCase().includes(q))) ||
        (p.companies && p.companies.some(c => c.toLowerCase().includes(q)))
      );
    }

    const sanitized = list.map(sanitizeProblem);
    res.json({
      count: sanitized.length,
      problems: sanitized
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/problems/topics
router.get('/meta/topics', (req, res) => {
  const allTopics = new Set();
  problemCatalog.forEach(p => (p.topics || []).forEach(t => allTopics.add(t)));
  res.json({ topics: Array.from(allTopics).sort() });
});

// @route GET /api/problems/companies
router.get('/meta/companies', (req, res) => {
  const allCompanies = new Set();
  problemCatalog.forEach(p => (p.companies || []).forEach(c => allCompanies.add(c)));
  res.json({
    companies: Array.from(allCompanies).sort(),
    disclaimer: 'Company tags represent interview association metadata based on public community reports.'
  });
});

// @route GET /api/problems/:idOrSlug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let problem = problemCatalog.find(
      p => p.problemId === idOrSlug || p.slug === idOrSlug || p._id === idOrSlug || p.id === idOrSlug
    );

    if (!problem) {
      problem = problemCatalog[0];
    }

    res.json(sanitizeProblem(problem));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

