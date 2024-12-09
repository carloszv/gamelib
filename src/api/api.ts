import { createClient } from 'contentful';
import { Content } from '../types/contentTypes'; // Import the Content type

// Create a Contentful client
const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID || 'q1j74ir7zza4', // Replace with a valid default if needed
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'KmRozk43CsuYOXn6o5U15rcDf8g4hfTvFDmqQdlJZ9Y', // Replace with a valid default if needed
});

// Function to fetch a single entry by ID
export const fetchEntryById = async (id: string): Promise<Content | null> => {
    try {
        const entry = await client.getEntry(id);
        // Extract fields and return as Content type
        return entry.fields as unknown as Content; // Cast to Content type
    } catch (error) {
        console.error('Error fetching entry:', error);
        return null;
    }
};

// Function to fetch all entries of the "Game Page" content type
export const fetchAllGamePages = async (): Promise<Content[]> => {
    try {
        const response = await client.getEntries({ content_type: 'gamePage' }); // Ensure the content type ID matches
        return response.items.map((item: any) => (
            {
                title: item.fields.title,
                platform: item.fields.platform || null,
                cover: item.fields.cover || null,
                article: item.fields.article || null,
                rating: item.fields.rating || null,
                masterpiece: item.fields.masterpiece || false,
                id: item.sys.id  || null,
                wishlist: item.fields.wishlist || false,
                videoReview: item.fields.videoReview || null,
                externalLink1: item.fields.externaLink1 || null,
                externalLink2: item.fields.externaLink2 || null,
                externalLink3: item.fields.externaLink2 || null,
            }
        )) as unknown as Content[]; // Cast to unknown first, then to Content
    } catch (error) {
        console.error('Error fetching game pages:', error);
        return [];
    }
};
