<template>
  <div>
    <AddList @task-added="addTaskToList" />
    <TaskList :tasks="tasks" />
  </div>
</template>

<script>

import AddList from './components/AddList.vue';
import TaskList from './components/TaskList.vue';
import axios from 'axios';


export default {
  data() {
    return {
      tasks: [], // Holds the list of tasks
    };
  },
  components: {
    AddList,
    TaskList
  },
  methods: {
    fetchTasks() {
      axios
        .get('http://localhost:3500/tasks', { withCredentials: true })
        .then((response) => {
          this.tasks = response.data; // Update tasks with the fetched data
          console.log('Fetched tasks:', this.tasks);
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
        });
    },
    addTaskToList(newTask) {
      this.tasks.push(newTask); // Add the new task to the local array
    },
  },
  mounted() {
    this.fetchTasks(); // Fetch tasks when the component is mounted
  },
};
</script>
