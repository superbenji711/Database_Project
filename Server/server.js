const bodyParser = require("body-parser"); //once a request is recived you can manipulate it
const cors = require('cors');  //send api calls through diffrent ports
const express = require('express');
const app = express();
const config = require("./config.js");
const database = require("./Database.js");
// const router = express.Router();


const sectorRoutes = require("./Routes/sectorRoute");
const cpiRoutes = require("./Routes/cpiRoutes");
const moneyStockRoutes = require("./Routes/moneyStockRoute");

//enable cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001"); // update to match the domain you will make the request from
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//
// require('dotenv').config()
// app.use(bodyParser.urlencoded({
//   extended: true
// }));

// app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())

app.use(cors()); // Allow API calls to be made from any origin


//Routing
app.use('/sector', sectorRoutes);
app.use('/api/CPI', cpiRoutes);
app.use('/api/Stock', moneyStockRoutes);

//server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server now running on port ${port}!)`));

