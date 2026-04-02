"use client";

import { useState, useEffect } from "react";
import { getSignedSupabaseUrl } from "@/lib/image-utils";

/**
 * Custom hook to generate and manage signed URLs for Supabase images
 * Automatically generates a signed URL when the image path changes
 * Caches the signed URL in component state for performance
 */
export function useSignedUrl(
  imagePath: string | null | undefined,
): string | null {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!imagePath) {
      setSignedUrl(null);
      return;
    }

    const generateUrl = async () => {
      try {
        setIsLoading(true);
        const url = await getSignedSupabaseUrl(imagePath);
        setSignedUrl(url);
      } catch (error) {
        console.error("Error generating signed URL:", error);
        setSignedUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    generateUrl();
  }, [imagePath]);

  return signedUrl;
}
