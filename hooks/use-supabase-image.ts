"use client";

import { useState, useEffect } from "react";
import { getSignedSupabaseUrl, getSupabaseImageUrl } from "@/lib/image-utils";

/**
 * Hook to load image URLs with signed URL fallback
 * Falls back to signed URLs if public URLs fail
 */
export function useSupabaseImage(imagePath: string | null | undefined) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imagePath) {
      setImageUrl(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First try with formatted public URL
        const publicUrl = getSupabaseImageUrl(imagePath);

        if (publicUrl) {
          console.log(`Trying public URL: ${publicUrl}`);
          setImageUrl(publicUrl);

          // In background, also try to get signed URL as backup
          try {
            const signedUrl = await getSignedSupabaseUrl(imagePath);
            if (signedUrl && isMounted) {
              console.log(`Signed URL available as backup: ${signedUrl}`);
              // Store signed URL for fallback use in component
              setImageUrl(signedUrl);
            }
          } catch (signedErr) {
            console.warn(
              "Signed URL generation failed, using public URL:",
              signedErr,
            );
          }
        }
      } catch (err) {
        if (isMounted) {
          const errorMsg =
            err instanceof Error ? err.message : "Failed to load image";
          console.error(`Image loading error: ${errorMsg}`);
          setError(errorMsg);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [imagePath]);

  return { imageUrl, isLoading, error };
}
