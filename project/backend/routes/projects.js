// backend/routes/projects.js

const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Create a new project
router.post('/', async (req, res) => {
  const { title, description, price, owner, projectId } = req.body;
  const newProject = new Project({ title, description, price, owner, projectId });
  await newProject.save();
  res.json(newProject);
});

// Get all projects
router.get('/', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

module.exports = router;
