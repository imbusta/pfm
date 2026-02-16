import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  anthropicApiKey: string;
  openaiApiKey: string;
  logLevel: string;
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
}


const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  logLevel: process.env.LOG_LEVEL || 'info',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'pfm',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
  },
};

// Validate required configuration
if (!config.anthropicApiKey && config.nodeEnv === 'production') {
  console.warn('⚠️  ANTHROPIC_API_KEY is not set');
}

export default config;
