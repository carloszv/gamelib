import { createClient } from 'contentful';
import { NextApiRequest, NextApiResponse } from 'next';

const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id, contentType } = req.query;

        if (id) {
            const entry = await client.getEntry(id as string);
            res.status(200).json(entry.fields);
        } else if (contentType) {
            // Fetch all entries with pagination support
            // Contentful allows up to 1000 entries per request
            let allItems: any[] = [];
            let skip = 0;
            const limit = 1000; // Maximum allowed by Contentful
            let totalFetched = 0;
            let totalAvailable = 0;

            do {
                const response = await client.getEntries({ 
                    content_type: contentType as string,
                    limit: limit,
                    skip: skip,
                });
                
                allItems = allItems.concat(response.items);
                totalAvailable = response.total;
                totalFetched = allItems.length;
                skip += response.items.length;
                
                // Safety check to prevent infinite loops
                if (skip > 50000) {
                    console.warn('Reached safety limit of 50000 items, stopping pagination');
                    break;
                }
            } while (totalFetched < totalAvailable && allItems.length > 0);

            console.log(`Fetched ${allItems.length} entries out of ${totalAvailable} total`);

            res.status(200).json(allItems.map((item: any) => (
                {
                    ...item.fields,
                    id: item.sys.id  || null,
                }
            )));
        } else {
            res.status(400).json({ message: 'Invalid request parameters' });
        }
    } catch (error) {
        console.error('Contentful API Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
