import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export type ViewMode = 'collection' | 'wishlist' | 'completed';

// Define the shape of the context
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPlatforms: string[];
  setSelectedPlatforms: (platforms: string[]) => void;
  selectedFriends: string[];
  setSelectedFriends: (friends: string[]) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
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
  selectedFriends: [],
  setSelectedFriends: () => {},
  viewMode: 'collection',
  setViewMode: () => {},
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
   const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('collection');
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [showNotCompleted, setShowNotCompleted] = useState<boolean>(true);
  const [showMasterpiece, setShowMasterpiece] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load from localStorage after mount
  useEffect(() => {
    const storedSearchQuery = localStorage.getItem('searchQuery') || '';
    const storedPlatformsJson = localStorage.getItem('selectedPlatforms');
    // Default to PlayStation 4 and PlayStation 5 if no stored value exists
    const defaultPlatforms = ['PlayStation 4', 'PlayStation 5'];
    const storedPlatforms = storedPlatformsJson 
      ? JSON.parse(storedPlatformsJson)
      : defaultPlatforms;
    const storedViewMode = (localStorage.getItem('viewMode') || 'collection') as ViewMode;
    const storedFriendsJson = localStorage.getItem('selectedFriends');
    const storedFriends = storedFriendsJson ? JSON.parse(storedFriendsJson) : [];
    const storedShowCompleted = localStorage.getItem('showCompleted') !== 'false';
    const storedShowNotCompleted = localStorage.getItem('showNotCompleted') !== 'false';
    const storedShowMasterpiece = localStorage.getItem('showMasterpiece') === 'true';

    setSearchQuery(storedSearchQuery);
    setSelectedPlatforms(storedPlatforms);
    setSelectedFriends(storedFriends);
    setViewMode(storedViewMode);
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
      localStorage.setItem('selectedFriends', JSON.stringify(selectedFriends));
      localStorage.setItem('viewMode', viewMode);
      localStorage.setItem('showCompleted', String(showCompleted));
      localStorage.setItem('showNotCompleted', String(showNotCompleted));
      localStorage.setItem('showMasterpiece', String(showMasterpiece));
    }
  }, [
    searchQuery,
    selectedPlatforms,
    selectedFriends,
    viewMode,
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
      selectedFriends,
      setSelectedFriends,
      viewMode,
      setViewMode,
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