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

      await axios.post('http://localhost:3500/tasks', {
          name: this.newTask, 
        }, {  withCredentials: true })
        .then((response) => {
          if (response.status === 201) {
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



<style scoped>
/*.add-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.task-input {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.add-task-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 200px;
}

.add-task-button:hover {
  background-color: #0056b3;
}

.add-task-button:active {
  background-color: #003d80;
}

/* Media Queries */
/* Responsive styles */
/*@media (max-width: 768px) {
  .add-list {
    flex-direction: column; /* Stack input and button vertically */
  /*  gap: 0.5rem;
  }

  .task-input {
    font-size: 0.9rem;
    max-width: 100%;
  }

  .add-task-button {
    width: 100%; /* Button takes full width */
  /*  font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
}*/
</style>