const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://mongodb:27017/todolist', {  // Use Docker service name
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(cors());
app.use(express.json());

// Define task schema and model
const taskSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Add a new task
app.post('/api/tasks', async (req, res) => {
  const { text } = req.body;
  try {
    const newTask = new Task({ text });
    await newTask.save();
    res.json({ message: 'Task added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding task' });
  }
});

// Mark a task as completed
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true }
    );
    res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
