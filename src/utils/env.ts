// Environment variable utility that works with runtime variables
declare global {
  interface Window {
    _env_?: {
      VITE_N8N_WEBHOOK_ID?: string;
      VITE_N8N_BASE_URL?: string;
      VITE_CORS_WHITELIST?: string;
    };
  }
}

export function getEnvVar(key: string): string | undefined {
  // First try runtime environment variables
  if (window._env_ && window._env_[key as keyof typeof window._env_]) {
    const value = window._env_[key as keyof typeof window._env_];
    // Skip placeholder values
    if (value && !value.startsWith('__') && !value.endsWith('__')) {
      return value;
    }
  }
  
  // Fallback to build-time environment variables
  return import.meta.env[key];
} 