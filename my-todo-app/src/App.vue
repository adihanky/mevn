<template>
  <div class="container">
    <h1 class="title">My Todo List</h1>
    <div class="columns">
      <div class="column">
        <form @submit.prevent="addTodo">
          <div class="field has-addons">
            <div class="control is-expanded">
              <input class="input" type="text" v-model="newTodo" placeholder="Enter a new task">
            </div>
            <div class="control">
              <button class="button is-info" type="submit">Add</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <ul class="box">
      <li v-for="todo in todos" :key="todo._id" class="is-flex">
        <span :class="{ completed: todo.completed }">{{ todo.task }}</span>
        <div class="buttons">
          <button class="button is-link" @click="toggleCompleted(todo)">
            {{ todo.completed ? 'Mark Incomplete' : 'Mark Complete' }}
          </button>
          <button class="button is-danger" @click="deleteTodo(todo)">Delete</button>
        </div>
      </li>
      <li v-if="todos.length === 0" class="has-text-centered">No todos yet</li>
      <li v-if="showEmptyError" class="has-text-danger">Task cannot be empty</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newTodo: '',
      todos: [],
      showEmptyError: false,
    };
  },
  created() {
    axios.get('http://localhost:3000/api/todo').then(response => {
      this.todos = response.data;
    });
  },
  methods: {
    addTodo() {
      if (!this.newTodo.trim()) {
        this.showEmptyError = true;
        return;
      }
      
      axios.post('http://localhost:3000/api/todo', {
        task: this.newTodo
      }).then(response => {
        this.todos.push(response.data);
        this.newTodo = '';
        this.showEmptyError = false;
      });
    },
    toggleCompleted(todo) {
      axios.put(`http://localhost:3000/api/todo/${todo._id}`, { completed: !todo.completed }).then(response => {
        todo.completed = response.data.completed;
      });
    },
    deleteTodo(todo) {
      axios.delete(`http://localhost:3000/api/todo/${todo._id}`).then(response => {
        const index = this.todos.findIndex(t => t._id === todo._id);
        this.todos.splice(index, 1);
        console.log(response);
      });
    }
  }
};
</script>

<style>
.title {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.box {
  margin-top: 2rem;
  padding: 1rem;
}

.completed {
  text-decoration: line-through;
}

li.is-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

li.is-flex+li.is-flex {
  margin-top: 0.5rem;
}

.has-text-centered {
  margin-top: 1rem;
  text-align: center;
}

.has-text-danger {
  color: red;
  margin-top: 0.5rem;
}
</style>
