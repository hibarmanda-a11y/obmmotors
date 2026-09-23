import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload file to R2
 * @param {Buffer} fileBuffer - File content
 * @param {string} key - Path in bucket (e.g., "cars/mercedes-glc/thumbnail.webp")
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} Public URL
 */
export async function uploadToR2(fileBuffer, key, contentType) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await r2Client.send(command);

  return `${process.env.R2_PUBLIC_DOMAIN}/${key}`;
}

/**
 * Delete file from R2
 * @param {string} key - Path in bucket
 */
export async function deleteFromR2(key) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
}

/**
 * Extract key from public URL
 * https://pub-xxx.r2.dev/cars/foo.webp → "cars/foo.webp"
 */
export function extractKeyFromUrl(url) {
  if (!url || !url.startsWith(process.env.R2_PUBLIC_DOMAIN)) return null;
  return url.replace(`${process.env.R2_PUBLIC_DOMAIN}/`, '');
}

/**
 * Generate slug from title
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}