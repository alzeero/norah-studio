"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/**
 * Wraps next/image with a soft blurred placeholder that fades out once the
 * real image has loaded. next/image already lazy-loads by default (images
 * only start fetching as they approach the viewport) — this adds the
 * visual "loading" state on top of that, with zero effect on the actual
 * image quality: nothing here touches the source file itself.
 */
export function LazyImage({ className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 scale-105 bg-gradient-to-br from-bg-elevated via-border to-bg-elevated blur-md transition-opacity duration-700",
          loaded ? "opacity-0" : "opacity-100"
        )}
      />
      <Image
        {...props}
        className={cn(className, "transition-opacity duration-700", loaded ? "opacity-100" : "opacity-0")}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </>
  );
}
