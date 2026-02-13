interface Config {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  anthropicApiKey: string;
  logLevel: string;
  // Database config (to be added later)
  // database: {
  //   host: string;
  //   port: number;
  //   name: string;
  //   user: string;
  //   password: string;
  // };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate required configuration
if (!config.anthropicApiKey && config.nodeEnv === 'production') {
  console.warn('⚠️  ANTHROPIC_API_KEY is not set');
}

export default config;
