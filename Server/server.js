const bodyParser = require("body-parser"); //once a request is recived you can manipulate it
const cors = require('cors');  //send api calls through diffrent ports
const express = require('express');
const app = express();
const config = require("./config.js");
const database = require("./Database.js");
const router = express.Router();

const sectorRoutes = require("./Routes/sectorRoute");

require('dotenv').config()
app.use(cors()); // Allow API calls to be made from any origin
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

//Routing
app.use('/api/sector', sectorRoutes);

