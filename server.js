const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://adihanky:umaru1703@cluster1.ifmxu4w.mongodb.net/?retryWrites=true&w=majority";

// Enable cross-origin resource sharing (CORS)
app.use(cors());
// Enable parsing of JSON request bodies
app.use(express.json());

// Define a Mongoose schema for a Todo item
const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
});
const Todo = mongoose.model('Todo', todoSchema);

// Connect to the MongoDB database
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define API routes
app.get('/api/todo', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/api/todo', async (req, res) => {
  try {
    const todo = new Todo({
      task: req.body.task,
      completed: false,
    });
    const savedTodo = await todo.save();
    res.json(savedTodo);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.put('/api/todo/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    const savedTodo = await todo.save();
    res.json(savedTodo);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete('/api/todo/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
