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
export default {
  data() {
    return {
      newTask: '',
    };
  },
  methods: {
    async addTask() {
      if (this.newTask.trim() === '') return;
      await fetch('http://localhost:3500/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: this.newTask }),
      });
      this.newTask = '';
      this.$emit('task-added');
    },
  },
};
</script>