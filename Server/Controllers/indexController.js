const oracledb = require('oracledb');
const config = require('../config');



exports.getAll = async (req, res) => {
    sql = "SELECT * FROM mlia.SP500_Index";
    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);

    res.send(results.rows);
}

