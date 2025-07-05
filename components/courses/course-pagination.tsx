'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CoursePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export function CoursePagination({
  currentPage,
  totalPages,
  totalItems,
}: CoursePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Create a new URL with updated page number
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    router.push(createPageURL(page));
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // If there's only 1 or 0 pages, don't show pagination
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-2 py-4 md:flex-row md:justify-between md:space-y-0">
      <div className="text-sm text-gray-500" dir="rtl">
        عرض {((currentPage - 1) * 12) + 1}-{Math.min(currentPage * 12, totalItems)} من {totalItems} دورة
      </div>
      
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            onClick={() => handlePageChange(page)}
            size="sm"
            className="min-w-[2rem]"
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
