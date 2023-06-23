/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');

const routesFilm = require('./routes/routesFilm');
const routesGenre = require('./routes/routesGenre');
const routesActeur = require('./routes/routesActor');

const app = express();
const API_KEY = "8f94826adab8ffebbeadb4f9e161b2dc";


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
  
    if (!apiKey) {
      return res.status(401).json({ message: 'Clé API manquante' });
    }
  
    if (apiKey !== API_KEY) {
      return res.status(403).json({ message: 'Clé API invalide' });
    }
  
    next();
  };
  
app.use(apiKeyMiddleware);

const HTTP_PORT = 8000;


app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

// Routes "Film"
app.use('/api/film', routesFilm);

// Routes "Genre"
app.use('/api/genre', routesGenre);

// Routes "Acteur"
app.use('/api/actor', routesActeur);

// Fallback route
app.use((req, res) => {
    res.status(404);
});


