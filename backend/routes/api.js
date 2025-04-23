const express = require('express');
const router = express.Router();
const schools = require('../data/schools.json');
router.get('/test', (req, res) => {
    res.send('Test route is working!');
  });
// Match endpoint
router.get('/match', (req, res) => {
  const userUTR = parseFloat(req.query.utr);
  const targetRate = parseFloat(req.query.rate);
  const major = req.query.major?.toLowerCase();

  const matches = schools.filter(s =>
    userUTR >= s.teamUTRRange.min &&
    userUTR <= s.teamUTRRange.max &&
    s.acceptanceRate <= targetRate &&
    s.topMajors.some(m => m.toLowerCase().includes(major))
  );

  res.json(matches.slice(0, 5));

});

// Search by school slug
router.get('/school/:slug', (req, res) => {
  const school = schools.find(s => s.slug === req.params.slug);
  school ? res.json(school) : res.status(404).json({ error: "School not found" });
});

// 🔍 Search suggestions endpoint — returns name + slug
router.get('/schools', (req, res) => {
    const names = schools.map(s => ({
      name: s.schoolName,
      slug: s.slug
    }));
    res.json(names);
  });
module.exports = router;
