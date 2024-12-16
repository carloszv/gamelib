import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of the context
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Create the context with a default value
const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {}
});

// Create a provider component
export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem('searchQuery') || '';
    }
    return '';
  });

  // Persist search query to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('searchQuery', searchQuery);
    }
  }, [searchQuery]);

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      setSearchQuery: (query: string) => {
        setSearchQuery(query);
        // Also update localStorage directly
        if (typeof window !== 'undefined') {
          localStorage.setItem('searchQuery', query);
        }
      } 
    }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use the search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};