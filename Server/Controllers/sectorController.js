const mongoose = require('mongoose');

const oracledb = require('oracledb');
const config = require('../config');




exports.getAll = async (req, res) => {
    sql = "SELECT * FROM mlia.SECTOR";
    bind={}
    connection = await oracledb.getConnection(config);
    result = await connection.execute(sql);
    res.send(result.rows)
}

exports.get = async (id) => {

}

exports.update = async (req, res) => {
    //i dont think we need to update stuff

}

