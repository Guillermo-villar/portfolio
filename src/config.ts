// Base URL for assets based on environment
const isProduction = process.env.NODE_ENV === 'production';

// This will return the correct base path for assets depending on the environment
export const getBasePath = (): string => {
  // For GitHub Pages or any production deployment, use the PUBLIC_URL which is set automatically based on homepage in package.json
  if (isProduction) {
    // Get the public URL from the environment (set by react-scripts based on homepage in package.json)
    // Default to empty string if not available
    const publicUrl = process.env.PUBLIC_URL || '';
    return publicUrl.endsWith('/') ? publicUrl : `${publicUrl}/`;
  }
  
  // In development, use root path
  return '/';
};

/**
 * Asset path configuration for handling both development and production environments
 */

// Helper function to get complete asset path with fallback mechanisms
export const getAssetPath = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // In production (GitHub Pages), use the PUBLIC_URL env variable
  if (process.env.NODE_ENV === 'production') {
    const publicUrl = process.env.PUBLIC_URL || '';
    // Return the complete URL with the public URL prefix
    return `${publicUrl}/${cleanPath}`;
  }
  
  // In development, use a simple root-relative path
  return `/${cleanPath}`;
};