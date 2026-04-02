/**
 * Utility functions for handling image URLs from Supabase and other sources
 * Designed to work during build time and runtime with error resilience
 */

import { supabase } from "./supabase";

// Get Supabase URL from environment - only available at runtime
const SUPABASE_URL =
  typeof window === "undefined" && typeof process !== "undefined"
    ? (process.env?.NEXT_PUBLIC_SUPABASE_URL as string)
    : undefined;

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
    let cleanPath = imagePath;

    // If it's already a full URL, extract just the path
    if (imagePath.startsWith("http")) {
      // Example: https://pmsazwxcapmheqskrkfy.supabase.co/storage/v1/object/public/books/images/XXX.jpeg
      // Extract: images/XXX.jpeg
      const urlObj = new URL(imagePath);
      const pathParts = urlObj.pathname.split("/");

      // Find 'public' and take everything after it except the bucket name
      // Format is typically: /storage/v1/object/public/bucketName/path/to/file
      const publicIndex = pathParts.indexOf("public");
      if (publicIndex !== -1 && publicIndex + 2 < pathParts.length) {
        // Skip 'public' and bucket name, take the rest
        cleanPath = pathParts.slice(publicIndex + 2).join("/");
        // URL decode percent-encoded characters
        cleanPath = decodeURIComponent(cleanPath);
      }
    } else {
      // Handle relative paths
      if (imagePath.startsWith(`${bucketName}/`)) {
        cleanPath = imagePath.substring(bucketName.length + 1);
      }

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
      return imagePath; // Return original path as fallback
    }

    if (!client || !client.storage) {
      return imagePath; // Return original as fallback
    }

    try {
      const { data, error } = await client.storage
        .from(bucketName)
        .createSignedUrl(cleanPath, expiresIn);

      if (error) {
        console.warn(`Could not create signed URL for ${cleanPath}`);
        // Return public URL as fallback
        return getSupabaseImageUrl(imagePath);
      }

      if (data?.signedUrl) {
        return data.signedUrl;
      }

      return getSupabaseImageUrl(imagePath);
    } catch (supabaseErr) {
      console.warn(`Supabase operation failed, using public URL fallback`);
      return getSupabaseImageUrl(imagePath);
    }
  } catch (err) {
    console.warn(`Error in getSignedSupabaseUrl, using fallback`);
    return imagePath;
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
  const url = String(imageUrl).trim();

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

  // If it ends with a filename (no slashes at end), it might be just a path
  // Try to construct a full Supabase URL
  if (url.includes("images/") || url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    if (SUPABASE_URL) {
      const path = url.startsWith("/storage")
        ? url
        : `/storage/v1/object/public/books/${url}`;
      return `${SUPABASE_URL}${path}`;
    }
  }

  // If it looks like a relative path with supabase in it, return as-is
  if (url.includes("/storage/")) {
    return url;
  }

  // Last resort: assume it's a path and construct URL
  if (SUPABASE_URL && url.length > 0) {
    return constructSupabasePublicUrl(url);
  }

  // Return as-is and let the browser handle it
  return url;
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
