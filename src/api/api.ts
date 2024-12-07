import { createClient } from 'contentful';
import { Content } from '../types/contentTypes'; // Import the Content type


import { createClient as createManagementClient } from 'contentful-management';



// Create a Contentful management client
const managementClient = createManagementClient({
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'vjWADSYnRfJWkGWqEsXnd-HbCCs9uJ8NInQQPGJGGqc', // Use your management access token
    host: "cdn.contentful.com"
});


// Create a Contentful client
const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID || 'q1j74ir7zza4', // Replace with a valid default if needed
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'vjWADSYnRfJWkGWqEsXnd-HbCCs9uJ8NInQQPGJGGqc', // Replace with a valid default if needed
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
                cover: item.fields.cover || null,
                article: item.fields.article || null,
                rating: item.fields.rating || null,
                masterpiece: item.fields.masterpiece || null,
                id: item.sys.id  || null,
                externalLink1: item.fields.externaLink1 || null,
                externalLink2: item.fields.externaLink2 || null
            }
        )) as unknown as Content[]; // Cast to unknown first, then to Content
    } catch (error) {
        console.error('Error fetching game pages:', error);
        return [];
    }
};

// Function to create a new content entry
export const fetchCreateContent = async (contentData: Content): Promise<void> => {
    try {
        const space = await managementClient.getSpace('q1j74ir7zza4');
        const environment = await space.getEnvironment('master');

        const entry = await environment.createEntry('gamePage', {
            fields: {
                title: { 'en-US': contentData.title },
                cover: contentData.cover ? { 'en-US': contentData.cover } : undefined,
                article: contentData.article ? { 'en-US': contentData.article } : undefined,
                rating: contentData.rating,
                masterpiece: contentData.masterpiece,
                externalLink1: { 'en-US': contentData.externalLink1 },
                externalLink2: { 'en-US': contentData.externalLink2 },
            },
        });
    
        await entry.update();
        await entry.publish();

        console.log('Entry created:', entry);
    } catch (error) {
        console.error('Error creating entry:', error);
    }
};