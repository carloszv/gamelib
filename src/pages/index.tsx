import { fetchAllGamePages } from '@/api/api';
import SearchFilter from '@/components/SearchFilter';
import { PLATFORMS } from '@/util/constants';
import { SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';
import GameGrid from '../components/GameGrid';
import SearchBar from '../components/SearchBar';
import { Content } from '../types/contentTypes';
import ScrollToTopButton from '@/components/ScrollTotopButton';
import ListCounter from '@/components/ListCounter';

interface HomePageProps {
    gamePages: Content[];
}

const HomePage: React.FC<HomePageProps> = ({ gamePages }) => {
    const [filteredGamePages, setFilteredGamePages] = useState<Content[]>(gamePages);
    const [selectedPlatform, setSelectedPlatform] = useState<string>('');

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
                <SearchFilter selectedPlatform={selectedPlatform} handlePlatformChange={handlePlatformChange} PLATFORMS={PLATFORMS} />
            </div>
            <ListCounter filteredGamePages={filteredGamePages} />
            <GameGrid filteredGamePages={filteredGamePages} />
            <ScrollToTopButton />
        </div>
    );
};

// Fetch data at build time
export const getStaticProps = async () => {
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
};

export default HomePage;
