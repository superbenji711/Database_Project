const oracledb = require('oracledb');
const config = require('./config');

process.env.ORA_SDTZ = 'UTC';

try {
  oracledb.initOracleClient({libDir: 'C:/Users/Benji/instantclient_19_10'});
} catch (err) {
  console.error('Whoops!');
  console.error(err);
  process.exit(1);
}

let connection;
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
