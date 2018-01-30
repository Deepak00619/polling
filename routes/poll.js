// Setup Router
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Vote = require('../models/Vote');

// Setup Pusher
const Pusher = require('pusher');
const keys = require('../config/keys');
const pusher = new Pusher({
  appId: keys.pusherAppId,
  key: keys.pusherKey,
  secret: keys.pusherSecret,
  cluster: keys.pusherCluster,
  encrypted: keys.pusherEncrypted
});

router.get('/', (req, res) => Vote.find().then(votes => res.json({ success: true, votes: votes })));

router.post('/', (req,res) => {
  const newVote = { js: req.body.js, points: 1 }
  new Vote(newVote).save().then(vote => pusher.trigger('js-poll', 'js-vote', { points: vote.points, js: vote.js }));
  return res.json({ success: true });
});

module.exports = router;