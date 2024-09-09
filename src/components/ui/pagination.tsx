import React from 'react';
import { Button } from "@/components/ui/button"
import { ArrowLeft01Icon, ArrowRight01Icon } from 'hugeicons-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
      >
        <ArrowLeft01Icon className="h-4 w-4" />
      </Button>
      <span className="text-sm ">{`Page ${currentPage} of ${totalPages}`}</span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
      >
        <ArrowRight01Icon className="h-4 w-4" />
      </Button>
    </div>
  );
};