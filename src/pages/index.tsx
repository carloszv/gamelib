import React from 'react';

import { fetchAllGamePages } from '@/api/api';
import { SearchProvider } from '@/components/contexts/SearchContext';
import { Content } from '@/types/contentTypes';
import HomePage from '../components/pages/HomePage';

interface HomeProps {
    gamePages: Content[];
    gamePagesWishList: Content[];
}

const Home: React.FC<HomeProps> = ({ gamePages, gamePagesWishList }) => {
    return (
        <SearchProvider>
            <HomePage 
                gamePages={gamePages} 
                gamePagesWishList={gamePagesWishList} 
            />
        </SearchProvider>
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

export default Home;