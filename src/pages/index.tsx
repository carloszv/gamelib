import React from 'react';

import { fetchAllGamePages } from '@/api/api';
import { SearchProvider } from '@/components/contexts/SearchContext';
import { Content } from '@/types/contentTypes';
import HomePage from '../components/pages/HomePage';

interface HomeProps {
    gamePages: Content[];
    gamePagesCollection: Content[];
    gamePagesWishList: Content[];
    gamePagesCompleted: Content[];
}

const Home: React.FC<HomeProps> = ({ gamePages, gamePagesCollection, gamePagesWishList, gamePagesCompleted }) => {
    return (
        <SearchProvider>
            <HomePage 
                gamePages={gamePages}
                gamePagesCollection={gamePagesCollection} 
                gamePagesWishList={gamePagesWishList}
                gamePagesCompleted={gamePagesCompleted}
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
        
        // Filter by category field from Contentful
        // If category is not set, default to 'collection'
        const gamePagesCollection = sortedGamePages.filter(game => 
            game.category === 'Collection' || !game.category
        );
        const gamePagesWishList = sortedGamePages.filter(game => 
            game.category === 'Wishlist'
        );
        
        // Played Games: Games with category === 'game' OR games from collection/wishlist that have a rating
        const gamePagesCompleted = sortedGamePages.filter(game => {
            // Games with category === 'game'
            if (game.category === 'Game') {
                return true;
            }
            // Games from collection or wishlist that have a rating/score
            const isInCollection = game.category === 'Collection' || !game.category;
            const isInWishlist = game.category === 'Wishlist';
            return (isInCollection || isInWishlist) && game.rating !== undefined;
        });
        
        return {
            props: {
                gamePages: sortedGamePages, // Keep for backward compatibility
                gamePagesCollection,
                gamePagesWishList,
                gamePagesCompleted,
            },
            revalidate: 60,
        };
    } catch (error) {
        console.error('Failed to fetch game pages:', error);
        return {
            props: {
                gamePages: [],
                gamePagesCollection: [],
                gamePagesWishList: [],
                gamePagesCompleted: [],
            },
            revalidate: 60,
        };
    }
};

export default Home;