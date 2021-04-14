const { response } = require('express');
const oracledb = require('oracledb');
const config = require('../config');





exports.getAll = async (req, res) => {
    sql = "SELECT * FROM mlia.SECTOR";
    bind={}
    connection = await oracledb.getConnection(config);
    
<<<<<<< HEAD
    results = await connection.execute(sql);
=======
    console.log("Metadata: ");
     console.dir(result.metaData, { depth: null });
     console.log("Query results: ");
     console.dir(result.rows, { depth: null });
     res.send(result.rows)
}

exports.get = async (id) => {
>>>>>>> d8a063920331cd9a3ad81fd693061b9258b835af

    res.send(results.rows);
     
}


