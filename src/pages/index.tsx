import { fetchAllGamePages } from '@/api/api';
import ListCounter from '@/components/ListCounter';
import ScrollToTopButton from '@/components/ScrollTotopButton';
import SearchFilter from '@/components/SearchFilter';
import { PLATFORMS } from '@/util/constants';
import { CircularProgress, SelectChangeEvent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import GameGrid from '../components/GameGrid';
import SearchBar from '../components/SearchBar';
import { Content } from '../types/contentTypes';
import WishlistButton from '@/components/WishlistButton';
import { makeStyles } from '@mui/styles';

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
        zIndex: 9999, // Ensure it's above all other content
        transition: 'opacity 0.5s ease-out', // Smooth fade-out effect
    },
    loadingSpinner: {
        // Optional: add some styling to make the spinner more prominent
        transform: 'scale(1.5)', // Make spinner slightly larger
    },
    fadeOut: {
        opacity: 0,
        pointerEvents: 'none', // Disable interactions when fading out
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

// Utility function to preload images
const preloadImages = (gamePages: Content[]) => {
    return Promise.all(
        gamePages.map(page => 
            new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.src = page.cover?.fields.file.url || ''; 
                img.onload = () => resolve();
                img.onerror = () => resolve(); 
            })
        )
    );
};

interface HomePageProps {
    gamePages: Content[];
    gamePagesWishList: Content[];
}

const HomePage: React.FC<HomePageProps> = ({ gamePages, gamePagesWishList }) => {
    const classes = useStyles();

    const [filteredGamePages, setFilteredGamePages] = useState<Content[]>(gamePages);
    const [selectedPlatform, setSelectedPlatform] = useState<string>('');
    const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
    const [showWishList, setShowWishList] = useState<boolean>(false);

    useEffect(() => {
        const loadImages = async () => {
            try {
                await preloadImages(gamePages);
                
                // Add a slight delay to ensure a smooth transition
                setTimeout(() => {
                    setImagesLoaded(true);
                }, 500);
            } catch (error) {
                console.error('Error preloading images:', error);
                setImagesLoaded(true);
            }
        };

        loadImages();
    }, [gamePages]);

    // On component mount check wishlist saved value
    useEffect(() => {
        const isWishListShown = localStorage.getItem('showWishList');
        if (isWishListShown === "true" && !showWishList) {
            handleShowWishlist();
        }
    }, []);

    // When wishlist changes
    useEffect(() => {
        localStorage.setItem('showWishList', String(showWishList));
    }, [showWishList]);

    const handleSearch = (query: string) => {
        const currentList = showWishList ? gamePagesWishList : gamePages;
        const filtered = currentList.filter(page =>
            page.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredGamePages(filtered);
    };

    const handlePlatformChange = (event: SelectChangeEvent<string>) => {
        const platform = event.target.value as string;
        setSelectedPlatform(platform);
        const currentList = showWishList ? gamePagesWishList : gamePages;
        const filtered = currentList.filter(page =>
            platform ? page.platform === platform : true
        );
        setFilteredGamePages(filtered);
    };

    const handleShowWishlist = () => {
        if (gamePagesWishList.length === 0) return;

        setShowWishList(!showWishList);
        
        const currentList = !showWishList ? gamePagesWishList : gamePages;
        const filtered = currentList.filter(page =>
            selectedPlatform ? page.platform === selectedPlatform : true
        );
        
        setFilteredGamePages(filtered);
    };

    return (
        <>
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
                    <SearchBar onSearch={handleSearch} />
                    <SearchFilter 
                        selectedPlatform={selectedPlatform} 
                        handlePlatformChange={handlePlatformChange} 
                        PLATFORMS={PLATFORMS} 
                    />
                    <WishlistButton
                        showWishList={showWishList}
                        gamePagesWishList={gamePagesWishList}
                        handleShowWishlist={handleShowWishlist}
                    />
                </div>
                <ListCounter filteredGamePages={filteredGamePages} />
                <GameGrid filteredGamePages={filteredGamePages} />
                <ScrollToTopButton />
            </div>
        </>
    );
};

// Fetch data at build time
export const getStaticProps = async () => {
    try {
        const gamePages = await fetchAllGamePages();
        const sortedGamePages = gamePages.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
        const sortedGamePagesNotWishlist = sortedGamePages.filter(game => game.wishlist === false);
        const sortedGamePagesWishlist = sortedGamePages.filter(game => game.wishlist === true);
        return {
            props: {
                gamePages: sortedGamePagesNotWishlist,
                gamePagesWishList: sortedGamePagesWishlist,
            },
            revalidate: 60,
        };
    } catch (error) {
        console.error('Failed to fetch game pages:', error);
        return {
            props: {
                gamePages: [],
                gamePagesWishList: [],
            },
            revalidate: 60,
        };
    }
};

export default HomePage;