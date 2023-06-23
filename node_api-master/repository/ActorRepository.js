/* eslint-disable no-console */
/* eslint-disable func-names */
class ActorRepository {
    constructor(database) {
        this.database = database;
    }

    list_Actor() {
        return new Promise((resolve, reject) => {
            this.database.all('SELECT * FROM actors', [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(
                        rows.map((row) => this.decorator(row)),
                    );
                }
            });
        });
    }

    get_Actor(id) {
        return new Promise((resolve, reject) => {
            this.database.get('SELECT * FROM actors WHERE id = ?', [id], (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(
                        this.decorator(row),
                    );
                }
            });
        });
    }

    create_Actor(data) {
        return new Promise((resolve, reject) => {
            this.database.run(
                'INSERT INTO actors (first_name, last_name,date_of_birth,date_of_death) VALUES (?,?,?,?)',
                [data.first_name, data.last_name,data.date_of_birth,data.date_of_death],
                function (err) {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                },
            );
        });
    }

    update_Actor(id, data) {
        return new Promise((resolve, reject) => {
            this.database.run(
                `UPDATE actors
                 SET first_name = ?,
                    last_name = ?,
                    date_of_birth = ?,
                    date_of_death = ?
                 WHERE id = ?`,
                [data.first_name, data.last_name,data.date_of_birth,data.date_of_death, id],
                (err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                },
            );
        });
    }

    delete_Actor(id) {
        return new Promise((resolve, reject) => {
            this.database.run(
                `DELETE FROM actors
                 WHERE id = ?`,
                [id],
                (err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(true);
                    }
                },
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

module.exports = ActorRepository;
