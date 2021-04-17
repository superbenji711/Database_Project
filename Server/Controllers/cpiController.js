const oracledb = require('oracledb');
const config = require('../config');


exports.getCorrelation = async (req, res) => {
    const {symbol: symbol} = req.params;
    sql = 
        `SELECT * FROM 
        (
        SELECT category, CORR(stock_zscore, cpi_zscore) AS correlation
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
                                WITH zscore_table AS( SELECT AVG(open_val) mean, STDDEV(open_val) std FROM MLMATOLI.stock_value WHERE stock_id =  '${symbol}')
                                SELECT month, year, monthlyMean, (monthlyMean-mean)/std AS stock_zscore
                                FROM ( 
                                    SELECT to_char(stock_date,'MM') month,to_char(stock_date,'YYYY') year, AVG(open_val) monthlyMean 
                                    FROM MLMATOLI.stock_value 
                                    WHERE stock_id = '${symbol}'
                                    GROUP BY to_char(stock_date,'MM'),to_char(stock_date,'YYYY')
                                    ORDER BY to_char(stock_date,'YYYY')
                                ), zscore_table
                            )
                        ) ON month = stockMonth AND year = stockYear),( SELECT name, symbol, sector FROM mlia.sector WHERE symbol =  '${symbol}')
                        ORDER BY year 
            )
            GROUP BY name, symbol, sector, category
        )
        `
    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);

    res.send(results.rows);
}

