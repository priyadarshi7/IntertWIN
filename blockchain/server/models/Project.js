const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    owner: String,
    blockchainId: String,
    sold: { type: Boolean, default: false },
});

module.exports = mongoose.model('Project', ProjectSchema);
