const oracledb = require('oracledb');
const config = require('../config');

exports.getAll = async (req, res) => {
    sql = `SELECT * FROM mlia.money_stock`;
    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);

    res.send(results.rows);
     
}

exports.getPercentChanges = async(req, res) => {
    sql = 
    `
    SELECT trunc(value_date), (((M2- prevM2)/prevM2)*100) AS percentChange
    FROM mlia.money_stock JOIN
    (
        SELECT to_char(value_date,'WW') week, to_char(value_date,'YYYY') year, M2 AS prevM2
        FROM mlia.money_stock
    )
    ON (to_number(to_char(value_date,'WW'))-1) = to_number(week) AND to_number(to_char(value_date,'YYYY')) = to_number(year)
    ORDER BY value_date
    `
    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);

    res.send(results.rows);
}

exports.getCorrelation = async (req, res) => {
    const {symbol: symbol} = req.params;
    sql = 
    `SELECT year, correlation
    FROM (
        SELECT stock_id, year, CORR(percentChange, weeklyMean) AS correlation
        FROM ( 
            SELECT stock_id, year, percentChange, weeklyMean
            FROM (
                ( 
                    SELECT to_char(value_date,'WW') week, to_char(value_date,'YYYY') year, (((M2- prevM2)/prevM2)*100) AS percentChange
                    FROM mlia.money_stock JOIN
                    (
                        SELECT to_char(value_date,'WW') week, to_char(value_date,'YYYY') year, M2 AS prevM2
                        FROM mlia.money_stock
                    )
                    ON (to_number(to_char(value_date,'WW'))-1) = to_number(week) AND to_number(to_char(value_date,'YYYY')) = to_number(year)
                )
                JOIN 
                (
                    SELECT stock_id, week as stockWeek, year as stockYear, weeklyMean
                        FROM ( 
                            SELECT stock_id, to_char(stock_date,'WW') week, to_char(stock_date,'YYYY') year, AVG(close_val) weeklyMean 
                            FROM MLMATOLI.stock_value 
                            WHERE stock_id = '${symbol}'
                            GROUP BY stock_id, to_char(stock_date,'WW'),to_char(stock_date,'YYYY')
                            ORDER BY to_char(stock_date,'YYYY')
                        )
                )
                ON week = stockWeek AND year = stockYear
            )
        )
        GROUP BY stock_id, year
    )
    WHERE correlation IS NOT NULL
    ORDER BY year 
    `
    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);

    res.send(results.rows);
}

