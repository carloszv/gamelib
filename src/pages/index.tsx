import { fetchAllGamePages } from '@/api/api';
import SearchFilter from '@/components/SearchFilter';
import { PLATFORMS } from '@/util/constants';
import { SelectChangeEvent, CircularProgress } from '@mui/material';
import React, { useState, useEffect } from 'react';
import GameGrid from '../components/GameGrid';
import SearchBar from '../components/SearchBar';
import { Content } from '../types/contentTypes';
import ScrollToTopButton from '@/components/ScrollTotopButton';
import ListCounter from '@/components/ListCounter';

// Utility function to preload images
const preloadImages = (gamePages: Content[]) => {
    return Promise.all(
        gamePages.map(page => 
            new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.src = page.cover?.fields.file.url || ''; // Assumes each content item has a coverImage property
                img.onload = () => resolve();
                img.onerror = () => resolve(); // Resolve even if image fails to load
            })
        )
    );
};

interface HomePageProps {
    gamePages: Content[];
}

const HomePage: React.FC<HomePageProps> = ({ gamePages }) => {
    const [filteredGamePages, setFilteredGamePages] = useState<Content[]>(gamePages);
    const [selectedPlatform, setSelectedPlatform] = useState<string>('');
    const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);

    useEffect(() => {
        // Preload images when component mounts or gamePages changes
        const loadImages = async () => {
            try {
                await preloadImages(gamePages);
                setImagesLoaded(true);
            } catch (error) {
                console.error('Error preloading images:', error);
                setImagesLoaded(true); // Ensure we don't get stuck in loading state
            }
        };

        loadImages();
    }, [gamePages]);

    const handleSearch = (query: string) => {
        const filtered = gamePages.filter(page =>
            page.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredGamePages(filtered);
    };

    const handlePlatformChange = (event: SelectChangeEvent<string>) => {
        const platform = event.target.value as string;
        setSelectedPlatform(platform);
        const filtered = gamePages.filter(page =>
            platform ? page.platform === platform : true
        );
        setFilteredGamePages(filtered);
    };

    // Show loading spinner until images are loaded
    if (!imagesLoaded) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f0f0f0'
            }}>
                <CircularProgress 
                    color="secondary" 
                    size={80} 
                    thickness={4} 
                    variant="indeterminate"
                />
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
                <SearchBar onSearch={handleSearch} />
                <SearchFilter 
                    selectedPlatform={selectedPlatform} 
                    handlePlatformChange={handlePlatformChange} 
                    PLATFORMS={PLATFORMS} 
                />
            </div>
            <ListCounter filteredGamePages={filteredGamePages} />
            <GameGrid filteredGamePages={filteredGamePages} />
            <ScrollToTopButton />
        </div>
    );
};

// Fetch data at build time
export const getStaticProps = async () => {
    try {
        const gamePages = await fetchAllGamePages();
        const sortedGamePages = gamePages.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
        return {
            props: {
                gamePages: sortedGamePages,
            },
            revalidate: 60,
        };
    } catch (error) {
        console.error('Failed to fetch game pages:', error);
        return {
            props: {
                gamePages: [],
            },
            revalidate: 60,
        };
    }
};

export default HomePage;