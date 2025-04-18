const fs = require('fs').promises;
const path = require('path');

class FileOperationError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'FileOperationError';
    this.code = code;
  }
}

const ensureDataDirectory = async (filepath) => {
  const dir = path.dirname(filepath);
  try {
    await fs.access(dir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dir, { recursive: true });
    } else {
      throw error;
    }
  }
};

const readJsonFile = async (filepath) => {
  try {
    await ensureDataDirectory(filepath);
    const data = await fs.readFile(filepath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new FileOperationError(`File not found: ${filepath}`, 'FILE_NOT_FOUND');
    }
    throw new FileOperationError(
      `Error reading file ${filepath}: ${error.message}`,
      'READ_ERROR'
    );
  }
};

const writeJsonFile = async (filepath, data) => {
  try {
    await ensureDataDirectory(filepath);
    await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new FileOperationError(
      `Error writing file ${filepath}: ${error.message}`,
      'WRITE_ERROR'
    );
  }
};

module.exports = {
  readJsonFile,
  writeJsonFile,
  FileOperationError,
  ensureDataDirectory
}; 