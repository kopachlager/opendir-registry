"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

function faviconUrl(website: string) {
  try {
    return `${new URL(website).origin}/favicon.ico`;
  } catch {
    return "";
  }
}

export function ProjectFavicon({
  name,
  website,
  className,
}: {
  name: string;
  website: string;
  className?: string;
}) {
  const src = useMemo(() => faviconUrl(website), [website]);
  const [failedSrc, setFailedSrc] = useState("");

  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center overflow-hidden border bg-muted/40 text-xs font-semibold",
        className,
      )}
      aria-hidden="true"
    >
      {src && failedSrc !== src ? (
        // A native image allows favicons from submitted project origins without proxying them through OpenDir.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="size-full object-contain p-1.5"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        name.trim().slice(0, 1).toUpperCase() || "?"
      )}
    </span>
  );
}
