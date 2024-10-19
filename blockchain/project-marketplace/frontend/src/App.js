import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

function App() {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ title: "", description: "", price: "", seller: "" });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const response = await fetch("http://localhost:8000/projects");
        const data = await response.json();
        setProjects(data);
    };

    const addProject = async () => {
        await fetch("http://localhost:8000/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProject),
        });
        fetchProjects();
    };

    return (
        <div>
            <h1>Project Marketplace</h1>
            <input
                type="text"
                placeholder="Title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            />
            <input
                type="text"
                placeholder="Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
            <input
                type="number"
                placeholder="Price (in MATIC)"
                value={newProject.price}
                onChange={(e) => setNewProject({ ...newProject, price: e.target.value })}
            />
            <button onClick={addProject}>Add Project</button>
            <h2>Available Projects:</h2>
            <ul>
                {projects.map((project) => (
                    <li key={project._id}>{project.title} - {project.price} MATIC</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
