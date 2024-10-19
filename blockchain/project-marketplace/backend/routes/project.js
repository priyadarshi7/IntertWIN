const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Model for Project
const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    seller: String,
});
const ProjectModel = mongoose.model("Project", ProjectSchema);

// Create a project
router.post("/", async (req, res) => {
    const { title, description, price, seller } = req.body;

    const project = new ProjectModel({ title, description, price, seller });
    await project.save();
    res.status(201).json(project);
});

// Get all projects
router.get("/", async (req, res) => {
    const projects = await ProjectModel.find();
    res.json(projects);
});

module.exports = router;
