const db = require('./db');
const { albumSchema, slugify } = require('./schemas');

// GET / - General API information
function getHome(req, res) {
  return res.status(200).json({
    nombre: "DiscoStore API",
    version: "1.0.0",
    descripcion: "API REST para administrar el catalogo de albumes de una tienda de musica."
  });
}

// GET /albumes - Get all albums
function getAlbumes(req, res) {
  try {
    const stmt = db.prepare('SELECT * FROM albumes');
    const albums = stmt.all();
    return res.status(200).json(albums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

// GET /album/:slug - Get a single album by slug
function getAlbumBySlug(req, res) {
  const { slug } = req.params;
  try {
    const stmt = db.prepare('SELECT * FROM albumes WHERE slug = ?');
    const album = stmt.get(slug);

    if (!album) {
      return res.status(404).json({ error: 'Album no encontrado.' });
    }

    return res.status(200).json(album);
  } catch (error) {
    console.error('Error fetching album by slug:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

// GET /genero/:genero - Get slugs of all albums of a specific genre
function getAlbumesByGenero(req, res) {
  const { genero } = req.params;
  try {
    const stmt = db.prepare('SELECT slug FROM albumes WHERE LOWER(genero) = LOWER(?)');
    const rows = stmt.all(genero);
    const slugs = rows.map(row => row.slug);
    return res.status(200).json(slugs);
  } catch (error) {
    console.error('Error fetching albums by genre:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

// GET /search/:text - Search albums matching query in title, artist, or description
function searchAlbumes(req, res) {
  const { text } = req.params;
  try {
    const searchPattern = `%${text}%`;
    const stmt = db.prepare(`
      SELECT * FROM albumes 
      WHERE titulo LIKE ? OR artista LIKE ? OR descripcion LIKE ?
    `);
    const results = stmt.all(searchPattern, searchPattern, searchPattern);
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error searching albums:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

// POST /albumes - Create a new album
function createAlbum(req, res) {
  try {
    // 1. Validate payload with Zod
    const validation = albumSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Error de validacion.',
        detalles: validation.error.flatten().fieldErrors
      });
    }

    const albumData = validation.data;
    // 2. Generate slug from title
    const slug = slugify(albumData.titulo);

    // 3. Check for conflict (existing slug)
    const checkStmt = db.prepare('SELECT 1 FROM albumes WHERE slug = ?');
    const exists = checkStmt.get(slug);
    if (exists) {
      return res.status(409).json({
        error: `Conflicto: ya existe un album con el slug generado '${slug}'.`
      });
    }

    // 4. Insert into database
    const insertStmt = db.prepare(`
      INSERT INTO albumes (slug, titulo, artista, genero, anio, sello, pistas, imagen, resumen, descripcion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      slug,
      albumData.titulo,
      albumData.artista,
      albumData.genero,
      albumData.anio,
      albumData.sello,
      albumData.pistas,
      albumData.imagen,
      albumData.resumen,
      albumData.descripcion
    );

    // Set the required Location header and return 210/201 Created
    res.setHeader('Location', `/album/${slug}`);
    return res.status(201).json({
      mensaje: 'Album creado exitosamente.',
      album: { slug, ...albumData }
    });
  } catch (error) {
    console.error('Error creating album:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

// PUT /album/:slug - Update an existing album
function updateAlbum(req, res) {
  const { slug } = req.params;

  try {
    // 1. Check if the album exists
    const checkExistStmt = db.prepare('SELECT * FROM albumes WHERE slug = ?');
    const existingAlbum = checkExistStmt.get(slug);
    if (!existingAlbum) {
      return res.status(404).json({ error: 'Album no encontrado para actualizar.' });
    }

    // 2. Validate payload with Zod
    const validation = albumSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Error de validacion.',
        detalles: validation.error.flatten().fieldErrors
      });
    }

    const albumData = validation.data;
    // 3. Generate new slug from the new title
    const newSlug = slugify(albumData.titulo);

    // 4. If slug changes, check if the new slug conflicts with another album
    if (newSlug !== slug) {
      const checkConflictStmt = db.prepare('SELECT 1 FROM albumes WHERE slug = ?');
      const conflict = checkConflictStmt.get(newSlug);
      if (conflict) {
        return res.status(409).json({
          error: `Conflicto: el nuevo titulo genera un slug '${newSlug}' que ya esta en uso por otro album.`
        });
      }
    }

    // 5. Update the album
    const updateStmt = db.prepare(`
      UPDATE albumes
      SET slug = ?, titulo = ?, artista = ?, genero = ?, anio = ?, sello = ?, pistas = ?, imagen = ?, resumen = ?, descripcion = ?
      WHERE slug = ?
    `);

    updateStmt.run(
      newSlug,
      albumData.titulo,
      albumData.artista,
      albumData.genero,
      albumData.anio,
      albumData.sello,
      albumData.pistas,
      albumData.imagen,
      albumData.resumen,
      albumData.descripcion,
      slug // original slug matches
    );

    return res.status(200).json({
      mensaje: 'Album actualizado exitosamente.',
      album: { slug: newSlug, ...albumData }
    });
  } catch (error) {
    console.error('Error updating album:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

// DELETE /album/:slug - Delete an album by slug
function deleteAlbum(req, res) {
  const { slug } = req.params;

  try {
    // 1. Check if the album exists
    const checkStmt = db.prepare('SELECT 1 FROM albumes WHERE slug = ?');
    const exists = checkStmt.get(slug);
    if (!exists) {
      return res.status(404).json({ error: 'Album no encontrado para eliminar.' });
    }

    // 2. Delete the album
    const deleteStmt = db.prepare('DELETE FROM albumes WHERE slug = ?');
    deleteStmt.run(slug);

    // Return 204 No Content
    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting album:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

module.exports = {
  getHome,
  getAlbumes,
  getAlbumBySlug,
  getAlbumesByGenero,
  searchAlbumes,
  createAlbum,
  updateAlbum,
  deleteAlbum
};
