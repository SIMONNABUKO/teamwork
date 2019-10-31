const Pool = require('pg');

const dbConfiguration = require('./config/keys');

const pool = new Pool({
    dbConfiguration
});
module.exports = pool;