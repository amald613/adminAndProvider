import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Running global teardown...');
  
  try {
    // Cleanup any global resources
    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:');
    
    // Handle the unknown error type safely
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('An unknown error occurred:', String(error));
    }
  }
}

export default globalTeardown;