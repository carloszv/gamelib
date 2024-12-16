import { Content } from '../types/contentTypes'; // Import the Content type

// Use an absolute URL for server-side calls
const baseUrl =
    typeof window === 'undefined'
        ? process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' // Default to localhost for development
        : ''; // Relative URL for client-side fetch

// Function to fetch a single entry by ID
export const fetchEntryById = async (id: string): Promise<Content | null> => {
    try {
        const response = await fetch(`${baseUrl}/api/contentful?id=${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching game pages: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (err: any) {
        console.error('Error fetching game pages:', err);
        return null;
    }
};

// Function to fetch all entries of the "Game Page" content type
export const fetchAllGamePages = async (): Promise<Content[]> => {
    try {
        const response = await fetch(`${baseUrl}/api/contentful?contentType=gamePage`);
        if (!response.ok) {
            throw new Error(`Error fetching game pages: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (err: any) {
        console.error('Error fetching game pages:', err);
        return [];
    }
};
