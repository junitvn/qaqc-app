import { Platform } from 'react-native';
import Config from '@/config';

/**
 * Get the API base URL with platform-specific handling
 * - iOS: localhost works fine
 * - Android Emulator: Use 10.0.2.2 to access host machine's localhost
 * - Android Physical Device: Use actual IP address of host machine
 */
export function getApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL || Config.API_URL;
  
  // If a custom URL is provided, use it
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl;
  }
  
  // For localhost, handle Android differently
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    // For physical devices, you'll need to use your machine's IP address
    const port = envUrl?.split(':').pop() || '3001';
    return `http://10.0.2.2:${port}`;
  }
  
  // iOS and web can use localhost directly
  return envUrl || 'http://localhost:3001';
}
