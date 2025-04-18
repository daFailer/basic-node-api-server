const fs = require('fs');
const path = require('path');

const filesToReset = ['tasks.json', 'taskDetails.json'];

filesToReset.forEach(file => {
  const backupPath = path.join(__dirname, 'api', 'backup', file);
  const targetPath = path.join(__dirname, 'api', 'data', file);

  fs.copyFileSync(backupPath, targetPath);
});

console.log('Data has been successfully reset.');
