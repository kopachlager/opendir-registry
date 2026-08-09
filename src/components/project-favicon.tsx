"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

function faviconCandidates(website: string) {
  try {
    const origin = new URL(website).origin;
    return [
      `${origin}/favicon.ico`,
      `${origin}/favicon.svg`,
      `${origin}/favicon-32x32.png`,
      `${origin}/apple-touch-icon.png`,
    ];
  } catch {
    return [];
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
  const candidates = useMemo(() => faviconCandidates(website), [website]);
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const src = candidates.find((candidate) => !failedSources.includes(candidate));

  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center overflow-hidden border bg-muted/40 text-xs font-semibold",
        className,
      )}
      aria-hidden="true"
    >
      {src ? (
        // A native image allows favicons from submitted project origins without proxying them through OpenDir.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="size-full object-contain p-1.5"
          onError={() => setFailedSources((current) => [...current, src])}
        />
      ) : (
        name.trim().slice(0, 1).toUpperCase() || "?"
      )}
    </span>
  );
}
