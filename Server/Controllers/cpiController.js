const oracledb = require('oracledb');
const config = require('../config');


exports.getCorrelation = async (req, res) => {
    const {symbol: symbol} = req.params;
    sql = 
        `SELECT * FROM 
        (
            SELECT category, CORR(stock_zscore, cpi_zscore) correlation,
            ( CORR(stock_zscore, cpi_zscore) / (SQRT((1-POWER(CORR(stock_zscore, cpi_zscore),2))/(COUNT(month)-2))) ) as tvalue,
            COUNT(month) AS n
            FROM ( 
                SELECT name, symbol, sector, month, year, stock_zscore, cpi_zscore, category
                FROM (
                     ( SELECT month, year, cpi_value, cpi_zscore, category
                       FROM( 
                            WITH cpi_zscore_table AS( SELECT AVG(cpi_value) mean, STDDEV(cpi_value)std, category AS zcategory FROM mlia.cpi_values GROUP BY category)
                            SELECT month, year, cpi_value, (cpi_value-mean)/std AS cpi_zscore, category, zcategory
                            FROM (SELECT month, cpi_value,year,category FROM mlia.cpi_values), cpi_zscore_table z)
                            WHERE category = zcategory
                        ) JOIN (
                            SELECT month AS stockMonth,year AS stockYear, monthlyMean, stock_zscore
                            FROM ( 
                                WITH zscore_table AS( 
                                    SELECT AVG(monthlyMean) as mean, STDDEV(monthlyMean) as std
                                    FROM (
                                        SELECT (AVG(close_val)-prevMonthlyMean) AS monthlyMean
                                        FROM MLMATOLI.stock_value JOIN
                                        (
                                            SELECT to_char(stock_date,'MM') month, to_char(stock_date,'YYYY') year, AVG(close_val) AS prevMonthlyMean
                                            FROM mlmatoli.stock_value
                                            WHERE stock_id = '${symbol}'
                                            GROUP BY to_char(stock_date,'MM'),to_char(stock_date,'YYYY')                      
                                        )
                                        ON (to_number(to_char(stock_date,'MM'))-1) = to_number(month) AND to_number(to_char(stock_date,'YYYY')) = to_number(year)
                                        WHERE stock_id = '${symbol}'
                                        GROUP BY to_char(stock_date,'MM'),to_char(stock_date,'YYYY'), prevMonthlyMean, close_val
                                    )
                                )
                                SELECT month, year, monthlyMean,(monthlyMean-mean)/std AS stock_zscore
                                FROM ( 
                                    SELECT to_char(stock_date,'MM')month, to_char(stock_date,'YYYY')year, (AVG(close_val)-prevMonthlyMean) AS monthlyMean
                                    FROM MLMATOLI.stock_value JOIN
                                    (
                                        SELECT to_char(stock_date,'MM') month, to_char(stock_date,'YYYY') year, AVG(close_val) AS prevMonthlyMean
                                        FROM mlmatoli.stock_value
                                        WHERE stock_id = '${symbol}'
                                        GROUP BY to_char(stock_date,'MM'),to_char(stock_date,'YYYY')                            
                                    )
                                    ON (to_number(to_char(stock_date,'MM'))-1) = to_number(month) AND to_number(to_char(stock_date,'YYYY')) = to_number(year)
                                    WHERE stock_id = '${symbol}'
                                    GROUP BY to_char(stock_date,'MM'),to_char(stock_date,'YYYY'), prevMonthlyMean
                                ), zscore_table
                            )
                        ) ON month = stockMonth AND year = stockYear),( SELECT name, symbol, sector FROM mlia.sector WHERE symbol =  '${symbol}')
                        ORDER BY year 
            )
            GROUP BY category
        )
        `
    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);

    res.send(results.rows);
}

