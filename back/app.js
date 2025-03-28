const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const crypto = require('crypto'); // Generates unique user IDs
require('dotenv').config();




const app = express()
const port = 3500
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://todolist.yamirat.com', 'https://todolist.yamirat.com'];

const Task = require('./models/Task')

const MONGO_URL = "mongodb://mongo:27017/todolist";

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


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
    }),
    cookie: {
        maxAge: 50 * 365 * 24 * 60 * 60 * 1000, secure: false, httpOnly: true, sameSite: 'lax'
    }
}));



app.use((req, res, next) => {
    if (!req.session.userId) {
        req.session.userId = crypto.createHash("sha256").update(req.ip + Date.now()).digest("hex");
    }
    next();
});





app.get('/tasks', async (req, res) => {
    try {
        if (!req.session.userId) return res.json([])
        const tasks = await Task.find({ userId: req.session.userId })
        res.json(tasks)
    } catch (err) {
        res.status(500).send("Error fetching task");
    }
});

app.get('/tasks/:id', async (req, res) => {
    //res.json(req.session.tasks[req.params.index])
    try {
        const task = await Task.findOne({ userId: req.params.id })

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
        const { name } = req.body;
        const newTask = await Task.create({ userId: req.session.userId, name: name });
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: "Error adding task" })
    }

});

app.put('/tasks/:id', async (req, res) => {
    try {
        const userId = req.session.userId;

        const updatedTask = await Task.findOneAndUpdate({ _id: req.params.id, userId }, req.body, { new: true });

        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }

        res.status(201).json({ message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).send("Error updating task");
    }

});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const userId = req.session.userId;

        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId })

        if (!deletedTask) {
            return res.status(404).send('Task not found');
        }


        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).send("Error deleting task");
    }

});

app.listen(port, '0.0.0.0', () => {
    console.log(`NodeJS server running at http://localhost:${port}`)
})


module.exports = app;