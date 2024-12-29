import { useSearch } from '@/components/contexts/SearchContext';
import Layout from '@/components/Layout';
import ListCounter from '@/components/ListCounter';
import ScrollToTopButton from '@/components/ScrollTotopButton';
import SearchFilter from '@/components/SearchFilter';
import WishlistButton from '@/components/WishlistButton';
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
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        transition: 'opacity 0.5s ease-out',
    },
    loadingSpinner: {
        transform: 'scale(1.5)',
    },
    fadeOut: {
        opacity: 0,
        pointerEvents: 'none',
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
    gamePagesWishList: Content[];
}

const HomePage: React.FC<HomePageProps> = ({ gamePages, gamePagesWishList }) => {
    const { 
        searchQuery, 
        selectedPlatform, 
        showWishList, 
        setShowWishList 
    } = useSearch();
    
    const router = useRouter();
    const classes = useStyles();

    const [filteredGamePages, setFilteredGamePages] = useState<Content[]>(gamePages);
    const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);

    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            try {
                await preloadImages(gamePages);
                if (gamePagesWishList.length !== 0) {
                    await preloadImages(gamePagesWishList);
                };
                
                // Add a slight delay to ensure a smooth transition
                setTimeout(() => {
                    setImagesLoaded(true);
                }, 200);
            } catch (error) {
                console.error('Error preloading images:', error);
                setImagesLoaded(true);
            }
        };

        loadImages();
    }, [gamePages]);

    // Filtering logic consolidated into one useEffect
    useEffect(() => {
        if (router.isReady) {
            // Determine which list to filter
            const currentList = showWishList ? gamePagesWishList : gamePages;
            
            // Apply filters
            const filtered = currentList.filter(page =>
                page.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (selectedPlatform ? page.platform === selectedPlatform : true)
            );
            
            setFilteredGamePages(filtered);
        }
    }, [
        router.isReady, 
        searchQuery, 
        selectedPlatform, 
        showWishList, 
        gamePages, 
        gamePagesWishList
    ]);

    // Wishlist toggle handler
    const handleShowWishlist = () => {
        if (gamePagesWishList.length === 0) return;
        setShowWishList(!showWishList);
    };

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
                    <SearchFilter PLATFORMS={PLATFORMS} />
                    <WishlistButton
                        showWishList={showWishList}
                        gamePagesWishList={gamePagesWishList}
                        handleShowWishlist={handleShowWishlist}
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