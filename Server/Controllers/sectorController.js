const { response } = require('express');
const oracledb = require('oracledb');
const config = require('../config');





exports.getAll = async (req, res) => {
    sql = "SELECT * FROM mlia.SECTOR";
    bind={}
    connection = await oracledb.getConnection(config);
    
    // results = await connection.query(sql, (error, result, fields)=>{

    //     if(error){throw error}

    //     res.send(result);
    // });
    const result = connection.execute(
        sql,
        [],  
       function(err, result) {
          if (err) {
            console.error(err.message);
            return;
          }
          console.log(result.rows);
       });
  
    res.send(result);
    // console.log("Metadata: ");
    //  console.dir(result.metaData, { depth: null });
    //  console.log("Query results: ");
    //  console.dir(result.rows, { depth: null });
        
     
}

exports.get = async (id) => {

}


