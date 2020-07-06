'use strict';

const express = require('express');
const router = express.Router();
const Tag = require('../../models/Tags');

router.get('/', async function(req, res, next) {
  try {
    const tags = await Tag.list();

    if (!tags) {
        res.status(400).json("There are no tags created");
        return;
    }
    res.status(201).json(tags);

  } catch (error) { next(error); }
});

module.exports = router;
