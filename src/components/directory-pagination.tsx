"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type DirectoryPaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export function DirectoryPagination({
  page,
  pageCount,
  onPageChange,
}: DirectoryPaginationProps) {
  return (
    <div className="flex items-center gap-2" aria-label="Directory pagination">
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </Button>
      <span className="min-w-20 text-center text-sm text-muted-foreground">
        {page} / {pageCount}
      </span>
      <Button
        variant="outline"
        size="icon"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
