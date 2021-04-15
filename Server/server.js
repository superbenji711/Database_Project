const oracledb = require('oracledb');
const bodyParser = require("body-parser"); //once a request is recived you can manipulate it
const cors = require('cors');  //send api calls through diffrent ports
const express = require('express');
const path = require('path');
const sectorRoutes = require("./Routes/sectorRoute");
const port = 5000;
const app = express();
process.env.ORA_SDTZ = 'UTC'
const config = require('./config');

oracledb.initOracleClient({ libDir: 'C:/Users/vandy/instantclient' });

  const database = async () => {

    try {
  
      let sql, binds, options, result;
  
      connection = await oracledb.getConnection(config);
    
  
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        console.log( 'Database Connected' )
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  
  database();
  require('dotenv').config()
  app.use(cors()); // Allow API calls to be made from any origin
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  //Routing
  app.use('/sector', sectorRoutes);

  
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'build')))
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  })

  

app.listen(port, () => console.log(`Server now running on port ${port}!`));

