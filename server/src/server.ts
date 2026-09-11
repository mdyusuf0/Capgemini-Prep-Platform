import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    const PORT = env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
};

startServer();
