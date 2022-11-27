const express = require('express');
const { getAllPersons } = require('../db');

const router = express.Router();

router.get('', async (req, res) => {
  const persons = await getAllPersons();
  res.json(persons);
});

module.exports = router;
