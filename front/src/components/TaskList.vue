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
      required: true,
    },
  },
  methods: {
    async fetchTasks() {
      const response = await axios.get('http://localhost:3500/tasks');
      this.tasks = response.data;
    },

    async updateTask(index, status) {
      /*await fetch(`http://localhost:3500/tasks/${index}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });*/
      const newTask = {
        name: this.tasks[index].name,
        status: status
      }

      await axios.put(`http://localhost:3500/tasks/${index}`,newTask)
        .then((res)=>{
              console.log(res.data)
              this.tasks[index] = { ...this.tasks[index], ...newTask };
              this.$emit('task-updated');
        })
        .catch((err)=>{
            console.error(err.message)
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
        await axios.delete(`http://localhost:3500/tasks/${index}`);
        this.tasks.splice(index, 1);

    }
  },
  mounted(){
    console.log("tasks: ",this.tasks)
  },
};
</script>
