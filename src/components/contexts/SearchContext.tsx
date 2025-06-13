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
  // Initialize state with default values
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [showWishList, setShowWishList] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load from localStorage after mount
  useEffect(() => {
    const storedSearchQuery = localStorage.getItem('searchQuery') || '';
    const storedPlatform = localStorage.getItem('selectedPlatform') || '';
    const storedShowWishList = localStorage.getItem('showWishList') === 'true';

    setSearchQuery(storedSearchQuery);
    setSelectedPlatform(storedPlatform);
    setShowWishList(storedShowWishList);
    setIsHydrated(true);
  }, []);

  // Persist to localStorage whenever values change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('searchQuery', searchQuery);
      localStorage.setItem('selectedPlatform', selectedPlatform);
      localStorage.setItem('showWishList', String(showWishList));
    }
  }, [searchQuery, selectedPlatform, showWishList, isHydrated]);

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