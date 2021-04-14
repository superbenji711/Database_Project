const oracledb = require('oracledb');
const config = require('./config');

process.env.ORA_SDTZ = 'UTC';


module.exports.init = () => {
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
}