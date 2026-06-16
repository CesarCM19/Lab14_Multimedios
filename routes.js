const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

// GET / : General API info
router.get('/', controllers.getHome);

// GET /albumes : Get all albums
router.get('/albumes', controllers.getAlbumes);

// GET /album/:slug : Get album by slug
router.get('/album/:slug', controllers.getAlbumBySlug);

// GET /genero/:genero : Get slugs of albums in this genre
router.get('/genero/:genero', controllers.getAlbumesByGenero);

// GET /search/:text : Search albums by text
router.get('/search/:text', controllers.searchAlbumes);

// POST /albumes : Create a new album
router.post('/albumes', controllers.createAlbum);

// PUT /album/:slug : Update an album by slug
router.put('/album/:slug', controllers.updateAlbum);

// DELETE /album/:slug : Delete an album by slug
router.delete('/album/:slug', controllers.deleteAlbum);

module.exports = router;
