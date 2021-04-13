const oracledb = require('oracledb');
const config = require('./config');
const bodyParser = require("body-parser"); //once a request is recived you can manipulate it
const cors = require('cors');  //send api calls through diffrent ports
const express = require('express');
const app = express();
const router = express.Router();
const sectorRoutes = require("./Routes/sectorRoute");
process.env.ORA_SDTZ = 'UTC';

// try {
//   oracledb.initOracleClient({libDir: 'C:/Users/Benji/instantclient_19_10'});
// } catch (err) {
//   console.error('Whoops!');
//   console.error(err);
//   process.exit(1);
// }


// connection =  oracledb.getConnection(config);
module.exports.init = () => {
  oracledb.initOracleClient({ libDir: 'C:/Users/vandy/instantclient' });

  const database = async () => {

    try {
  
      let sql, binds, options, result;
  
      connection = await oracledb.getConnection(config);
  
    
  

      //  sql = `SELECT * FROM no_example`;
  
      //  binds = {};
  
      //  // For a complete list of options see the documentation.
      //  options = {
      //    outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
      //    extendedMetaData: true,               // get extra metadata
      //    prefetchRows:     100,                // internal buffer allocation size for tuning
      //    fetchArraySize:   100                 // internal buffer allocation size for tuning
      //  };
  
      //  result = await connection.execute("SELECT * FROM mlia.SECTOR");
  

      //  console.log("Metadata: ");
      //  console.dir(result.metaData, { depth: null });
      //  console.log("Query results: ");
      //  console.dir(result.rows, { depth: null });
  
  
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

  return app;
}