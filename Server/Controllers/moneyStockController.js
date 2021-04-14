const oracledb = require('oracledb');
const config = require('../config');



exports.getAll = async (req, res) => {
    sql = "SELECT * FROM mlia.MONEY_STOCK";
    bind={}
    connection = await oracledb.getConnection(config);
    result = await connection.execute(sql);
    
    console.log("Metadata: ");
    console.dir(result.metaData, { depth: null });
    console.log("Query results: ");
    console.dir(result.rows, { depth: null });
}

