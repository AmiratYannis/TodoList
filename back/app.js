const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const app = express()
const port = 3500

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's origin
    credentials: true, // Allow credentials (cookies) to be sent
}));

app.use(bodyParser.json())
app.use(
    session({
        store: new FileStore({
            path: './sessions', // Ensure this directory exists
            retries: 5, // Retry saving the session if it fails
        }),
        secret: 'keyboard cat',
        resave: true, // Prevent unnecessary session saving
        saveUninitialized: true, // Do not save an uninitialized session
        cookie: { maxAge: 3600000 }, // 1-hour session expiration
    })
);

app.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Current session tasks:', req.session.tasks); // Debug log
    if (!req.session.tasks) {
        req.session.tasks = []; // Only initialize if it does not exist
    }
    next();
});


app.get('/tasks', (req, res) => {
    console.log('Fetching tasks from session:', req.session.tasks);
    res.json(req.session.tasks);
});

app.get('/tasks/:index', (req, res) => {
    res.json(req.session.tasks[req.params.index])
})

app.post('/tasks', (req, res) => {
    const { name } = req.body;
    const newTask = { name, status: 'todo' };

    // Add the new task to the session
    req.session.tasks.push(newTask);
    console.log('Task added:', newTask);
    console.log('Updated session tasks:', req.session.tasks);

    // Return the newly added task
    res.status(201).json(newTask);
});

app.put('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    console.log('Received index for update request:', index);
    console.log('Tasks in session before update:', req.session.tasks);

    if (index < 0 || index >= req.session.tasks.length || isNaN(index)) {
        return res.status(404).send('Task not found');
    }

    const task = req.session.tasks[index];
    task.name = req.body.name;
    task.status = req.body.status;
    req.session.tasks[index] = task;

    console.log('Tasks in session after update:', req.session.tasks);
    res.status(201).json({ message: 'Task updated successfully' });
});

app.delete('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    console.log('Received index for delete request:', index);
    console.log('Tasks in session before delete:', req.session.tasks);

    if (index < 0 || index >= req.session.tasks.length || isNaN(index)) {
        return res.status(404).send('Task not found');
    }

    req.session.tasks.splice(index, 1);

    console.log('Tasks in session after delete:', req.session.tasks);
    res.status(200).json({ message: 'Task deleted successfully' });
});

app.listen(port, () => {
    console.log(`NodeJS server running at http://localhost:${port}`)
})