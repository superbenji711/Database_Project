const oracledb = require('oracledb');
const config = require('../config');


exports.getAll = async (req, res) => {

    sql = `select distinct name, symbol, sector from sector JOIN mlmatoli.stock_value ON sector.symbol = stock_id`;

    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);
    res.send(results.rows);
     
} 

exports.getOne = async (req, res) => {
    console.log('here')
    stockID = req.params.id
    startMonth = req.params.startMonth
    startYear = req.params.startYear
    endMonth = req.params.endMonth
    endYear = req.params.endYear
    let day = '02';
    let month = '01';
    console.log(startYear)
    sql = `SELECT mlmatoli.STOCK_VALUE.HIGH_VAL, mlmatoli.STOCK_VALUE.STOCK_DATE FROM  mlmatoli.STOCK_VALUE
            WHERE  mlmatoli.STOCK_VALUE.STOCK_ID = '${stockID}' AND ((mlmatoli.STOCK_VALUE.STOCK_DATE >= 
                to_timestamp('${startYear}-${startMonth}-01T00:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"'))
                AND (mlmatoli.STOCK_VALUE.STOCK_DATE <= 
                    to_timestamp('${endYear}-${endMonth}-01T00:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"')))`;
    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);
    while (results.rows == null) {
        console.log(day[1])
        let a = Number(day[1])
        let b = Number(month[1])
        if (a < 9) {
            a = a+1
        }
        else {
            b = b+1
        }
        month = '0' + String(b)
        console.log(a)
        day =  '0' + String(a)
        console.log(day)
        console.log("month is"+ month)
        sql = `SELECT mlmatoli.STOCK_VALUE.HIGH_VAL, mlmatoli.STOCK_VALUE.STOCK_DATE FROM  mlmatoli.STOCK_VALUE
        WHERE  mlmatoli.STOCK_VALUE.STOCK_ID = '${stockID}' AND ((mlmatoli.STOCK_VALUE.STOCK_DATE >= 
            to_timestamp('${startYear}-${month}-${day}T00:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"'))
            AND (mlmatoli.STOCK_VALUE.STOCK_DATE <= 
                to_timestamp('${endYear}-${month}-${day}T00:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"')))`
        //console.log(sql)
        results = await connection.execute(sql);
        if (results.rows.length > 0) {
            break;
        }
    }


    console.log(results)
    res.send(results.rows);   
} 

exports.getPerformance = async (req, res) => {
    console.log(req.params.dateData)
    console.log(req.params)
    dateData = req.params.dateData
    let startDate = dateData.substring(0,4)
    let endDate = dateData.substring(4,8)
    let day = '02';
    let month = '01';
    console.log(startDate)
    console.log(endDate)
    sql = `
    (select "symbol", "name", "SECTOR", "performance"
    FROM (
        select "symbol","name", "SECTOR", "performance", 
        RANK () OVER (partition by "SECTOR" order by "performance" desc) rank
        FROM(
            select "a1" as "symbol", "n1" as "name", "s1" as "SECTOR", ((("v2"-"v1")/"v1")*100) as "performance"
            FROM
                (select MLIA.SECTOR.SYMBOL as "a1", MLIA.SECTOR.name as "n1", MLIA.SECTOR.sector as "s1", mlmatoli.STOCK_VALUE.HIGH_VAL as "v1"
                from MLIA.SECTOR, mlmatoli.STOCK_VALUE
                where MLIA.SECTOR.SYMBOL = mlmatoli.stock_value.STOCK_ID and mlmatoli.STOCK_VALUE.stock_date = to_timestamp('${startDate}-${month}-${day}T00:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"')),
                (select MLIA.SECTOR.SYMBOL as "a2", MLIA.SECTOR.name as "n2", MLIA.SECTOR.sector as "s2", mlmatoli.STOCK_VALUE.HIGH_VAL as "v2"
                from MLIA.SECTOR, mlmatoli.STOCK_VALUE
                where MLIA.SECTOR.SYMBOL = mlmatoli.stock_value.STOCK_ID and mlmatoli.STOCK_VALUE.stock_date = to_timestamp('${endDate}-${month}-${day}T00:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"')
                )
            where "a1" = "a2"
            )
    )
    where rank = 1)
    UNION
    (select "symbol", "name", "SECTOR", "performance"
    FROM (
        select "symbol", "name", "SECTOR", "performance", 
        RANK () OVER (partition by "SECTOR" order by "performance" asc) rank
        FROM(
            select "a1" as "symbol","n1" as "name", "s1" as "SECTOR", ((("v2"-"v1")/"v1")*100) as "performance"
            FROM
                (select MLIA.SECTOR.SYMBOL as "a1", MLIA.SECTOR.name as "n1", MLIA.SECTOR.sector as "s1", mlmatoli.STOCK_VALUE.HIGH_VAL as "v1"
                from MLIA.SECTOR, mlmatoli.STOCK_VALUE
                where MLIA.SECTOR.SYMBOL = mlmatoli.stock_value.STOCK_ID and mlmatoli.STOCK_VALUE.stock_date = to_timestamp('${startDate}-${month}-${day}T00:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"')),
                (select MLIA.SECTOR.SYMBOL as "a2", MLIA.SECTOR.name as "n2", MLIA.SECTOR.sector as "s2", mlmatoli.STOCK_VALUE.HIGH_VAL as "v2"
                from MLIA.SECTOR, mlmatoli.STOCK_VALUE
                where MLIA.SECTOR.SYMBOL = mlmatoli.stock_value.STOCK_ID and mlmatoli.STOCK_VALUE.stock_date = to_timestamp('${endDate}-${month}-${day}T00:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"')
                )
            where "a1" = "a2"
            )
    )
    where rank = 1)
    `
    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);
    let count = 1

    while (results.rows.length == 0) {
        console.log(day[1])
        let a = Number(day[1])
        let b = Number(month[1])
        if (a < 9) {
            a = a+1
        }
        else {
            b = b+1
        }
        month = '0' + String(b)
        console.log(a)
        day =  '0' + String(a)
        console.log(day)
        console.log("month is"+ month)
        sql =  `
        (select "symbol", "name", "SECTOR", "performance"
        FROM (
            select "symbol","name", "SECTOR", "performance", 
            RANK () OVER (partition by "SECTOR" order by "performance" desc) rank
            FROM(
                select "a1" as "symbol", "n1" as "name", "s1" as "SECTOR", ((("v2"-"v1")/"v1")*100) as "performance"
                FROM
                    (select MLIA.SECTOR.SYMBOL as "a1", MLIA.SECTOR.name as "n1", MLIA.SECTOR.sector as "s1", mlmatoli.STOCK_VALUE.HIGH_VAL as "v1"
                    from MLIA.SECTOR, mlmatoli.STOCK_VALUE
                    where MLIA.SECTOR.SYMBOL = mlmatoli.stock_value.STOCK_ID and mlmatoli.STOCK_VALUE.stock_date = to_timestamp('${startDate}-${month}-${day}T00:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"')),
                    (select MLIA.SECTOR.SYMBOL as "a2", MLIA.SECTOR.name as "n2", MLIA.SECTOR.sector as "s2", mlmatoli.STOCK_VALUE.HIGH_VAL as "v2"
                    from MLIA.SECTOR, mlmatoli.STOCK_VALUE
                    where MLIA.SECTOR.SYMBOL = mlmatoli.stock_value.STOCK_ID and mlmatoli.STOCK_VALUE.stock_date = to_timestamp('${endDate}-${month}-${day}T00:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"')
                    )
                where "a1" = "a2"
                )
        )
        where rank = 1)
        UNION
        (select "symbol", "name", "SECTOR", "performance"
        FROM (
            select "symbol", "name", "SECTOR", "performance", 
            RANK () OVER (partition by "SECTOR" order by "performance" asc) rank
            FROM(
                select "a1" as "symbol","n1" as "name", "s1" as "SECTOR", ((("v2"-"v1")/"v1")*100) as "performance"
                FROM
                    (select MLIA.SECTOR.SYMBOL as "a1", MLIA.SECTOR.name as "n1", MLIA.SECTOR.sector as "s1", mlmatoli.STOCK_VALUE.HIGH_VAL as "v1"
                    from MLIA.SECTOR, mlmatoli.STOCK_VALUE
                    where MLIA.SECTOR.SYMBOL = mlmatoli.stock_value.STOCK_ID and mlmatoli.STOCK_VALUE.stock_date = to_timestamp('${startDate}-${month}-${day}T00:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"')),
                    (select MLIA.SECTOR.SYMBOL as "a2", MLIA.SECTOR.name as "n2", MLIA.SECTOR.sector as "s2", mlmatoli.STOCK_VALUE.HIGH_VAL as "v2"
                    from MLIA.SECTOR, mlmatoli.STOCK_VALUE
                    where MLIA.SECTOR.SYMBOL = mlmatoli.stock_value.STOCK_ID and mlmatoli.STOCK_VALUE.stock_date = to_timestamp('${endDate}-${month}-${day}T00:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"')
                    )
                where "a1" = "a2"
                )
        )
        where rank = 1)
        `
        //console.log(sql)
        results = await connection.execute(sql);
    }
    console.log(results)
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

exports.getValue = async (req,res) => {
    const {symbol: symbol} = req.params;
    sql = `SELECT name, stock_date, close_val FROM mlia.SECTOR JOIN mlmatoli.stock_value ON symbol = stock_id WHERE SYMBOL = '${symbol}' ORDER BY stock_date`;
    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);

    res.send(results.rows);
}

exports.correlatedPeaks= async (req, res) => {
    const {symbol: symbol} = req.params;
    sql =
    `
    SELECT stock1.stock_id, stock1.sector, CORR(stock1.ma50_zscore, stock2.ma50_zscore) FROM
    (
    SELECT stock_id, sector, stock_date, ma50_zscore
    FROM(
        WITH zscore_table AS
        (
            SELECT stock_id AS zscoreID, AVG(ma50) ma50Mean, STDDEV(ma50) ma50STD
            FROM 
            (
                SELECT stock_id, AVG(dailyDifferent) OVER (ORDER BY stock_date ROWS BETWEEN 25 PRECEDING AND 25 FOLLOWING) as ma50
                FROM (
                    SELECT stock_id, stock_date, (close_val-prevDayClose) AS dailyDifferent
                    FROM mlmatoli.stock_value JOIN
                    (
                        SELECT stock_id prevStock, sector, stock_date as prevDay, close_val AS prevDayClose
                        FROM ( mlia.sector JOIN mlmatoli.stock_value ON symbol = stock_id )
                        WHERE stock_id != '${symbol}'                   
                    )
                    ON stock_id = prevStock AND stock_date-1 = prevDay
                    ORDER BY stock_id, stock_date
                )
            )
            GROUP BY stock_id
        )
        SELECT stock_id, sector, stock_date, (ma50-ma50Mean)/ma50STD AS ma50_zscore
        FROM
        (
            SELECT stock_id, sector, stock_date, AVG(dailyDifferent) OVER (ORDER BY stock_date ROWS BETWEEN 25 PRECEDING AND 25 FOLLOWING) as ma50
            FROM (
                SELECT stock_id, sector, stock_date, (close_val-prevDayClose) AS dailyDifferent
                FROM mlmatoli.stock_value JOIN
                (
                    SELECT stock_id as prevStock, sector, stock_date as prevDay, close_val AS prevDayClose
                    FROM ( mlia.sector JOIN mlmatoli.stock_value ON symbol = stock_id )
                    WHERE stock_id != '${symbol}'                 
                )
                ON stock_id = prevStock AND stock_date-1 = prevDay
                ORDER BY stock_id, stock_date
            )
        ),zscore_table
        WHERE stock_id = zscoreID
    )
    WHERE ma50_zscore > 2.00
    )stock1
    JOIN
    (
    SELECT stock_id, sector, stock_date, ma50_zscore
    FROM(
        WITH zscore_table AS
        (
            SELECT AVG(ma50) ma50Mean, STDDEV(ma50) ma50STD
            FROM 
            (
                SELECT
                AVG(dailyDifferent) OVER (ORDER BY stock_date ROWS BETWEEN 25 PRECEDING AND 25 FOLLOWING) as ma50
                FROM (
                    SELECT stock_date, (close_val-prevDayClose) AS dailyDifferent
                    FROM ( SELECT * FROM mlmatoli.stock_value WHERE stock_id = '${symbol}') JOIN
                    (
                        SELECT stock_date as prevDay, close_val AS prevDayClose
                        FROM ( mlia.sector JOIN mlmatoli.stock_value ON symbol = stock_id )
                        WHERE stock_id = '${symbol}'                   
                    )
                    ON stock_date-1 = prevDay
                    ORDER BY stock_date
                )
            )
        )
        SELECT stock_id, sector, stock_date,(ma50-ma50Mean)/ma50STD AS ma50_zscore
        FROM
        (
            SELECT stock_id, sector, stock_date, AVG(dailyDifferent) OVER (ORDER BY stock_date ROWS BETWEEN 25 PRECEDING AND 25 FOLLOWING) as ma50
            FROM (
                SELECT stock_id, sector, stock_date, (close_val-prevDayClose) AS dailyDifferent
                FROM mlmatoli.stock_value JOIN
                (
                    SELECT stock_date as prevDay, sector, close_val AS prevDayClose
                    FROM ( mlia.sector JOIN mlmatoli.stock_value ON symbol = stock_id )
                    WHERE stock_id = '${symbol}'                   
                )
                ON stock_date-1 = prevDay
                WHERE stock_id = '${symbol}'
                ORDER BY stock_date
            )
        ),zscore_table
    )
    WHERE ma50_zscore > 2.00
    ) stock2
    ON stock1.stock_date = stock2.stock_date
    GROUP BY stock1.stock_id,stock2.stock_id, stock1.sector, stock2.sector HAVING CORR(stock1.ma50_zscore, stock2.ma50_zscore) > 0.9
    `
    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);

    res.send(results.rows);
}

exports.correlatedFalls = async (req, res) => {
    const {symbol: symbol} = req.params;
    sql =
    `
    SELECT stock1.stock_id, stock1.sector, CORR(stock1.ma50_zscore, stock2.ma50_zscore) FROM
    (
    SELECT stock_id, sector, stock_date, ma50_zscore
    FROM(
        WITH zscore_table AS
        (
            SELECT stock_id AS zscoreID, AVG(ma50) ma50Mean, STDDEV(ma50) ma50STD
            FROM 
            (
                SELECT stock_id, AVG(dailyDifferent) OVER (ORDER BY stock_date ROWS BETWEEN 25 PRECEDING AND 25 FOLLOWING) as ma50
                FROM (
                    SELECT stock_id, stock_date, (close_val-prevDayClose) AS dailyDifferent
                    FROM mlmatoli.stock_value JOIN
                    (
                        SELECT stock_id prevStock, sector, stock_date as prevDay, close_val AS prevDayClose
                        FROM ( mlia.sector JOIN mlmatoli.stock_value ON symbol = stock_id )
                        WHERE stock_id != '${symbol}'                   
                    )
                    ON stock_id = prevStock AND stock_date-1 = prevDay
                    ORDER BY stock_id, stock_date
                )
            )
            GROUP BY stock_id
        )
        SELECT stock_id, sector, stock_date, (ma50-ma50Mean)/ma50STD AS ma50_zscore
        FROM
        (
            SELECT stock_id, sector, stock_date, AVG(dailyDifferent) OVER (ORDER BY stock_date ROWS BETWEEN 25 PRECEDING AND 25 FOLLOWING) as ma50
            FROM (
                SELECT stock_id, sector, stock_date, (close_val-prevDayClose) AS dailyDifferent
                FROM mlmatoli.stock_value JOIN
                (
                    SELECT stock_id as prevStock, sector, stock_date as prevDay, close_val AS prevDayClose
                    FROM ( mlia.sector JOIN mlmatoli.stock_value ON symbol = stock_id )
                    WHERE stock_id != '${symbol}'                 
                )
                ON stock_id = prevStock AND stock_date-1 = prevDay
                ORDER BY stock_id, stock_date
            )
        ),zscore_table
        WHERE stock_id = zscoreID
    )
    WHERE ma50_zscore < -2.00
    )stock1
    JOIN
    (
    SELECT stock_id, sector, stock_date, ma50_zscore
    FROM(
        WITH zscore_table AS
        (
            SELECT AVG(ma50) ma50Mean, STDDEV(ma50) ma50STD
            FROM 
            (
                SELECT
                AVG(dailyDifferent) OVER (ORDER BY stock_date ROWS BETWEEN 25 PRECEDING AND 25 FOLLOWING) as ma50
                FROM (
                    SELECT stock_date, (close_val-prevDayClose) AS dailyDifferent
                    FROM ( SELECT * FROM mlmatoli.stock_value WHERE stock_id = '${symbol}') JOIN
                    (
                        SELECT stock_date as prevDay, close_val AS prevDayClose
                        FROM ( mlia.sector JOIN mlmatoli.stock_value ON symbol = stock_id )
                        WHERE stock_id = '${symbol}'                   
                    )
                    ON stock_date-1 = prevDay
                    ORDER BY stock_date
                )
            )
        )
        SELECT stock_id, sector, stock_date,(ma50-ma50Mean)/ma50STD AS ma50_zscore
        FROM
        (
            SELECT stock_id, sector, stock_date, AVG(dailyDifferent) OVER (ORDER BY stock_date ROWS BETWEEN 25 PRECEDING AND 25 FOLLOWING) as ma50
            FROM (
                SELECT stock_id, sector, stock_date, (close_val-prevDayClose) AS dailyDifferent
                FROM mlmatoli.stock_value JOIN
                (
                    SELECT stock_date as prevDay, sector, close_val AS prevDayClose
                    FROM ( mlia.sector JOIN mlmatoli.stock_value ON symbol = stock_id )
                    WHERE stock_id = '${symbol}'                   
                )
                ON stock_date-1 = prevDay
                WHERE stock_id = '${symbol}'
                ORDER BY stock_date
            )
        ),zscore_table
    )
    WHERE ma50_zscore < -2.00
    ) stock2
    ON stock1.stock_date = stock2.stock_date
    GROUP BY stock1.stock_id,stock2.stock_id, stock1.sector, stock2.sector HAVING CORR(stock1.ma50_zscore, stock2.ma50_zscore) > 0.9
    `
    bind={}
    connection = await oracledb.getConnection(config);
    
    results = await connection.execute(sql);

    res.send(results.rows);
}