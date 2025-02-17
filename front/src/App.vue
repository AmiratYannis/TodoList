doc<template>
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
      tasks: [], 
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
          this.tasks = response.data; 
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
        });
    },
    addTaskToList(newTask) {
      this.tasks.push(newTask); 
    },
  },
  mounted() {
    this.fetchTasks(); 
  },
};
</script>
