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
            const response = await client.getEntries({ content_type: contentType as string });
            res.status(200).json(response.items.map((item: any) => (
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
