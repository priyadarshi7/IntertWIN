const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all projects
router.get('/', async (req, res) => {
    const projects = await Project.find();
    res.json(projects);
});

// Create a project
router.post('/create', async (req, res) => {
    const { title, description, price, owner } = req.body;
    const newProject = new Project({ title, description, price, owner });
    await newProject.save();
    res.json(newProject);
});

module.exports = router;
