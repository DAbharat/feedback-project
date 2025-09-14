// Utility to extract text from an image using Tesseract.js
import Tesseract from 'tesseract.js';

/**
 * Extracts text from an image file (buffer or path)
 * @param {Buffer|string} imageBufferOrPath - Image buffer or file path
 * @returns {Promise<string>} - Extracted text
 */
export async function extractTextFromImage(imageBufferOrPath) {
  const { data: { text } } = await Tesseract.recognize(
    imageBufferOrPath,
    'eng',
    { logger: m => process.env.NODE_ENV === 'development' && console.log(m) }
  );
  return text;
}
