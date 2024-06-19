
const fs = require('fs');
const path = require('path');
const logger = require('./logger'); // Ensure this import is correct

// Load environment variables from .env file
logger.info("Loading environment variables...")
const envPath = path.resolve(__dirname, './.env');
const envVars = fs.readFileSync(envPath, 'utf-8').split('\n');

envVars.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        process.env[key.trim()] = value.trim();
    }
});
