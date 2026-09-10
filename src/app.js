const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Serve Swagger Interactive Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running!' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;