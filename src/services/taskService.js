const { v4: uuidv4 } = require('uuid');
const { readJsonFile, writeJsonFile, FileOperationError } = require('../utils/fileOperations');
const path = require('path');

class TaskService {
  constructor() {
    this.tasksFile = path.join(__dirname, '../../api/data/tasks.json');
    this.taskDetailsFile = path.join(__dirname, '../../api/data/taskDetails.json');
  }

  async getAllTasks() {
    try {
      return await readJsonFile(this.tasksFile);
    } catch (error) {
      if (error.code === 'FILE_NOT_FOUND') {
        return [];
      }
      throw error;
    }
  }

  async getTaskById(id) {
    try {
      const details = await readJsonFile(this.taskDetailsFile);
      const task = details[id];
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    } catch (error) {
      if (error.code === 'FILE_NOT_FOUND') {
        throw new Error('Task not found');
      }
      throw error;
    }
  }

  async createTask(taskData) {
    try {
      const newTaskId = uuidv4();
      const createdTimestamp = new Date().toISOString();

      // Initialize empty objects
      let details = {};
      let tasks = [];
      
      // Try to read existing data
      try {
        details = await readJsonFile(this.taskDetailsFile);
      } catch (error) {
        if (error.code !== 'FILE_NOT_FOUND') {
          throw error;
        }
      }

      try {
        tasks = await readJsonFile(this.tasksFile);
      } catch (error) {
        if (error.code !== 'FILE_NOT_FOUND') {
          throw error;
        }
      }

      // Add new task details
      details[newTaskId] = {
        ...taskData,
        created: createdTimestamp
      };

      // Add new task to list
      tasks.push({
        id: newTaskId,
        status: "open"
      });

      // Write updated data
      await writeJsonFile(this.taskDetailsFile, details);
      await writeJsonFile(this.tasksFile, tasks);

      return { id: newTaskId };
    } catch (error) {
      console.error('Error in createTask:', error);
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  async updateTask(id, taskUpdates) {
    try {
      const details = await readJsonFile(this.taskDetailsFile);
      
      if (!details[id]) {
        throw new Error('Task not found');
      }

      // Update task details
      details[id] = {
        ...details[id],
        ...taskUpdates
      };

      await writeJsonFile(this.taskDetailsFile, details);
      return details[id];
    } catch (error) {
      if (error.code === 'FILE_NOT_FOUND') {
        throw new Error('Task not found');
      }
      throw new Error(`Failed to update task: ${error.message}`);
    }
  }
}

module.exports = new TaskService(); 