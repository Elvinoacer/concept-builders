'use client';

import { createContext, useContext, useState, ReactNode, useRef, RefObject } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultsRef: RefObject<HTMLElement>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const resultsRef = useRef<HTMLElement>(null);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, resultsRef }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};