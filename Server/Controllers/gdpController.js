const oracledb = require('oracledb');
const config = require('../config');


exports.getGDPCorrelation = async (req, res) => {
    let id = req.params.id
    console.log(id)
    

    sql=`SELECT CORR(quarterly."average stock price",  mlia.real_gdp.value) as R
    FROM MLIA.real_gdp,
        (
        SELECT EXTRACT( YEAR from stock_date) as year, 1 as Q, AVG(close_val) as "average stock price"
        FROM mlmatoli.stock_value
        WHERE mlmatoli.stock_value.stock_id = '${id}' AND EXTRACT(MONTH from stock_date) BETWEEN 1 AND 3
        GROUP BY EXTRACT( YEAR from stock_date)
        UNION 
        
        SELECT EXTRACT( YEAR from stock_date) as year, 2 as Q, AVG(close_val) as "average stock price"
        FROM mlmatoli.stock_value
        WHERE mlmatoli.stock_value.stock_id = '${id}' AND EXTRACT(MONTH from stock_date) BETWEEN 4 AND 6
        GROUP BY EXTRACT( YEAR from stock_date)
        UNION
        
        SELECT EXTRACT( YEAR from stock_date) as year, 3 as Q, AVG(close_val) as "average stock price"
        FROM mlmatoli.stock_value
        WHERE mlmatoli.stock_value.stock_id = '${id}' AND EXTRACT(MONTH from stock_date) BETWEEN 7 AND 9
        GROUP BY EXTRACT( YEAR from stock_date)
        UNION 
        
        SELECT EXTRACT( YEAR from stock_date) as year, 4 as Q, AVG(close_val) as "average stock price"
        FROM mlmatoli.stock_value
        WHERE mlmatoli.stock_value.stock_id = '${id}' AND EXTRACT(MONTH from stock_date) BETWEEN 10 AND 12
        GROUP BY EXTRACT( YEAR from stock_date)) quarterly
    WHERE EXTRACT(YEAR from mlia.real_gdp.value_date) >= quarterly.year`;
    bind={}
    connection = await oracledb.getConnection(config);
    results = await connection.execute(sql);

    res.send(results.rows);
}

exports.getGDPStockData = async (req, res) => {
    let id = req.params.id
    sql = `SELECT year, month ,"average stock price", mlia.real_gdp.value as GDP
    FROM MLIA.real_gdp,
        (
        SELECT EXTRACT( YEAR from stock_date) as year, 1 as month, AVG(close_val) as "average stock price"
        FROM mlmatoli.stock_value
        WHERE mlmatoli.stock_value.stock_id = '${id}' AND EXTRACT(MONTH from stock_date) BETWEEN 1 AND 3
        GROUP BY EXTRACT( YEAR from stock_date)
        UNION 
        
        SELECT EXTRACT( YEAR from stock_date) as year, 4 as month , AVG(close_val) as "average stock price"
        FROM mlmatoli.stock_value
        WHERE mlmatoli.stock_value.stock_id = '${id}' AND EXTRACT(MONTH from stock_date) BETWEEN 4 AND 6
        GROUP BY EXTRACT( YEAR from stock_date)
        UNION
        
        SELECT EXTRACT( YEAR from stock_date) as year, 7 as month , AVG(close_val) as "average stock price"
        FROM mlmatoli.stock_value
        WHERE mlmatoli.stock_value.stock_id = '${id}' AND EXTRACT(MONTH from stock_date) BETWEEN 7 AND 9
        GROUP BY EXTRACT( YEAR from stock_date)
        UNION 
        
        SELECT EXTRACT( YEAR from stock_date) as year, 10 as month , AVG(close_val) as "average stock price"
        FROM mlmatoli.stock_value
        WHERE mlmatoli.stock_value.stock_id = '${id}' AND EXTRACT(MONTH from stock_date) BETWEEN 10 AND 12
        GROUP BY EXTRACT( YEAR from stock_date)) quarterly
    WHERE EXTRACT(YEAR from mlia.real_gdp.value_date) = quarterly.year AND EXTRACT(MONTH from mlia.real_gdp.value_date)= quarterly.month 
    ORDER BY year, month  ASC`;
    bind = {}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);

    res.send(results.rows);
}

exports.getCount = async (req, res) => {
    sql= "SELECT COUNT(*) FROM mlmatoli.STOCK_VALUE";
    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);

    res.send(results.rows);
}

exports.getAll = async (req, res) => {
    sql = "SELECT * FROM mlia.Real_GDP";
    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);

    res.send(results.rows);
}

