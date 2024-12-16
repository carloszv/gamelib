import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of the context
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  showWishList: boolean;
  setShowWishList: (show: boolean) => void;
}

// Create the context with a default value
const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
  selectedPlatform: '',
  setSelectedPlatform: () => {},
  showWishList: false,
  setShowWishList: () => {}
});

// Create a provider component
export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage with safe checks
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('searchQuery') || '';
    }
    return '';
  });

  const [selectedPlatform, setSelectedPlatform] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedPlatform') || '';
    }
    return '';
  });

  const [showWishList, setShowWishList] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('showWishList') === 'true';
    }
    return false;
  });

  // Persist to localStorage whenever values change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('searchQuery', searchQuery);
      localStorage.setItem('selectedPlatform', selectedPlatform);
      localStorage.setItem('showWishList', String(showWishList));
    }
  }, [searchQuery, selectedPlatform, showWishList]);

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      setSearchQuery,
      selectedPlatform,
      setSelectedPlatform,
      showWishList,
      setShowWishList
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