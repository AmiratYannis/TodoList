const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const app = express()
const port = 3500
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://todolist.yamirat.com'];


app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']

}))



app.use(bodyParser.json())
app.use(
    session({
        store: new FileStore({
            path: './sessions',
            retries: 5,
        }),
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000, secure: false, httpOnly: true, sameSite: 'lax'
        },
    })
);

app.use((req, res, next) => {
    if (!req.session.tasks) {
        req.session.tasks = [];
    }
    next();
});


app.get('/tasks', (req, res) => {
    res.json(req.session.tasks);
});

app.get('/tasks/:index', (req, res) => {
    res.json(req.session.tasks[req.params.index])
})

app.post('/tasks', (req, res) => {
    const { name } = req.body;
    const newTask = { name, status: 'todo' };

    req.session.tasks.push(newTask);

    res.status(201).json(newTask);
});

app.put('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);


    if (index < 0 || index >= req.session.tasks.length || isNaN(index)) {
        return res.status(404).send('Task not found');
    }

    const task = req.session.tasks[index];
    task.name = req.body.name;
    task.status = req.body.status;
    req.session.tasks[index] = task;

    res.status(201).json({ message: 'Task updated successfully' });
});

app.delete('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);

    if (index < 0 || index >= req.session.tasks.length || isNaN(index)) {
        return res.status(404).send('Task not found');
    }

    req.session.tasks.splice(index, 1);

    res.status(200).json({ message: 'Task deleted successfully' });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`NodeJS server running at http://localhost:${port}`)
})


module.exports = app;