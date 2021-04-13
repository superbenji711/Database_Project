const express = require('./express.js')
const path = require('path');

const port = 5000;

const app = express.init()


app.listen(port, () => console.log(`Server now running on port ${port}!`));

