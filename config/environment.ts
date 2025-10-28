export interface EnvironmentConfig {
  baseURL: string;
  adminEmail: string;
  adminPassword: string;
  timeout: number;
  headless: boolean;
  slowMo: number;
}

function getEnvVar(key: string, defaultValue: string = ''): string {
  // In Playwright, process.env is available in Node context
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = getEnvVar('NODE_ENV', 'staging');
  
  const baseConfig = {
    timeout: 60000,
    headless: getEnvVar('HEADLESS', 'true') !== 'false',
    slowMo: parseInt(getEnvVar('SLOW_MO', '0')),
  };

  const configs = {
    production: {
      ...baseConfig,
      baseURL: getEnvVar('BASE_URL', 'https://app.ezyscribe.com'),
      adminEmail: getEnvVar('ADMIN_EMAIL', ''),
      adminPassword: getEnvVar('ADMIN_PASSWORD', ''),
    },
    staging: {
      ...baseConfig,
      baseURL: getEnvVar('BASE_URL', 'https://appv2.ezyscribe.com'),
      adminEmail: getEnvVar('ADMIN_EMAIL', ''),
      adminPassword: getEnvVar('ADMIN_PASSWORD', ''),
    },
    development: {
      ...baseConfig,
      baseURL: getEnvVar('BASE_URL', 'http://localhost:3000'),
      adminEmail: getEnvVar('ADMIN_EMAIL', 'test@example.com'),
      adminPassword: getEnvVar('ADMIN_PASSWORD', 'testpassword'),
      headless: false,
      slowMo: 250,
    },
  };

  const config = configs[env as keyof typeof configs] || configs.staging;
  
  // Enhanced validation with better error messages
  if (!config.adminEmail) {
    throw new Error(
      `ADMIN_EMAIL environment variable is required for ${env} environment.\n` +
      `Please set ADMIN_EMAIL as an environment variable.\n` +
      `Example: export ADMIN_EMAIL=your-email@company.com\n` +
      `Current NODE_ENV: ${env}`
    );
  }

  if (!config.adminPassword) {
    throw new Error(
      `ADMIN_PASSWORD environment variable is required for ${env} environment.\n` +
      `Please set ADMIN_PASSWORD as an environment variable.\n` +
      `Example: export ADMIN_PASSWORD=your-password\n` +
      `Current NODE_ENV: ${env}`
    );
  }

  console.log(`🌍 Environment: ${env}`);
  console.log(`🔗 Base URL: ${config.baseURL}`);
  console.log(`📧 Admin Email: ${config.adminEmail.replace(/(?<=.{3}).(?=.*@)/g, '*')}`);
  console.log(`🔒 Headless: ${config.headless}`);
  console.log(`⏱️ Timeout: ${config.timeout}ms`);

  return config;
};