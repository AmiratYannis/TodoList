<template>
  <v-app>
    <v-main>
      <v-container>
          <AddList @task-added="fetchTasks"/>
          <TaskList :tasks="tasks"/>

      </v-container>
      
    </v-main>
  </v-app>
</template>

<script>
import AddList from './components/AddList.vue';
import TaskList from './components/TaskList.vue';


export default {
  name: 'App',

  components: {
    AddList,
    TaskList
  },

  data: () => ({
    
      tasks: [],
    
  }),
  methods: {
    async fetchTasks() {
      const response = await fetch('http://localhost:3500/tasks');
      this.tasks = await response.json();
    },
  },
  mounted()  {
    this.fetchTasks();
  }
}
</script>
