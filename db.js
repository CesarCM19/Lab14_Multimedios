const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'discostore.db');
const db = new Database(dbPath);

// Create the albumes table if it does not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS albumes (
    slug TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    artista TEXT NOT NULL,
    genero TEXT NOT NULL,
    anio INTEGER NOT NULL,
    sello TEXT NOT NULL,
    pistas INTEGER NOT NULL,
    imagen TEXT NOT NULL,
    resumen TEXT NOT NULL,
    descripcion TEXT NOT NULL
  )
`);

// Seed table if empty
const countStmt = db.prepare('SELECT COUNT(*) as count FROM albumes');
const result = countStmt.get();

if (result.count === 0) {
  console.log('Database empty. Seeding data from datos.json...');
  try {
    const jsonPath = path.join(__dirname, 'datos.json');
    if (fs.existsSync(jsonPath)) {
      const rawData = fs.readFileSync(jsonPath, 'utf8');
      const albumes = JSON.parse(rawData);

      const insertStmt = db.prepare(`
        INSERT INTO albumes (slug, titulo, artista, genero, anio, sello, pistas, imagen, resumen, descripcion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      // Run as a transaction for atomicity and speed
      const insertMany = db.transaction((albumsList) => {
        for (const album of albumsList) {
          insertStmt.run(
            album.slug,
            album.titulo,
            album.artista,
            album.genero,
            album.anio,
            album.sello,
            album.pistas,
            album.imagen,
            album.resumen,
            album.descripcion
          );
        }
      });

      insertMany(albumes);
      console.log(`Successfully seeded ${albumes.length} albums into the database.`);
    } else {
      console.warn('Warning: datos.json not found, skipping seeding.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
} else {
  console.log('Database already has data. Skipping seed.');
}

module.exports = db;
