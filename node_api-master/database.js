/* eslint-disable no-console */
const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = 'database.sqlite';

const db = new sqlite3.Database(DBSOURCE, (errConnect) => {
    if (errConnect) {
        // Cannot open database
        console.error(errConnect.message);
        throw errConnect;
    } else {
        console.log('Connected to the SQLite database.');
        db.serialize(() => {
          db.exec(
            `
            CREATE TABLE 'genres' (
              'id' INTEGER PRIMARY KEY AUTOINCREMENT,
              'name' varchar(255) NOT NULL
            );
            
            CREATE TABLE 'actors' (
              'id' INTEGER PRIMARY KEY AUTOINCREMENT,
              'first_name' varchar(255) NOT NULL,
              'last_name' varchar(255) NOT NULL,
              'date_of_birth' date NOT NULL,
              'date_of_death' date
            );
            
            CREATE TABLE 'films' (
              'id' INTEGER PRIMARY KEY AUTOINCREMENT,
              'name' varchar(255) NOT NULL,
              'synopsis' text NOT NULL,
              'release_year' int,
              'genre_id' int NOT NULL
            );
            
            CREATE TABLE 'films_actors' (
              'film_id' INTEGER,
              'actor_id' INTEGER,
              FOREIGN KEY (film_id) REFERENCES films(id),
              FOREIGN KEY (actor_id) REFERENCES actors(id),
              PRIMARY KEY ('film_id', 'actor_id')
            );`,
            (errQuery) => {
              if (errQuery) {
                console.error(errQuery.message);
              } else {
                console.log('Tables created successfully.');
    
                db.run("INSERT INTO genres (name) VALUES ('Comédie')", [], function (errInsertGenre) {
                  if (errInsertGenre) {
                    console.error(errInsertGenre.message);
                  } else {
                    const genreId = this.lastID;
                    db.run("INSERT INTO actors (first_name, last_name, date_of_birth) VALUES (?, ?, ?)", ['Louis', 'de Funès', '1914-07-31'], function (errInsertActor1) {
                      if (errInsertActor1) {
                        console.error(errInsertActor1.message);
                      } else {
                        const actor1Id = this.lastID;
                        db.run("INSERT INTO actors (first_name, last_name, date_of_birth) VALUES (?, ?, ?)", ['Yves', 'Montand', '1921-10-13'], function (errInsertActor2) {
                          if (errInsertActor2) {
                            console.error(errInsertActor2.message);
                          } else {
                            const actor2Id = this.lastID;
                            db.run("INSERT INTO films (name, synopsis, release_year, genre_id) VALUES (?, ?, ?, ?)", ['La Folie des grandeurs', 'Synopsis du film', 1971, genreId], function (errInsertFilm) {
                              if (errInsertFilm) {
                                console.error(errInsertFilm.message);
                              } else {
                                const filmId = this.lastID;
                                db.run("INSERT INTO films_actors (film_id, actor_id) VALUES (?, ?), (?, ?)", [filmId, actor1Id, filmId, actor2Id], function (errInsertFilmsActors) {
                                  if (errInsertFilmsActors) {
                                    console.error(errInsertFilmsActors.message);
                                  } else {
                                    console.log('Data inserted successfully.');
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            }
          );
        });
      }
    });

module.exports = db;
