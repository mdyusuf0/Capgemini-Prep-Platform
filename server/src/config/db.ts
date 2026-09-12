import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './env.js';

export function sanitizeMongoUri(uri: string): string {
  try {
    const lastAtIndex = uri.lastIndexOf('@');
    if (lastAtIndex > -1) {
      const userPassPart = uri.substring(0, lastAtIndex);
      const hostPart = uri.substring(lastAtIndex + 1);
      const protoIndex = userPassPart.indexOf('://');
      if (protoIndex > -1) {
        const proto = userPassPart.substring(0, protoIndex + 3);
        const creds = userPassPart.substring(protoIndex + 3);
        const colonIndex = creds.indexOf(':');
        if (colonIndex > -1) {
          const user = creds.substring(0, colonIndex);
          let pass = creds.substring(colonIndex + 1);
          if (pass.startsWith('<') && pass.endsWith('>')) {
            pass = pass.slice(1, -1);
          }
          const encodedPass = encodeURIComponent(decodeURIComponent(pass));
          return proto + user + ':' + encodedPass + '@' + hostPart;
        }
      }
    }
  } catch {
    // Return original if parsing fails
  }
  return uri;
}

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const targetUri = sanitizeMongoUri(env.MONGODB_URI);

  // If using MongoDB Atlas SRV URI, configure reliable public DNS servers for Windows SRV resolution
  if (targetUri.includes('mongodb+srv://')) {
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (e) {
      // Ignore if not permitted
    }
  }

  try {
    const conn = await mongoose.connect(targetUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : error}`);

    // If Atlas connection fails (e.g., pending database user setup in Atlas dashboard),
    // gracefully attempt local MongoDB fallback so the app stays functional.
    if (targetUri.includes('mongodb+srv://')) {
      console.warn('Attempting fallback to local MongoDB instance (mongodb://localhost:27017/capgemini-prep)...');
      try {
        const localConn = await mongoose.connect('mongodb://localhost:27017/capgemini-prep');
        console.log(`Fallback MongoDB Connected: ${localConn.connection.host}`);
        return;
      } catch (localErr) {
        console.error('Local MongoDB fallback also failed.');
      }
    }

    process.exit(1);
  }
};
