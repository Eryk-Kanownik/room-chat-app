import mysql from "mysql";

let connection = mysql.createConnection({
  host: "localhost",
  user: "me",
  password: "secret",
  database: "my_db",
});
