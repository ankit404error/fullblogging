'use client';
import React, { useState } from 'react';
import { Search, X, Filter, ChevronDown, Check } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  count?: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories?: string[];
  onSelect: (categoryId: string | string[]) => void;
  multiSelect?: boolean;
  showSearch?: boolean;
  showCounts?: boolean;
  layout?: 'pills' | 'dropdown' | 'list';
}

function getCategoryColor(categoryName: string): string {
  const colors: Record<string, string> = {
    Technology: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    Design: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    Business: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    Lifestyle: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
    Travel: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
    Food: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    Health: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
    default: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
  };
  return colors[categoryName] || colors.default;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategories = [], 
  onSelect, 
  multiSelect = false,
  showSearch = true,
  showCounts = false,
  layout = 'pills'
}: CategoryFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategorySelect = (categoryId: string) => {
    if (multiSelect) {
      const currentSelection = Array.isArray(selectedCategories) ? selectedCategories : [];
      const newSelection = currentSelection.includes(categoryId)
        ? currentSelection.filter(id => id !== categoryId)
        : [...currentSelection, categoryId];
      onSelect(newSelection);
    } else {
      setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
      onSelect(categoryId === selectedCategory ? '' : categoryId);
    }
  };

  const clearAllFilters = () => {
    if (multiSelect) {
      onSelect([]);
    } else {
      setSelectedCategory('');
      onSelect('');
    }
    setSearchTerm('');
  };

  const activeFiltersCount = multiSelect 
    ? (Array.isArray(selectedCategories) ? selectedCategories.length : 0)
    : (selectedCategory ? 1 : 0);

  if (layout === 'dropdown') {
    return (
      <div className="relative mb-6">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 min-w-[200px]"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
              {activeFiltersCount > 0 ? `${activeFiltersCount} selected` : 'All Categories'}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto animate-slide-in">
            {showSearch && (
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>
            )}
            
            <div className="p-2">
              <button
                onClick={() => handleCategorySelect('')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 flex items-center justify-between group ${
                  !selectedCategory && !activeFiltersCount
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                All Categories
                {!selectedCategory && !activeFiltersCount && <Check className="w-4 h-4" />}
              </button>
              
              {filteredCategories.map((category) => {
                const isSelected = multiSelect 
                  ? selectedCategories.includes(category.id.toString())
                  : selectedCategory === category.id.toString();
                  
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id.toString())}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 flex items-center justify-between group ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {category.name}
                      {showCounts && category.count && (
                        <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                          {category.count}
                        </span>
                      )}
                    </span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
              
              {filteredCategories.length === 0 && (
                <div className="px-3 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No categories found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium text-gray-900 dark:text-white">Filter by Category</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {showSearch && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategorySelect('')}
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 hover:scale-105 ${
            !selectedCategory && !activeFiltersCount
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          All Categories
        </button>
        
        {filteredCategories.map((category) => {
          const isSelected = multiSelect 
            ? selectedCategories.includes(category.id.toString())
            : selectedCategory === category.id.toString();
            
          return (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id.toString())}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 hover:scale-105 group ${
                isSelected
                  ? `${getCategoryColor(category.name)} shadow-md border-2`
                  : `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700`
              }`}
            >
              <span className="flex items-center gap-2">
                {category.name}
                {showCounts && category.count && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected 
                      ? 'bg-white/80 text-gray-700' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {category.count}
                  </span>
                )}
              </span>
              {multiSelect && isSelected && (
                <X className="w-3 h-3 ml-1 opacity-70 group-hover:opacity-100" />
              )}
            </button>
          );
        })}
      </div>
      
      {filteredCategories.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No categories found for "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
