const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "user",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("connected");
});

module.exports = db;

// db.query(`SELECT * FROM USERS WHERE ID = ${args.ID}`, (err, rows) => {
//   console.log(rows, JSON.parse(JSON.stringify(rows)));
//   if (err) throw err;
//   return JSON.parse(JSON.stringify(rows)?.[0]);
// });
