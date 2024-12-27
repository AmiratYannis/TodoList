<template>
    <v-list>
        <v-subheader>Tasks</v-subheader>
        <v-list-item v-for="(task, index) in tasks" :key="index">

            <v-list-item-content>
                <v-list-item-title :class="statusClass(task.status)">
                {{ task.name }} - {{ task.status }}
                </v-list-item-title>
            </v-list-item-content>
            <v-list-item-actions>
                <v-btn
                v-if="task.status === 'todo'"
                @click="updateTask(index, 'in-progress')"
                color="warning"
                small
                >
                In Progress
                </v-btn>
                <v-btn
                v-if="task.status === 'in-progress'"
                @click="updateTask(index, 'finished')"
                color="success"
                small
                >
                Finish
                </v-btn>
                <v-btn 
                    v-if="task.status==='in-progress' || task.status==='finished'"
                    color="blue-grey-lighten-2"
                    small
                    @click="updateTask(index, 'todo')"
                >
                To-Do
                </v-btn>
                <v-btn color="failure" small @click="deleteTask(index)">
                    Delete
                </v-btn>
            </v-list-item-actions>
    </v-list-item>


        
    </v-list>
</template>
<script>
import axios from 'axios'

export default {
   props: {
    tasks: {
      type: Array,
      required: true, // Ensure tasks are passed as a prop
    },
  },
  methods: {
    async fetchTasks() {
      await axios.get('http://localhost:3500/tasks', {withCredentials: true})
        .then((res)=>{
                this.tasks = res.data;
        })
        .catch((err)=>{
          console.error('Error fetching tasks:', err);

        })

    },

    async updateTask(index, status) {
      const newTask = {
        name: this.tasks[index].name,
        status: status
      }

      await axios.put(`http://localhost:3500/tasks/${index}`,newTask, {withCredentials: true})
        .then((res)=>{
              this.tasks[index] = { ...this.tasks[index], ...newTask };
              this.$emit('task-updated');
        })
        .catch((err)=>{
            console.error('Error updating task:', err);
        })

      
    },
    statusClass(status) {
      return {
        'text-primary': status === 'todo',
        'text-warning': status === 'in-progress',
        'text-success': status === 'finished',
      };
    },

    async deleteTask(index) {
        await axios.delete(`http://localhost:3500/tasks/${index}`, {withCredentials: true})
          .then((res) => {
              this.tasks.splice(index, 1);
          })
          .catch((err)=>{
            console.error('Error deleting task:', err);
          })
        

    }
  },
  mounted(){
    this.fetchTasks()
  },
};
</script>
