import { fetchAllGamePages } from '@/api/api';
import React, { useState } from 'react';
import GameGrid from '../components/GameGrid'; // Import the GameGrid component
import SearchBar from '../components/SearchBar';
import { Content } from '../types/contentTypes'; // Import the Content type
import AddButton from '../components/AddButton'; // Import the AddButton component

interface HomePageProps {
    gamePages: Content[]; // Define the props type
}

const HomePage: React.FC<HomePageProps> = ({ gamePages }) => {
    const [filteredGamePages, setFilteredGamePages] = useState<Content[]>(gamePages); // State for filtered game pages

    const handleSearch = (query: string) => {
        const filtered = gamePages.filter(page => 
            page.title.toLowerCase().includes(query.toLowerCase()) // Filter by title
        );
        setFilteredGamePages(filtered); // Update state with filtered results
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh', 
        }}>
            <SearchBar onSearch={handleSearch} />
            <div style={{ 
                backgroundColor: 'lightblue', 
                padding: '20px', 
                borderRadius: '5px', 
                margin: '10px 0 30px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
            }}>
                <span style={{ color: 'white', fontSize: '32px' }}>{gamePages.length}</span>
            </div>
            <GameGrid filteredGamePages={filteredGamePages} />
        </div>
    );
};

// Fetch data at build time
export const getStaticProps = async () => {
    const gamePages = await fetchAllGamePages(); // Fetch game pages from Contentful
    const sortedGamePages = gamePages.sort((a, b) => 
        a.title.localeCompare(b.title) // Sort by title
    );
    return {
        props: {
            gamePages: sortedGamePages, // Pass the sorted data to the page component
        },
        revalidate: 60, // Optional: Revalidate every 60 seconds
    };
};

export default HomePage;