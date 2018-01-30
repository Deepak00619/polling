// Setup Environment
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const poll = require('./routes/poll');

// DB Config
require('./config/db');

// Set public folder
app.use(express.static(`${__dirname}/public`));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

// Set Route
app.use('/poll', poll);

// Start Server
app.listen(port, () => `Server started on port ${port}`);
