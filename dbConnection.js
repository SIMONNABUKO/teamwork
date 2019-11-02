const { Pool } = require('pg');

// const dbCredentials = require('./config/keys');

const pool = new Pool({
    user: 'simon',
    host: 'localhost',
    database: 'teamwork',
    password: 'simon',
    port: 5432
});

module.exports = pool;