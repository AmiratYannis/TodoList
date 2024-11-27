<template>
  <v-card>
    <v-card-title>To-Do List</v-card-title>
    <v-card-item>
      <v-form @submit.prevent="addTask">
        <v-row>
          <v-col cols="10">
            <v-text-field
               v-model="newTask"  
              label="Enter a task"
              outlined
              required

            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn color="primary" block type="submit">Add Task</v-btn>
          </v-col>
        </v-row>
    </v-form>
  </v-card-item>
  </v-card>
  
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newTask: '',
    };
  },
  methods: {
    async addTask() {
      if (this.newTask.trim() === '') return;
        console.log(this.newTask)

      await axios.post('http://localhost:3500/tasks', {
          name: this.newTask, // Send task name in the request body
        }, {  withCredentials: true })
        .then((response) => {
          if (response.status === 201) {
            const addedTask = response.data; // Get the new task from the response
            console.log('Task added successfully:', addedTask);
            this.$emit('task-added', addedTask); // Emit the new task to the parent
            this.newTask = ''; // Clear the input field
          } else {
            console.error('Failed to add task:', response.status);
          }
        })
        .catch((error) => {
          console.error('Error adding task:', error);
        });
    },
  },
};
</script>