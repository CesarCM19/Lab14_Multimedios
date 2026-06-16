require('dotenv').config();
const express = require('express');
const path = require('path');
const routes = require('./routes');

// Initialize database (triggers seeding if empty)
require('./db');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static images under /imagenes/*
const imagesDir = path.join(__dirname, 'imagenes');
app.use('/imagenes', express.static(imagesDir));

// Register all API routes
app.use('/', routes);

// Global Error Handler for unhandled errors
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  return res.status(500).json({ error: 'Ocurrio un error inesperado en el servidor.' });
});

// Configure host and port from environment variables
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`=========================================`);
  console.log(`  DiscoStore API is running!`);
  console.log(`  URL: http://${HOST}:${PORT}`);
  console.log(`  Static Images: http://${HOST}:${PORT}/imagenes/`);
  console.log(`=========================================`);
});
