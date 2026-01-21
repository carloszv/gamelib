import { useSearch } from '@/components/contexts/SearchContext';
import Layout from '@/components/Layout';
import ListCounter from '@/components/ListCounter';
import ScrollToTopButton from '@/components/ScrollTotopButton';
import SearchFilter from '@/components/SearchFilter';
import MenuButton from '@/components/MenuButton';
import { PLATFORMS } from '@/util/constants';
import { CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import GameGrid from '../GameGrid';
import SearchBar from '../SearchBar';
import { Content } from '../../types/contentTypes';

const useStyles = makeStyles((theme) => ({
    fullScreenOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999,
        transition: 'opacity 0.5s ease-out, visibility 0.5s ease-out',
        visibility: 'visible',
        overflow: 'hidden',
        touchAction: 'none', // Prevent scrolling on mobile
    },
    loadingSpinner: {
        transform: 'scale(1.5)',
    },
    fadeOut: {
        opacity: 0,
        pointerEvents: 'none',
        visibility: 'hidden',
    },
    page: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
    },
    topBar: {
        display: 'flex', 
        alignItems: 'center', 
        marginTop: 20,
    }
}));

// Updated utility function to preload images only if not cached
const preloadImages = async (gamePages: Content[]) => {
    return Promise.all(
        gamePages.map(page => 
            new Promise<void>((resolve, reject) => {
                const imageUrl = page.cover?.fields.file.url || '';
                if (!imageUrl) {
                    resolve();
                    return;
                }

                // Check if image is already in browser cache
                fetch(imageUrl, { method: 'HEAD' })
                    .then(response => {
                        if (response.ok) {
                            // Check if image is cached by attempting to load it
                            const img = new Image();
                            img.src = imageUrl;
                            img.onload = () => {
                                // If image loads quickly, it's likely cached
                                resolve();
                            };
                            img.onerror = () => {
                                // If image fails to load, preload it
                                const preloadImg = new Image();
                                preloadImg.src = imageUrl;
                                preloadImg.onload = () => resolve();
                                preloadImg.onerror = () => resolve();
                            };
                        } else {
                            // If HEAD request fails, proceed with preloading
                            const img = new Image();
                            img.src = imageUrl;
                            img.onload = () => resolve();
                            img.onerror = () => resolve();
                        }
                    })
                    .catch(() => {
                        // If fetch fails, attempt to preload
                        const img = new Image();
                        img.src = imageUrl;
                        img.onload = () => resolve();
                        img.onerror = () => resolve();
                    });
            })
        )
    );
};

interface HomePageProps {
    gamePages: Content[];
    gamePagesCollection: Content[];
    gamePagesWishList: Content[];
    gamePagesCompleted: Content[];
    gamePagesFriends: Content[];
}

const HomePage: React.FC<HomePageProps> = ({ gamePages, gamePagesCollection, gamePagesWishList, gamePagesCompleted, gamePagesFriends }) => {
    const { 
        searchQuery, 
        selectedPlatforms, 
        selectedFriends,
        setSelectedFriends,
        viewMode,
        setViewMode,
        showCompleted,
        showNotCompleted,
        showMasterpiece
    } = useSearch();
    
    const router = useRouter();
    const classes = useStyles();

    const [filteredGamePages, setFilteredGamePages] = useState<Content[]>(gamePagesCollection);
    const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);

    // Get the current list based on view mode
    const currentList = React.useMemo(() => {
        switch (viewMode) {
            case 'wishlist':
                return gamePagesWishList;
            case 'completed':
                return gamePagesCompleted;
            case 'friends':
                return gamePagesFriends;
            case 'collection':
            default:
                return gamePagesCollection;
        }
    }, [viewMode, gamePagesCollection, gamePagesWishList, gamePagesCompleted, gamePagesFriends]);

    // Count masterpieces in the current list
    const masterpieceCount = React.useMemo(() => {
        return currentList.filter(page => page.masterpiece).length;
    }, [currentList]);

    // Unique friends from all games (used only in Friends view)
    const friendsOptions = React.useMemo(() => {
        const set = new Set<string>();
        gamePages.forEach(page => {
            page.friends?.forEach(friend => {
                if (friend && friend.trim()) {
                    set.add(friend.trim());
                }
            });
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    }, [gamePages]);

    // Calculate counts for menu
    const collectionCount = gamePagesCollection.length;
    const wishlistCount = gamePagesWishList.length;
    const completedCount = gamePagesCompleted.length;
    const friendsCount = gamePagesFriends.length;

    // Auto-select all friends when entering Friends view for the first time
    useEffect(() => {
        if (viewMode === 'friends' && friendsOptions.length > 0 && selectedFriends.length === 0) {
            setSelectedFriends([...friendsOptions]);
        }
    }, [viewMode, friendsOptions, selectedFriends.length]);

    // Preload images and prevent body scroll while loading
    useEffect(() => {
        // Prevent body scroll while loading
        const originalOverflow = document.body.style.overflow;
        const originalPosition = document.body.style.position;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';

        const loadImages = async () => {
            try {
                await preloadImages(gamePagesCollection);
                if (gamePagesWishList.length !== 0) {
                    await preloadImages(gamePagesWishList);
                };
                if (gamePagesCompleted.length !== 0) {
                    await preloadImages(gamePagesCompleted);
                };
                if (gamePagesFriends.length !== 0) {
                    await preloadImages(gamePagesFriends);
                };
                
                // Add a slight delay to ensure a smooth transition
                setTimeout(() => {
                    setImagesLoaded(true);
                    // Restore body scroll
                    document.body.style.overflow = originalOverflow;
                    document.body.style.position = originalPosition;
                    document.body.style.width = '';
                }, 200);
            } catch (error) {
                console.error('Error preloading images:', error);
                setImagesLoaded(true);
                // Restore body scroll on error
                document.body.style.overflow = originalOverflow;
                document.body.style.position = originalPosition;
                document.body.style.width = '';
            }
        };

        loadImages();

        // Cleanup function to restore scroll if component unmounts
        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.position = originalPosition;
            document.body.style.width = '';
        };
    }, [gamePagesCollection, gamePagesWishList, gamePagesCompleted, gamePagesFriends]);

    // Filtering logic consolidated into one useEffect
    useEffect(() => {
        if (router.isReady) {
            // Apply filters
            const filtered = currentList.filter(page => {
                // Text search filter
                const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase());
                
                // Platform filter
                const matchesPlatform = page.platform ? selectedPlatforms.includes(page.platform) : false;
                
                // Completion status filter
                const matchesCompletion = 
                    (showCompleted && page.rating) || 
                    (showNotCompleted && !page.rating);
                
                // Masterpiece filter - only apply if there are masterpieces in the current view
                const matchesMasterpiece = masterpieceCount === 0 || !showMasterpiece || page.masterpiece;

                // Friends filter - only applies in Friends view
                const matchesFriends =
                    viewMode !== 'friends' ||
                    selectedFriends.length === 0 ||
                    (page.friends && page.friends.some(friend => selectedFriends.includes(friend)));
                
                return matchesSearch && matchesPlatform && matchesCompletion && matchesMasterpiece && matchesFriends;
            });
            
            setFilteredGamePages(filtered);
        }
    }, [
        router.isReady, 
        searchQuery, 
        selectedPlatforms, 
        viewMode,
        currentList,
        showCompleted,
        showNotCompleted,
        showMasterpiece,
        masterpieceCount,
        selectedFriends
    ]);

    return (
        <Layout title="Carlos' GameLib">
            <div 
                className={`${classes.fullScreenOverlay} ${imagesLoaded ? classes.fadeOut : ''}`}
            >
                <CircularProgress 
                    className={classes.loadingSpinner}
                    color="secondary" 
                    size={80} 
                    thickness={4} 
                    variant="indeterminate"
                />
            </div>

            <div className={classes.page}>
                <div className={classes.topBar}>
                    <SearchBar />
                    <SearchFilter 
                        PLATFORMS={PLATFORMS} 
                        masterpieceCount={masterpieceCount}
                        friendsOptions={friendsOptions}
                    />
                    <MenuButton
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        collectionCount={collectionCount}
                        wishlistCount={wishlistCount}
                        completedCount={completedCount}
                        friendsCount={friendsCount}
                    />
                </div>
                <ListCounter filteredGamePages={filteredGamePages} />
                <GameGrid filteredGamePages={filteredGamePages} showTitle={false}/>
                <ScrollToTopButton />
            </div>
        </Layout>
    );
};

export default HomePage;