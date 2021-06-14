const {Pool} = require('pg');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});

module.exports = {
  query: (query) => pool.query(query),
}