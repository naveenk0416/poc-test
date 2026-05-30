const express = require('express');
const router = express.Router();
const { createFir, getFirs, getFirById } = require('../controllers/firController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createFir)
  .get(protect, getFirs);

router.route('/:id')
  .get(protect, getFirById);

module.exports = router;
