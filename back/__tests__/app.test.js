const request = require('supertest');
const app = require('../app');

// Mock session middleware
const session = require('express-session');
const FileStore = require('session-file-store')(session);

app.use(
    session({
        store: new FileStore({
            path: '../sessions',
            retries: 5,
        }),
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 3600000 },
    })
);

describe('Task Routes', () => {
    let agent; // Agent to simulate a single session

    beforeEach(() => {
        agent = request.agent(app); // Initialize the agent for each test
    });

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


    });

    test('PUT /tasks/:index should update an existing task', async () => {
        // Add a task 
        const newTask = { name: 'Task to Update' };
        await agent.post('/tasks').send(newTask);

        // Update the task
        const updatedTask = { name: 'Task to Update', status: 'finished' };
        const res = await agent.put('/tasks/0').send(updatedTask);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ message: 'Task updated successfully' });
    });

    test('DELETE /tasks/:index should delete an existing task', async () => {
        // Add a task
        const newTask = { name: 'Task to Delete' };
        await agent.post('/tasks').send(newTask);

        // Delete the task
        const res = await agent.delete('/tasks/0');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Task deleted successfully' });
    });

});