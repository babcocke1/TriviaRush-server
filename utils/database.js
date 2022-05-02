// const Pool = require("pg");
/* Heroku Postgresql Credentials */
const Pool = require("pg").Pool;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log("penis")
console.log("connect?")
module.exports = pool;