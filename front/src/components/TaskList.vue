<template>
    <v-list>
        <v-subheader class="ml-4">Tasks</v-subheader>
        <v-list-item v-for="(task, index) in tasks" :key="index">

            <v-list-item-content>
                <v-list-item-title :class="statusClass(task.status)">
                {{ task.name }} - {{ task.status }}
                </v-list-item-title>
            </v-list-item-content>
            <v-list-item-actions>
                <v-btn
                v-if="task.status === 'todo'"
                @click="updateTask(task._id, 'in-progress')"
                color="warning"
                small
                >
                In Progress
                </v-btn>
                <v-btn
                v-if="task.status === 'in-progress'"
                @click="updateTask(task._id, 'finished')"
                color="success"
                small
                >
                Finish
                </v-btn>
                <v-btn 
                    v-if="task.status==='in-progress' || task.status==='finished'"
                    color="blue-grey-lighten-2"
                    small
                    @click="updateTask(task._id, 'todo')"
                >
                To-Do
                </v-btn>
                <v-btn color="failure" small @click="deleteTask(task._id)">
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
      await axios.get('https://todolist.yamirat.com/api/tasks', {withCredentials: true})
        .then((res)=>{
              this.tasks = [...res.data];
        })
        .catch((err)=>{
          console.error('Error fetching tasks:', err);

        })

    },

    async updateTask(taskId, status) {
         
      const task= this.tasks.find(task=>task._id===taskId)
     

      const newTask = {
        _id:taskId,
        name: task.name,
        status: status,
        userId: task.userId
      }
 


      await axios.put(`https://todolist.yamirat.com/api/tasks/${taskId}`,newTask, {withCredentials: true})
        .then((res)=>{
            const taskIndex = this.tasks.findIndex(task => task._id === taskId);

            if (taskIndex !== -1) {
              this.tasks[taskIndex] = newTask;
            }
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

    async deleteTask(taskId) {
        await axios.delete(`https://todolist.yamirat.com/api/tasks/${taskId}`, {withCredentials: true})
          .then((res) => {
              const taskIndex = this.tasks.findIndex(task => task._id === taskId);
              this.tasks.splice(taskIndex, 1);
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
