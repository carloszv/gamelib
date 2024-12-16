// [id].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import { fetchEntryById, fetchAllGamePages } from '../../api/api';
import { Content } from '../../types/contentTypes';
import ContentPage from '../ContentPage';

interface Props {
    content: Content | null;
}

export default ContentPage;

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    try {
        const content = await fetchEntryById(params?.id as string);

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
            params: { id: entry.id },
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
