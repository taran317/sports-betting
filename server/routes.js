const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect((err) => err && console.log(err));


// Route 1: GET /author/:type
const author = async function(req, res) {
    const name = 'Anish Agrawal';
    const pennKey = 'anish001';

    // checks the value of type the request parameters
    // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
    if (req.params.type === 'name') {
        // res.send returns data back to the requester via an HTTP response
        res.send(`Created by ${name}`);
    } else if (req.params.type === 'pennkey') {

        res.send(`Created by ${pennKey}`);
    } else {
        // we can also send back an HTTP status code to indicate an improper request
        res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
    }
}

// Route 2: GET /random
const random = async function(req, res) {
    // you can use a ternary operator to check the value of request query values
    // which can be particularly useful for setting the default value of queries
    // note if users do not provide a value for the query it will be undefined, which is falsey
    const explicit = req.query.explicit === 'true' ? 1 : 0;

    // Here is a complete example of how to query the database in JavaScript.
    // Only a small change (unrelated to querying) is required for TASK 3 in this route.
    connection.query(`
    SELECT *
    FROM Songs
    WHERE explicit <= ${explicit}
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
        if (err || data.length === 0) {
            // if there is an error for some reason, or if the query is empty (this should not be possible)
            // print the error message and return an empty object instead
            console.log(err);
            res.json({});
        } else {
            // Here, we return results of the query as an object, keeping only relevant data
            // being song_id and title which you will add. In this case, there is only one song
            // so we just directly access the first element of the query results array (data)

            res.json({
                song_id: data[0].song_id,
                title: data[0].title
            });
        }
    });
}

/********************************
 * BASIC SONG/ALBUM INFO ROUTES *
 ********************************/

// Route 3: GET /song/:song_id
const song = async function(req, res) {
    // Most of the code is already written for you, you just need to fill in the query

    const id = req.params.song_id;

    connection.query(`
     SELECT *
     FROM Songs
     WHERE song_id = '${id}'
     LIMIT 1
  `, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            res.json(data[0]);
        }
    });
}

// Route 4: GET /album/:album_id
const album = async function(req, res) {

    const id = req.params.album_id;

    connection.query(`
     SELECT *
     FROM Albums
     WHERE album_id = '${id}'
     LIMIT 1
  `, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            res.json(data[0]);
        }
    });
}

// Route 5: GET /albums
const albums = async function(req, res) {
    // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
    connection.query(`
     SELECT *
     FROM Albums
     ORDER BY release_date DESC
  `, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            res.json(data);
        }
    });
}

// Route 6: GET /album_songs/:album_id
const album_songs = async function(req, res) {

    const id = req.params.album_id;

    connection.query(`
     SELECT song_id, title, number, duration, plays
     FROM Songs
     WHERE album_id = '${id}'
     ORDER BY number ASC
  `, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            res.json(data);
        }
    });

}


/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /top_songs
const top_songs = async function(req, res) {

    const page = req.query.page;
    const pageSize = req.query.page_size ?? 10;

    if (!page) {
        // Hint: you will need to use a JOIN to get the album title as well
        connection.query(`
     SELECT s.song_id, s.title, s.album_id, s.album_id, a.title AS album, s.plays
     FROM Songs s JOIN Albums a ON s.album_id = a.album_id
     ORDER BY plays DESC
  `, (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                res.json(data);
            }
        });

    } else {

        const offset = (page - 1) * pageSize;

        connection.query(`
     SELECT s.song_id, s.title, s.album_id, s.album_id, a.title AS album, s.plays
     FROM Songs s JOIN Albums a ON s.album_id = a.album_id
     ORDER BY plays DESC
     LIMIT ${pageSize} OFFSET ${offset}
  `, (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                res.json(data);
            }
        });
    }
}

// Route 8: GET /top_albums
const top_albums = async function(req, res) {
    // (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)

    const page = req.query.page;
    const pageSize = req.query.page_size ?? 10;

    if (!page) {
        // Hint: you will need to use a JOIN to get the album title as well
        connection.query(`
     SELECT a.album_id, a.title, SUM(s.plays) AS plays
     FROM Albums a JOIN Songs s ON s.album_id = a.album_id
     GROUP BY album_id
     ORDER BY plays DESC
  `, (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                res.json(data);
            }
        });

    } else {

        const offset = (page - 1) * pageSize;

        connection.query(`
     SELECT a.album_id, a.title, SUM(s.plays) AS plays
     FROM Albums a JOIN Songs s ON s.album_id = a.album_id
     GROUP BY album_id
     ORDER BY plays DESC
     LIMIT ${pageSize} OFFSET ${offset}
  `, (err, data) => {
            if (err || data.length === 0) {
                console.log(err);
                res.json({});
            } else {
                res.json(data);
            }
        });
    }

}

// Route 9: GET /search_albums
const search_songs = async function(req, res) {
    // (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
    // Some default parameters have been provided for you, but you will need to fill in the rest
    const title = req.query.title ?? '';
    const durationLow = req.query.duration_low ?? 60;
    const durationHigh = req.query.duration_high ?? 660;
    const playsLow = req.query.plays_low ?? 0;
    const playsHigh = req.query.plays_high ?? 1100000000;
    const danceabilityLow = req.query.danceability_low ?? 0;
    const danceabilityHigh = req.query.danceability_high ?? 1;
    const energyLow = req.query.energy_low ?? 0;
    const energyHigh = req.query.energy_high ?? 1;
    const valenceLow = req.query.valence_low ?? 0;
    const valenceHigh = req.query.valence_high ?? 1;
    const explicit = req.query.explicit === 'true' ? 1 : 0;

    connection.query(`
     SELECT *
     FROM Songs
     WHERE title LIKE '%${title}%' 
        AND explicit <= ${explicit} 
        AND duration >= ${durationLow} AND duration <= ${durationHigh}
        AND plays >= ${playsLow} AND plays <= ${playsHigh}
        AND danceability >= ${danceabilityLow} AND danceability <= ${danceabilityHigh}
        AND energy >= ${energyLow} AND energy <= ${energyHigh}
        AND valence >= ${valenceLow} AND valence <= ${valenceHigh}
     ORDER BY title ASC
  `, (err, data) => {
        if (err) {
            console.log(err);
            res.json({});
        } else if (data.length === 0) {
            res.json([]);
        } else {
            res.json(data);
        }
    });

}

module.exports = {
    author,
    random,
    song,
    album,
    albums,
    album_songs,
    top_songs,
    top_albums,
    search_songs,
}
