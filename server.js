const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');  // For generating unique IDs

const app = express();
const port = 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());

// File paths
const tasksFile = path.join(__dirname, 'api/data/tasks.json');
const taskDetailsFile = path.join(__dirname, 'api/data/taskDetails.json');

// Helper functions
const readJsonFile = (filepath) => JSON.parse(fs.readFileSync(filepath));
const writeJsonFile = (filepath, data) => fs.writeFileSync(filepath, JSON.stringify(data, null, 2));

// GET all tasks
app.get('/tasks', (req, res) => {
  const tasks = readJsonFile(tasksFile);
  res.json(tasks);
});

// GET specific task
app.get('/tasks/:id', (req, res) => {
  const details = readJsonFile(taskDetailsFile);
  const task = details[req.params.id];
  task ? res.json(task) : res.status(404).json({ error: 'Task not found' });
});

// POST new task
app.post('/tasks', (req, res) => {
  const taskData = req.body;
  
  // Generate new ID and timestamp
  const newTaskId = uuidv4();
  const createdTimestamp = new Date().toISOString();

  // Write task details
  const details = readJsonFile(taskDetailsFile);
  details[newTaskId] = {
    ...taskData,
    created: createdTimestamp
  };
  writeJsonFile(taskDetailsFile, details);

  // Add task to tasks.json
  const tasks = readJsonFile(tasksFile);
  tasks.push({
    id: newTaskId,
    status: "open"
  });
  writeJsonFile(tasksFile, tasks);

  // Return response
  res.status(201).json({
    id: newTaskId
  });
});

// PUT update existing task
app.put('/tasks/:id', (req, res) => {
  const taskUpdates = req.body;
  const details = readJsonFile(taskDetailsFile);

  if (!details[req.params.id]) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Update current entry, timestamp remains unchanged
  details[req.params.id] = {
    ...details[req.params.id],
    ...taskUpdates
  };

  writeJsonFile(taskDetailsFile, details);
  res.json(details[req.params.id]);
});

// Start server
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
