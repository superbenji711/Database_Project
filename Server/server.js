const bodyParser = require("body-parser"); //once a request is recived you can manipulate it
const cors = require('cors');  //send api calls through diffrent ports
const express = require('express');
const app = express();
const database = require("./Database.js");


const sectorRoutes = require("./Routes/sectorRoute");
const cpiRoutes = require("./Routes/cpiRoutes");
const moneyStockRoutes = require("./Routes/moneyStockRoute");
const gdpRoute = require('./Routes/gdpRoute');
const indexRoute = require('./Routes/indexRoute');
const weiRoute = require('./Routes/weiRoute');

database.init();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())

app.use(cors()); // Allow API calls to be made from any origin

//Routing
app.use('/api/sector', sectorRoutes);
app.use('/api/CPI', cpiRoutes);
app.use('/api/Stock', moneyStockRoutes);
app.use('/api/GDP',gdpRoute);
app.use('/api/Index',indexRoute)
app.use('/api/WEI',weiRoute)


//server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server now running on port ${port}!)`));

