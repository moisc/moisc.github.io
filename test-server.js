// Minimal test server for Railway debugging
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

console.log('Starting test server...');
console.log('Port:', port);
console.log('Environment:', process.env.NODE_ENV);

app.get('/', (req, res) => {
  res.json({ message: 'Test server is working!' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Test server is running',
    port: port,
    env: process.env.NODE_ENV
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Test server running at http://0.0.0.0:${port}`);
});

module.exports = app;