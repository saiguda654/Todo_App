import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Fetch tasks from the backend
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data.tasks))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  // Add a new task
  const addTask = () => {
    if (!newTask.trim()) return;

    fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTask }),
    })
      .then(response => response.json())
      .then(() => {
        setNewTask('');
        fetch('http://localhost:5000/api/tasks')
          .then(response => response.json())
          .then(data => setTasks(data.tasks))
          .catch(error => console.error('Error fetching tasks:', error));
      })
      .catch(error => console.error('Error adding task:', error));
  };

  // Mark a task as completed
  const markAsCompleted = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
    })
      .then(response => response.json())
      .then(() => {
        fetch('http://localhost:5000/api/tasks')
          .then(response => response.json())
          .then(data => setTasks(data.tasks))
          .catch(error => console.error('Error fetching tasks:', error));
      })
      .catch(error => console.error('Error updating task:', error));
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.text}
            </span>
            {!task.completed && (
              <button onClick={() => markAsCompleted(task._id)}>Mark as Completed</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
