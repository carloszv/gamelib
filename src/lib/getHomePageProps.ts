import { fetchAllGamePages } from '@/api/api';
import { Content } from '@/types/contentTypes';

export interface HomePageProps {
    gamePages: Content[];
    gamePagesCollection: Content[];
    gamePagesWishList: Content[];
    gamePagesCompleted: Content[];
    gamePagesFriends: Content[];
}

export const getHomePageProps = async () => {
    try {
        const gamePages = await fetchAllGamePages();

        const sortByTitle = (a: Content, b: Content) =>
            a.title.trim().localeCompare(b.title.trim(), undefined, {
                sensitivity: 'base',
                numeric: true,
            });

        const gamePagesCollection = gamePages
            .filter(game => game.category === 'Collection' || !game.category)
            .sort(sortByTitle);
        const gamePagesWishList = gamePages
            .filter(game => game.category === 'Wishlist')
            .sort(sortByTitle);

        const gamePagesCompleted = gamePages
            .filter(game => {
                if (game.category === 'Game') {
                    return true;
                }
                const isInCollection = game.category === 'Collection' || !game.category;
                const isInWishlist = game.category === 'Wishlist';
                return (isInCollection || isInWishlist) && game.rating !== undefined;
            })
            .sort(sortByTitle);

        const gamePagesFriends = gamePages
            .filter(game => game.friends && game.friends.length > 0)
            .sort(sortByTitle);

        const sortedGamePages = gamePages.sort(sortByTitle);

        return {
            props: {
                gamePages: sortedGamePages,
                gamePagesCollection,
                gamePagesWishList,
                gamePagesCompleted,
                gamePagesFriends,
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
                gamePagesFriends: [],
            },
            revalidate: 60,
        };
    }
};
