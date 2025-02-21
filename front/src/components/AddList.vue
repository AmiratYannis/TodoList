<template>
  <v-card>
    <v-card-title>To-Do List</v-card-title>

    <v-card-item>
      <v-form @submit.prevent="addTask" v-if="isLargeScreen">
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

    <v-form @submit.prevent="addTask" v-else>
        <v-row>
          <v-col cols="12">
            <v-text-field
               v-model="newTask"  
              label="Enter a task"
              outlined
              required

            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn color="primary" block type="submit">Add Task</v-btn>
          </v-col>
        </v-row>
    </v-form>

  </v-card-item>


  </v-card>
  
</template>

<script>
import axios from 'axios';
import { useDisplay } from 'vuetify';

export default {

  setup() {
    const { mdAndUp } = useDisplay(); // Access Vuetify's display composable

    return {
      isLargeScreen: mdAndUp, // Alias mdAndUp for use in the template
      newTask: '',
    };
  },

  methods: {
    async addTask() {
      if (this.newTask.trim() === '') return;

      await axios.post('https://todolist.yamirat.com/api/tasks', {
          name: this.newTask, 
        }, {  withCredentials: true })
        .then((response) => {
          if (response.status === 201) {
            console.log(response)
            const addedTask = response.data; 
            this.$emit('task-added', addedTask); 
            this.newTask = ''; 
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



