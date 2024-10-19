// backend/models/Project.js

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  owner: String,
  projectId: String, // This is the ID for the blockchain
});

module.exports = mongoose.model('Project', projectSchema);
