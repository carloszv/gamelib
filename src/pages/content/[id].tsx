import { convertURL, getRatingStyle } from '@/util/funtions';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { fetchEntryById } from '../../api/api'; // Import the fetch function
import { Content } from '../../types/contentTypes'; // Import the Content type
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the back arrow icon
import { Document } from '@contentful/rich-text-types'; // Ensure correct import
import Video from '@/components/Video';
import ExternalLinks from '@/components/ExternalLinks';

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

    

    const handleBackClick = () => {
        router.push('/'); // Navigate to the index page
    };

    if (!content) return <div>Loading...</div>;

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{width: '100%', display: 'flex', marginBottom: 20}}>
                <button onClick={handleBackClick} style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                }}>
                    <ArrowBackIcon style={{ color: 'black' }} />
                </button>
            </div>
            <div style={{ position: 'relative', display: 'inline-block', marginTop: 100, margin: '0 auto', maxWidth: '100%' }}>
                {content.cover?.fields.file.url ? (
                    <Image
                        src={convertURL(content.cover.fields.file.url)} // Use the cover image
                        alt={content.title}
                        width={600}
                        height={400}
                        style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }} // Ensure the image is fully visible
                        priority={false}
                    />
                ) : null}
                {content.rating && <div style={{
                    position: 'absolute',
                    bottom: '10px', // Position from the top
                    right: '10px', // Position from the right
                    display: 'inline-block',
                    width: '80px', // Circle width
                    height: '80px', // Circle height
                    borderRadius: '50%',
                    lineHeight: '80px', // Center text vertically
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '24px', // Font size
                    border: '3px solid white', // Thin white border
                    ...getRatingStyle(content.rating)
                }}>
                    {content.rating}
                </div>}
                {content.masterpiece && (
                    <EmojiEventsIcon style={{
                        position: 'absolute',
                        top: '2px', // Position from the top
                        right: '10px', // Position next to the rating circle
                        color: 'yellow',
                        padding: '2px',
                        width: '40px', // Circle width
                        height: '40px', // Circle height
                        zIndex: 100,
                    }} />
                )}
            </div>
            <h1 style={{ textAlign: 'center', margin: '20px 0' }}>{content.title}</h1>
            {content.article && <div style={{ display: 'inline-block', textAlign: 'justify', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: documentToHtmlString(content.article as Document) }} />}
            <div style={{ marginTop: '20px' }}>
                {content.masterpiece}
                <div style={{ marginTop: '20px' }}>
                    {content.videoReview && <Video url={content.videoReview} />}
                    <ExternalLinks externalLinks={[content.externalLink1, content.externalLink2, content.externalLink3]} />
                </div>
            </div>
        </div>
    );
};

export default ContentPage; 