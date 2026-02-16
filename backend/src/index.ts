import dotenv from 'dotenv';
import app from './app';
import config from './config';
import db from './db/connection';

// Load environment variables
dotenv.config();

const PORT = config.port;

// Async startup function
async function startServer() {
  try {
    // Connect to database
    await db.connect();

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
const serverPromise = startServer();
// let server: any;

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  const srv = await serverPromise;
  srv.close(async () => {
    await db.close();
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  const srv = await serverPromise;
  srv.close(async () => {
    await db.close();
    console.log('Server closed');
    process.exit(0);
  });
});

// serverPromise.then(srv => {
//   server = srv;
// });

export default serverPromise;
