/* eslint-disable no-console */
/* eslint-disable func-names */
class GenreRepository {
    constructor(database) {
        this.database = database;
    }

    list_Genre() {
        return new Promise((resolve, reject) => {
            this.database.all('SELECT * FROM genres', [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(
                       // rows.map((row) => this.decorator(row)),
                       rows.map((row) => ({
                        id: row.id,
                        name: row.name,
                      })),
                    );
                }
            });
        });
    }


    create_Genre(data) {
        return new Promise((resolve, reject) => {
            this.database.run(
                'INSERT INTO genres (name) VALUES (?)',
                [data.name],
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

    delete_Genre(id) {
        return new Promise((resolve, reject) => {
            this.database.run(
                `DELETE FROM genres
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

module.exports = GenreRepository;
