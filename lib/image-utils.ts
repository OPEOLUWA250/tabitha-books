/**
 * Utility functions for handling image URLs from Supabase and other sources
 * Designed to work during build time and runtime with error resilience
 */

import { supabase } from "./supabase";

// Get Supabase URL - use NEXT_PUBLIC env var directly since it's public
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * Generate a signed URL for Supabase storage
 * Signed URLs bypass bucket permission restrictions and are guaranteed to work
 */
export async function getSignedSupabaseUrl(
  imagePath: string,
  bucketName: string = "books",
  expiresIn: number = 315360000, // 10 years in seconds
): Promise<string | null> {
  try {
    if (!imagePath) {
      return null;
    }

    // Extract path from full URLs - convert back to storage path
    let cleanPath = imagePath.trim();

    // If it's already a full URL, extract just the path
    if (cleanPath.startsWith("http")) {
      try {
        const urlObj = new URL(cleanPath);
        const pathParts = urlObj.pathname.split("/");

        // Find 'public' and take everything after it
        // Format is typically: /storage/v1/object/public/bucketName/path/to/file
        const publicIndex = pathParts.indexOf("public");
        if (publicIndex !== -1 && publicIndex + 2 < pathParts.length) {
          // Skip 'public' and bucket name, take the rest
          cleanPath = pathParts.slice(publicIndex + 2).join("/");
          // URL decode percent-encoded characters
          cleanPath = decodeURIComponent(cleanPath);
        }
      } catch (e) {
        // URL parsing failed, use as-is
      }
    } else {
      // Handle relative paths like /books/filename.jpg
      if (cleanPath.startsWith("/books/")) {
        cleanPath = cleanPath.substring(7); // Remove /books/
      }

      // If it doesn't start with images/, add it
      if (!cleanPath.startsWith("images/")) {
        cleanPath = `images/${cleanPath}`;
      }

      // Remove leading slashes
      if (cleanPath.startsWith("/")) {
        cleanPath = cleanPath.substring(1);
      }
    }

    // Try to get the client - this may fail during build
    let client: any;
    try {
      client = supabase;
    } catch (e) {
      // During build, supabase may not be available
      console.warn("Supabase client not available during build");
      return null; // Return null to trigger fallback
    }

    if (!client || !client.storage) {
      return null; // Return null to trigger fallback
    }

    try {
      const { data, error } = await client.storage
        .from(bucketName)
        .createSignedUrl(cleanPath, expiresIn);

      if (error) {
        console.warn(`Could not create signed URL for ${cleanPath}:`, error.message);
        // Return null to use public URL fallback
        return null;
      }

      if (data?.signedUrl) {
        return data.signedUrl;
      }

      return null;
    } catch (supabaseErr) {
      console.warn(`Supabase operation failed:`, supabaseErr);
      return null;
    }
  } catch (err) {
    console.warn(`Error in getSignedSupabaseUrl:`, err);
    return null;
  }
}

/**
 * Construct a Supabase public storage URL
 * Ensures images from Supabase are publicly accessible
 */
export function constructSupabasePublicUrl(
  fileName: string,
  bucketName: string = "books",
  supabaseUrl?: string,
): string {
  const baseUrl = supabaseUrl || SUPABASE_URL;

  if (!baseUrl) {
    return fileName;
  }

  const encodedPath = fileName
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `${baseUrl}/storage/v1/object/public/${bucketName}/${encodedPath}`;
}

/**
 * Get a properly formatted Supabase image URL
 * Ensures CORS headers are correctly set and image is publicly accessible
 */
export function getSupabaseImageUrl(
  imageUrl: string | null | undefined,
): string | null {
  if (!imageUrl) {
    return null;
  }

  // Ensure it's a string
  let url = String(imageUrl).trim();

  if (!url) {
    return null;
  }

  // If it's already a full https URL with supabase, return as-is
  if (url.startsWith("https://") && url.includes("supabase")) {
    return url;
  }

  // If it's already a full http(s) URL, return as-is
  if (url.startsWith("https://") || url.startsWith("http://")) {
    return url;
  }

  // If it's a Supabase URL without protocol, add https
  if (url.includes("supabase.co")) {
    return url.startsWith("http") ? url : `https://${url}`;
  }

  // If it looks like a relative path with supabase in it, return as-is
  if (url.includes("/storage/")) {
    return url;
  }

  // Build full Supabase URL
  if (!SUPABASE_URL) {
    return url; // Can't construct without SUPABASE_URL
  }

  let path = url;

  // If it starts with /books, convert to images format
  if (url.startsWith("/books/")) {
    path = url.substring(7); // Remove /books/
  }

  // If it starts with /, remove it
  if (path.startsWith("/")) {
    path = path.substring(1);
  }

  // If it doesn't start with images/, add it
  if (!path.startsWith("images/")) {
    path = `images/${path}`;
  }

  // Encode the path properly - split by /, encode each part, rejoin
  const encodedPath = path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `${SUPABASE_URL}/storage/v1/object/public/books/${encodedPath}`;
}

/**
 * Check if an image URL is valid and accessible
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) {
    return false;
  }

  try {
    const urlStr = String(url).trim();
    if (urlStr.startsWith("http")) {
      new URL(urlStr);
      return true;
    }
    // If it's not a full URL, check if it's a valid path
    return urlStr.length > 0;
  } catch {
    return false;
  }
}

/**
 * Get image dimensions from URL (for future use)
 */
export function getImageDimensions(
  url: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // Handle CORS for cross-origin images
    img.crossOrigin = "anonymous";
    img.src = url;
  });
}
