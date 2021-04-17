const oracledb = require('oracledb');
const config = require('../config');


exports.getAll = async (req, res) => {
    sql = `select distinct name, symbol, sector from sector JOIN mlmatoli.stock_value ON sector.symbol = stock_id`;
    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);

    res.send(results.rows);
     
}

exports.get = async (req,res) => {
    const {symbol: symbol} = req.params;
    sql = `SELECT * FROM mlia.SECTOR WHERE SYMBOL = ${symbol}`;
    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);

    res.send(results.rows);
}


