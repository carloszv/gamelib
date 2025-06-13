import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of the context
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPlatforms: string[];
  setSelectedPlatforms: (platforms: string[]) => void;
  showWishList: boolean;
  setShowWishList: (show: boolean) => void;
  showCompleted: boolean;
  setShowCompleted: (show: boolean) => void;
  showNotCompleted: boolean;
  setShowNotCompleted: (show: boolean) => void;
  showMasterpiece: boolean;
  setShowMasterpiece: (show: boolean) => void;
}

// Create the context with a default value
const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
  selectedPlatforms: [],
  setSelectedPlatforms: () => {},
  showWishList: false,
  setShowWishList: () => {},
  showCompleted: true,
  setShowCompleted: () => {},
  showNotCompleted: true,
  setShowNotCompleted: () => {},
  showMasterpiece: false,
  setShowMasterpiece: () => {}
});

// Create a provider component
export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with default values
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showWishList, setShowWishList] = useState<boolean>(false);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [showNotCompleted, setShowNotCompleted] = useState<boolean>(true);
  const [showMasterpiece, setShowMasterpiece] = useState<boolean>(true);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load from localStorage after mount
  useEffect(() => {
    const storedSearchQuery = localStorage.getItem('searchQuery') || '';
    const storedPlatforms = JSON.parse(localStorage.getItem('selectedPlatforms') || '[]');
    const storedShowWishList = localStorage.getItem('showWishList') === 'true';
    const storedShowCompleted = localStorage.getItem('showCompleted') !== 'false';
    const storedShowNotCompleted = localStorage.getItem('showNotCompleted') !== 'false';
    const storedShowMasterpiece = localStorage.getItem('showMasterpiece') !== 'false';

    setSearchQuery(storedSearchQuery);
    setSelectedPlatforms(storedPlatforms);
    setShowWishList(storedShowWishList);
    setShowCompleted(storedShowCompleted);
    setShowNotCompleted(storedShowNotCompleted);
    setShowMasterpiece(storedShowMasterpiece);
    setIsHydrated(true);
  }, []);

  // Persist to localStorage whenever values change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('searchQuery', searchQuery);
      localStorage.setItem('selectedPlatforms', JSON.stringify(selectedPlatforms));
      localStorage.setItem('showWishList', String(showWishList));
      localStorage.setItem('showCompleted', String(showCompleted));
      localStorage.setItem('showNotCompleted', String(showNotCompleted));
      localStorage.setItem('showMasterpiece', String(showMasterpiece));
    }
  }, [
    searchQuery,
    selectedPlatforms,
    showWishList,
    showCompleted,
    showNotCompleted,
    showMasterpiece,
    isHydrated
  ]);

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      setSearchQuery,
      selectedPlatforms,
      setSelectedPlatforms,
      showWishList,
      setShowWishList,
      showCompleted,
      setShowCompleted,
      showNotCompleted,
      setShowNotCompleted,
      showMasterpiece,
      setShowMasterpiece
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