# Demo

You can consult my todo-list app in this link: https://todolist.yamirat.com/ 

# todo-list

A todolist application that helps you track your daily tasks efficiently.
A task can be "To-do", "In progress" or "Finished".
Each user be able to create his own list of tasks. 
I developped this application in Vue JS and deployed with AWS EC2. 


### Development setup

## Docker

To run container for front-end and back-end by using Docker, you should first [install Docker](https://docs.docker.com/get-docker/). 

Once Docker is installed, you can run all the container at the same time by using this following command at the root of the projet: 

```
docker-compose up --build
```



## Node.-js

Todolist is developped with Node.js and Vue.js and runs with Node.js. [Install Node.js](https://nodejs.org/en/) on your environment.

Once Node.js is installed, install npm dependencies for backend (folder back) and frontend (folder front).


```
npm install
```

### Test

To test API Rest of back-end developped in NodeJS, you have to run this following command in folder back to check if all tests of API Rest passed. 
I used Jest and Supertest to test API REST to check if the request GET, POST, PUT and DELETE work correctly.

```
npm test
```

### Compiles and minifies for production

To build project for production, you have to use the following command: 

```
npm run build
```



