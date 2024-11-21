const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3500

app.use(cors())
app.use(bodyParser.json())

let tasks = []

app.get('/tasks', (req, res) => {
    res.json(tasks)
})

app.get('/tasks/:index', (req, res) => {
    res.json(tasks[req.params.index])
})

app.post('/tasks', (req, res) => {
    const { name } = req.body
    tasks.push({ name, status: 'todo' })
    res.status(201).json({ message: 'Task added successfully' })
})

app.put('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index, 10)
    if (index < 0 || index >= tasks.length || isNaN(index)) {
        return res.status(404).send('Task not found');
    }
    const task = tasks[index]
    if (!task) return res.status(404).send('Task not found');
    task.name = req.body.name
    task.status = req.body.status
    tasks[index] = task
    res.status(201).json({ message: 'Task updated successfully' })
})

app.delete('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index, 10); // Convert the index to a number
    if (index < 0 || index >= tasks.length || isNaN(index)) {
        return res.status(404).send('Task not found');
    }
    tasks.splice(index, 1); // Remove the task at the specified index
    res.status(200).json({ message: 'Task deleted successfully' });
});

app.listen(port, () => {
    console.log(`NodeJS server running at http://localhost:${port}`)
})