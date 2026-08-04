import { getServerSession } from 'next-auth/next';
import { connectDB } from './mongodb';
import { ObjectId } from 'mongodb';

/**
 * Get current user session on server
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @returns {Promise<Object>} User session
 */
export async function getCurrentUser(req, res) {
  const session = await getServerSession(req, res);
  if (!session) return null;

  const db = await connectDB();
  
  let objectId;
  try {
    objectId = new ObjectId(session.user.id);
  } catch(e) {
    return null;
  }
  
  const user = await db.collection('users').findOne({ _id: objectId });
  return user;
}

/**
 * Check if user is authenticated
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @returns {Promise<boolean>} Authentication status
 */
export async function isAuthenticated(req, res) {
  const session = await getServerSession(req, res);
  return !!session;
}

/**
 * Check if user is admin
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @returns {Promise<boolean>} Admin status
 */
export async function isAdmin(req, res) {
  const user = await getCurrentUser(req, res);
  return user && user.role === 'admin';
}