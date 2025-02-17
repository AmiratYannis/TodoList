const mongoose = require('mongoose')
const { Schema } = mongoose;

const taskSchema = new Schema({
    userID: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, default: 'todo' },
});

const Task = mongoose.model('Task', taskSchema)

module.exports = Task;