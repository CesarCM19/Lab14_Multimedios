const { z } = require('zod');

/**
 * Normalizes and converts a string into a clean URL-friendly slug.
 * E.g. "The Dark Side of the Moon" -> "the-dark-side-of-the-moon"
 */
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Splits accented characters
    .replace(/[\u0300-\u036f]/g, '') // Removes accent markers
    .trim()
    .replace(/\s+/g, '-') // Replaces spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Removes special chars except hyphens/underscores
    .replace(/\-\-+/g, '-') // Collapses multiple hyphens
    .replace(/^-+/, '') // Removes leading hyphens
    .replace(/-+$/, ''); // Removes trailing hyphens
}

// Zod schema for validating the incoming album request bodies (POST/PUT)
const albumSchema = z.object({
  titulo: z.string({
    required_error: "El titulo es obligatorio",
    invalid_type_error: "El titulo debe ser un texto"
  }).trim().min(1, "El titulo no puede estar vacio"),
  
  artista: z.string({
    required_error: "El artista es obligatorio",
    invalid_type_error: "El artista debe ser un texto"
  }).trim().min(1, "El artista no puede estar vacio"),
  
  genero: z.string({
    required_error: "El genero es obligatorio",
    invalid_type_error: "El genero debe ser un texto"
  }).trim().min(1, "El genero no puede estar vacio"),
  
  anio: z.number({
    required_error: "El anio es obligatorio",
    invalid_type_error: "El anio debe ser un numero"
  }).int("El anio debe ser un numero entero").min(1800, "El anio debe ser mayor a 1800").max(new Date().getFullYear() + 10, "El anio no es valido"),
  
  sello: z.string({
    required_error: "El sello es obligatorio",
    invalid_type_error: "El sello debe ser un texto"
  }).trim().min(1, "El sello no puede estar vacio"),
  
  pistas: z.number({
    required_error: "El numero de pistas es obligatorio",
    invalid_type_error: "El numero de pistas debe ser un numero"
  }).int("El numero de pistas debe ser un numero entero").min(1, "El numero de pistas debe ser al menos 1"),
  
  imagen: z.string({
    required_error: "La imagen es obligatoria",
    invalid_type_error: "La imagen debe ser un texto"
  }).trim().min(1, "La imagen no puede estar vacia"),
  
  resumen: z.string({
    required_error: "El resumen es obligatorio",
    invalid_type_error: "El resumen debe ser un texto"
  }).trim().min(1, "El resumen no puede estar vacio"),
  
  descripcion: z.string({
    required_error: "La descripcion es obligatoria",
    invalid_type_error: "La descripcion debe ser un texto"
  }).trim().min(1, "La descripcion no puede estar vacia")
});

module.exports = {
  albumSchema,
  slugify
};
