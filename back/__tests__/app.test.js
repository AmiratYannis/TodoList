const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Task = require('../models/Task')

const TEST_DB_URI = 'mongodb://localhost:27017/todolistDB-test'; // Test database


app.get('/set-session', (req, res) => {
    req.session.userId = req.body.userId;
    res.json({ message: "Session set", userId: req.session.userId });
});



describe('Task Routes with MongoDB', () => {
    let agent; // Agent to simulate a single session
    let userId;


    beforeAll(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }

        await mongoose.connect(TEST_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        agent = request.agent(app);


        userId = new mongoose.Types.ObjectId().toString();
        await agent.get('/set-session').send({ userId });

    });

    afterEach(async () => {
        await Task.deleteMany({ userId });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    })

    test('GET /tasks should return an empty list when no tasks exist', async () => {
        const res = await agent.get('/tasks')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('POST /tasks should add a new task', async () => {
        const newTask = { name: 'New Task' };
        const res = await agent.post('/tasks').send(newTask)
        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject({ name: 'New Task', status: 'todo' });

        const taskInDb = await Task.findOne({ name: 'New Task', userId });
        expect(taskInDb).not.toBeNull();
    });

    test('PUT /tasks/:id should update an existing task', async () => {
        // Add a task 
        const newTask = await Task.create({ name: 'Task to Update', status: 'todo', userId });
        await agent.post('/tasks').send(newTask);
        let taskInDb = await Task.findOne({ name: 'Task to Update', userId });
        expect(taskInDb).not.toBeNull();

        //Update a task
        const updatedTask = { name: 'Task Updated', status: 'finished', userId };
        const res = await agent.put(`/tasks/${newTask._id}`).send(updatedTask);
        expect(res.statusCode).toBe(201);
        taskInDb = await Task.findOne({ name: 'Task Updated', status: 'finished', userId });
        expect(taskInDb).not.toBeNull();
        expect(res.body).toEqual({ message: 'Task updated successfully' });
    });

    test('DELETE /tasks/:id should delete an existing task', async () => {

        // Add a task
        const newTask = await Task.create({ name: 'Task to Delete', status: 'todo', userId });
        console.log("newTask:", newTask)
        await agent.post('/tasks').send(newTask);
        let taskInDb = await Task.findOne({ name: 'Task to Delete', userId });
        expect(taskInDb).not.toBeNull();

        // Delete the task
        const res = await agent.delete(`/tasks/${newTask._id}`);

        expect(res.statusCode).toBe(200);
        taskInDb = await Task.findOne({ name: 'Task Delete', status: 'todo', userId });
        expect(taskInDb).toBeNull();
        expect(res.body).toEqual({ message: 'Task deleted successfully' });
    });

});