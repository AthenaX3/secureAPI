var sqlite3 = require('sqlite3').verbose()
var bcyrpt = require('bcrypt')

const DBSOURCE = "db.sqlite"

//initializing user database
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        // console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE users (
            username TEXT NOT NULL UNIQUE,
            fname TEXT NOT NULL,
            lname TEXT NOT NULL,
            password TEXT NOT NULL,
            secret TEXT NOT NULL,
            PRIMARY KEY(username)
            )`,
        (err) => {
            if (err) {
                console.log("Table already exists");
            }else{
                // Table just created, just putting in seed values
                var insert = 'INSERT INTO users (username, fname, lname, password, secret) VALUES (?,?,?,?,?)'
                db.run(insert, ["bingo","John", "Doe", "admin123456", "bingo"])
                db.run(insert, ["user","Jane", "Doe", "user123456", "foxtrot"])
            }
        });
    }
});

module.exports = db
