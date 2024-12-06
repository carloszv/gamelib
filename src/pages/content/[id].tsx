import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { fetchEntryById } from '../../api/api'; // Import the fetch function
import { Content } from '../../types/contentTypes'; // Import the Content type
import {documentToReactComponents} from "@contentful/rich-text-react-renderer";
import { convertURL } from '@/util/funtions';
import ArrowBack from '@mui/icons-material/ArrowBack'; // Import the ArrowBack icon

const ContentPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [content, setContent] = React.useState<Content | null>(null); // Use the Content type directly

    React.useEffect(() => {
        if (id) {
            const fetchData = async () => {
                const entry = await fetchEntryById(id as string);
                setContent(entry); // Now this will work as entry is of type Content
            };
            fetchData();
        }
    }, [id]);

    if (!content) return <div>Loading...</div>;

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', cursor: 'pointer' }} onClick={() => router.push('/')}>
                <ArrowBack />
            </div>
            {content.cover?.fields.file.url ? <Image
                src={convertURL(content.cover.fields.file.url)} // Use the cover image
                alt={content.title}
                width={600}
                height={400}
            /> : null}
            <h1>{content.title}</h1>
            {content.article?.json && <div>
                {documentToReactComponents(content.article.json)}
            </div>}
            {content.rating}
            {content.masterpiece}
            <div style={{ marginTop: '20px' }}>
                <a href={content.externalLink1} target="_blank" rel="noopener noreferrer">External Link 1</a>
                <a href={content.externalLink2} target="_blank" rel="noopener noreferrer">External Link 2</a>
            </div>
        </div>
    );
};

export default ContentPage; 