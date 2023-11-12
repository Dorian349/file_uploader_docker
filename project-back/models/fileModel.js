const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    id: Number,
    name: String,
    path: String
}, { timestamps: true });

const FileModel = mongoose.model('File', fileSchema);

module.exports = FileModel;