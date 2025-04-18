const taskService = require('../services/taskService');

class TaskController {
  async getAllTasks(req, res) {
    try {
      const tasks = await taskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      console.error('Error getting tasks:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  }

  async getTaskById(req, res) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      res.json(task);
    } catch (error) {
      if (error.message === 'Task not found') {
        res.status(404).json({ error: error.message });
      } else {
        console.error('Error getting task:', error);
        res.status(500).json({ 
          error: 'Internal server error',
          details: error.message 
        });
      }
    }
  }

  async createTask(req, res) {
    try {
      const { title, description, assignedTo } = req.body;
      
      // Validate required fields
      if (!title || !description || !assignedTo) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          details: 'title, description and assignedTo are required' 
        });
      }

      const result = await taskService.createTask(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating task:', error);
      
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  }

  async updateTask(req, res) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error) {
      if (error.message === 'Task not found') {
        res.status(404).json({ error: error.message });
      } else {
        console.error('Error updating task:', error);
        res.status(500).json({ 
          error: 'Internal server error',
          details: error.message 
        });
      }
    }
  }
}

module.exports = new TaskController(); 