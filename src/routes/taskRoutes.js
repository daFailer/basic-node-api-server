const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET all tasks
router.get('/', taskController.getAllTasks);

// GET specific task
router.get('/:id', taskController.getTaskById);

// POST new task
router.post('/', taskController.createTask);

// PUT update task
router.put('/:id', taskController.updateTask);

module.exports = router; 