import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchAllGamePages } from '../../api/api';
import ContentPage from '../../components/pages/ContentPage';
import { Content } from '../../types/contentTypes';
import { titleToSlug } from '../../util/funtions';

interface Props {
    content: Content | null;
}

export default ContentPage;

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    try {
        // Check if params and title exist
        if (!params || !params.title) {
            throw new Error("Missing 'title' in getStaticProps");
        }

        const titleSlug = params.title as string;
        
        // Fetch all game pages
        const allGames = await fetchAllGamePages();
        
        // Find the game by matching the slug to the title
        const content = allGames.find(game => {
            const gameSlug = titleToSlug(game.title);
            return gameSlug === titleSlug;
        });

        if (!content) {
            return { notFound: true };
        }

        return {
            props: { content },
            revalidate: 60, // Regenerate every 60 seconds
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return { notFound: true };
    }
};

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const entries = await fetchAllGamePages();

        const paths = entries.map((entry) => ({
            params: { title: titleToSlug(entry.title) },
        }));

        return {
            paths,
            fallback: true, // Enable fallback rendering for new content
        };
    } catch (error) {
        console.error('Error in getStaticPaths:', error);
        return { paths: [], fallback: true };
    }
};
