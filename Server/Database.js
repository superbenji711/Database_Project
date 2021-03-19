const oracledb = require('oracledb');
const config = require('./config');

const database = async () => {
    const connection = await oracledb.getConnection(config);
    
}
