/* eslint-disable no-console */
/* eslint-disable func-names */
class FilmRepository {
    constructor(database) {
        this.database = database;
    }

    list_Film() {
        return new Promise((resolve, reject) => {
            this.database.all(`
              SELECT films.id, films.name, films.synopsis, films.release_year, genres.name AS genre, 
                     GROUP_CONCAT(actors.first_name || ' ' || actors.last_name) AS actors
              FROM films
              INNER JOIN genres ON films.genre_id = genres.id
              LEFT JOIN films_actors ON films.id = films_actors.film_id
              LEFT JOIN actors ON films_actors.actor_id = actors.id
              GROUP BY films.id
              ORDER BY films.name ASC
            `, [], (err, rows) => {
              if (err) {
                console.error(err.message);
                reject(err);
              } else {
                resolve(rows);
              }
            });
          });
        }

    get_Film(id) {
        return new Promise((resolve, reject) => {
            this.database.get(`
                SELECT films.id, films.name, films.synopsis, films.release_year, genres.name AS genre, 
                       GROUP_CONCAT(actors.first_name || ' ' || actors.last_name) AS actors
                FROM films
                INNER JOIN genres ON films.genre_id = genres.id
                LEFT JOIN films_actors ON films.id = films_actors.film_id
                LEFT JOIN actors ON films_actors.actor_id = actors.id
                WHERE films.id = ?
                GROUP BY films.id
              `, [id], (err, row) => {
                if (err) {
                  console.error(err.message);
                  reject(err);
                } else {
                  resolve(row);
                }
              });
            });
          }
          

    create_Film(data) {
        return new Promise((resolve, reject) => {
            const { name, synopsis, release_year, genre_id, actor_ids } = data;
          
            // Vérifier si le genre existe
            this.database.get('SELECT id FROM genres WHERE id = ?', [genre_id], (err, genre) => {
                if (err) {
                  console.error(err.message);
                  reject(err);
                  return;
                }
          
                if (!genre) {
                  const error = new Error(`Le genre avec l'ID ${genre_id} n'existe pas.`);
                  error.statusCode = 404;
                  reject(error);
                  return;
                }
          
                // Vérifier si les acteurs existent
                this.database.all('SELECT id FROM actors WHERE id IN (?)', [actor_ids], (err, actors) => {
                  if (err) {
                    console.error(err.message);
                    reject(err);
                    return;
                  }
          
                  if (!actors) {
                    const error = new Error('Certains acteurs spécifiés n\'existent pas.');
                    error.statusCode = 404;
                    reject(error);
                    return;
                  }
                
                  
                  // Insérer le film
                  this.database.run(
                    'INSERT INTO films (name, synopsis, release_year, genre_id) VALUES (?, ?, ?, ?)',
                    [name, synopsis, release_year, genre_id],
                    (function (err) {
                      if (err) {
                        console.error(err.message);
                        reject(err);
                        return;
                      }
                  
                      const filmId = this.lastID;
                  
                      // Insérer les relations film-acteur dans la table intermédiaire
                      const filmActorValues = actor_ids.map((actorId) => [filmId, actorId]);
                      const insertStatement = this.database.prepare('INSERT INTO films_actors (film_id, actor_id) VALUES (?, ?)');

                      filmActorValues.forEach((values) => {
                        insertStatement.run(values, (err) => {
                          if (err) {
                            console.error(err.message);
                            reject(err);
                          }
                        });
                      });

                      insertStatement.finalize((err) => {
                        if (err) {
                          console.error(err.message);
                          reject(err);
                        } else {
                          resolve(filmId);
                        }
                      });
                    }).bind(this)
                  );
                });
            });
        });
    }
          

    update_Film(id, data) {
        return new Promise((resolve, reject) => {
          const { name, synopsis, release_year, genre_id, actor_ids } = data;
      
          // Vérifier si le genre existe
          this.database.get('SELECT id FROM genres WHERE id = ?', [genre_id], (err, genre) => {
            if (err) {
              console.error(err.message);
              reject(err);
              return;
            }
      
            if (!genre) {
              const error = new Error(`Le genre avec l'ID ${genre_id} n'existe pas.`);
              error.statusCode = 404;
              reject(error);
              return;
            }
      
            // Vérifier si les acteurs existent
            this.database.all('SELECT id FROM actors WHERE id IN (?)', [actor_ids], (err, actors) => {
              if (err) {
                console.error(err.message);
                reject(err);
                return;
              }
      
              if (!actors) {
                const error = new Error('Certains acteurs spécifiés n\'existent pas.');
                error.statusCode = 404;
                reject(error);
                return;
              }
      
              // Mettre à jour le film
              this.database.run(
                'UPDATE films SET name = ?, synopsis = ?, release_year = ?, genre_id = ? WHERE id = ?',
                [name, synopsis, release_year, genre_id, id],
                function (err) {
                  if (err) {
                    console.error(err.message);
                    reject(err);
                    return;
                  }
      
                  // Supprimer les anciennes relations film-acteur de la table intermédiaire
                  this.database.run(
                    'DELETE FROM films_actors WHERE film_id = ?',
                    [id],
                    (err) => {
                      if (err) {
                        console.error(err.message);
                        reject(err);
                        return;
                      }
      
                      // Insérer les nouvelles relations film-acteur dans la table intermédiaire
                      const filmActorValues = actor_ids.map((actorId) => [id, actorId]);
                      this.database.run(
                        'INSERT INTO films_actors (film_id, actor_id) VALUES (?, ?)',
                        filmActorValues,
                        function (err) {
                          if (err) {
                            console.error(err.message);
                            reject(err);
                          } else {
                            resolve(true);
                          }
                        }
                      );
                    }
                  );
                }
              );
            });
          });
        });
      }
      

    delete_Film(id) {
        return new Promise((resolve, reject) => {
          // Supprimer les relations film-acteur de la table intermédiaire
          this.database.run(
            'DELETE FROM films_actors WHERE film_id = ?',
            [id],
            (err) => {
              if (err) {
                console.error(err.message);
                reject(err);
                return;
              }
      
              // Supprimer le film de la table films
              this.database.run(
                'DELETE FROM films WHERE id = ?',
                [id],
                function (err) {
                  if (err) {
                    console.error(err.message);
                    reject(err);
                  } else {
                    resolve(true);
                  }
                }
              );
            }
          );
        });
      }
      

    // eslint-disable-next-line class-methods-use-this
    decorator(todo) {
        return {
            ...todo,
            done: todo.done === 1,
        };
    }
}

module.exports = FilmRepository;
