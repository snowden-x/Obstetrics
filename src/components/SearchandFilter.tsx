import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search01Icon, FilterIcon, Cancel01Icon } from "hugeicons-react"

interface SearchAndFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  searchTerm: string;
  category: 'all' | 'pregnant' | 'post partum';
  ageRange: [number, number];
}

export function SearchAndFilter({ onFilterChange }: SearchAndFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    category: 'all',
    ageRange: [0, 100],
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      searchTerm: '',
      category: 'all',
      ageRange: [0, 100],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <Search01Icon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="search"
                placeholder="Search patients..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-label="Toggle filters"
            >
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
          {isExpanded && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange({ category: value as FilterOptions['category'] })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pregnant">Pregnant</SelectItem>
                    <SelectItem value="post partum">Post Partum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="age-range">Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}</Label>
                <Slider
                  id="age-range"
                  min={0}
                  max={100}
                  step={1}
                  value={filters.ageRange}
                  onValueChange={(value) => handleFilterChange({ ageRange: value as [number, number] })}
                  className="py-4"
                />
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={resetFilters} className="flex items-center">
                  <Cancel01Icon className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
  )
}