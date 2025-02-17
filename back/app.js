const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const crypto = require('crypto'); // Generates unique user IDs



const app = express()
const port = 3500
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://todolist.yamirat.com', 'https://todolist.yamirat.com'];

const Task = require('./models/Task')

const MONGO_URL = 'mongodb://localhost:27017/todolistDB';

mongoose.connect(MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Unable to connect to MongoDB'))


app.use(bodyParser.json())

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']

}))

/*app.use(
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
);*/

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
    }),
    cookie: {
        maxAge: 3600000, secure: false, httpOnly: true, sameSite: 'lax'
    }
}));



app.use((req, res, next) => {
    if (!req.session.userID) {
        req.session.userID = crypto.createHash("sha256").update(req.ip + Date.now()).digest("hex");
    }
    next();
});





app.get('/tasks', async (req, res) => {
    try {
        if (!req.session.userID) return res.json([]) //No session -> empty list
        const tasks = await Task.find({ userID: req.session.userID })
        res.json(tasks)
    } catch (err) {
        res.status(500).send("Error fetching task");
    }
});

app.get('/tasks/:userId', async (req, res) => {
    //res.json(req.session.tasks[req.params.index])
    try {
        const task = await Task.findOne({ userId: req.params.userId })

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(task)
    } catch (err) {
        res.status(500).json({ error: "Error retrieving task" });
    }
})

app.post('/tasks', async (req, res) => {
    try {
        console.log(req.session.userID)
        const { name } = req.body;
        const newTask = await Task.create({ userID: req.session.userID, name: name });

        //req.session.tasks.push(newTask);

        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: "Error adding task" })
    }

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

app.delete('/tasks/:id', (req, res) => {
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