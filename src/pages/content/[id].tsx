import ExternalLinks from '@/components/ExternalLinks';
import Video from '@/components/Video';
import { convertURL, getRatingStyle } from '@/util/funtions';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Document } from '@contentful/rich-text-types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
    Box,
    CircularProgress,
    Container,
    Dialog,
    DialogContent,
    IconButton,
    Paper,
    Typography,
    Zoom
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { fetchEntryById } from '../../api/api';
import { Content } from '../../types/contentTypes';

const ContentPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [content, setContent] = React.useState<Content | null>(null);
    const [openFullScreen, setOpenFullScreen] = useState(false);

    React.useEffect(() => {
        if (id) {
            const fetchData = async () => {
                const entry = await fetchEntryById(id as string);
                setContent(entry);
            };
            fetchData();
        }
    }, [id]);

    const handleBackClick = () => {
        router.push('/');
    };

    const handleOpenFullScreen = () => {
        setOpenFullScreen(true);
    };

    const handleCloseFullScreen = () => {
        setOpenFullScreen(false);
    };

    if (!content) return (
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <CircularProgress 
                    color="secondary" 
                    size={60} 
                    thickness={4} 
                    variant="indeterminate"
                />
            </div>
        </Container>
    );

    return (
        <>
            <Container maxWidth="md" sx={{ py: 4 }}>
                {/* Back Button */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={handleBackClick} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        {content.title}
                    </Typography>
                </Box>

                {/* Image and Rating Section */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        position: 'relative', 
                        mb: 4, 
                        borderRadius: 3, 
                        overflow: 'hidden',
                        height: { xs: 300, sm: 400, md: 500 },
                        cursor: 'pointer'
                    }}
                    onClick={handleOpenFullScreen}
                >
                    {content.cover?.fields.file.url && (
                        <Image
                            src={convertURL(content.cover.fields.file.url)}
                            alt={content.title}
                            fill
                            style={{ 
                                objectFit: 'contain', 
                                objectPosition: 'center',
                                backgroundColor: '#f0f0f0'
                            }}
                            priority={false}
                        />
                    )}
                    
                    {/* Rating Badge */}
                    {content.rating && (
                        <Box 
                            sx={{
                                position: 'absolute',
                                bottom: 10,
                                right: 10,
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 24,
                                border: '3px solid white',
                                ...getRatingStyle(content.rating)
                            }}
                        >
                            {content.rating}
                        </Box>
                    )}

                    {/* Masterpiece Icon */}
                    {content.masterpiece && (
                        <EmojiEventsIcon 
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                color: 'gold',
                                fontSize: 40,
                                filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))'
                            }} 
                        />
                    )}
                </Paper>

                {/* Article Content */}
                {content.article && (
                    <Paper 
                        elevation={2} 
                        sx={{ 
                            p: 3, 
                            mb: 3, 
                            borderRadius: 2,
                            backgroundColor: '#f9f9f9'
                        }}
                    >
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                textAlign: 'justify', 
                                lineHeight: 1.6 
                            }}
                            dangerouslySetInnerHTML={{ __html: documentToHtmlString(content.article as Document) }}
                        />
                    </Paper>
                )}

                {/* Additional Content */}
                <Box sx={{ mt: 3 }}>
                    {content.videoReview && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Video Review</Typography>
                            <Video url={content.videoReview} />
                        </Box>
                    )}
                    
                    <ExternalLinks 
                        externalLinks={[
                            content.externalLink1, 
                            content.externalLink2, 
                            content.externalLink3
                        ]} 
                    />
                </Box>
            </Container>

            {/* Full Screen Image Dialog */}
            <Dialog
                open={openFullScreen}
                onClose={handleCloseFullScreen}
                maxWidth="xl"
                fullWidth
                TransitionComponent={Zoom}
                PaperProps={{
                    sx: {
                        borderRadius: 4, // Add overall rounded corners to the dialog
                        maxWidth: '95%',
                        margin: 'auto'
                    }
                }}
            >
                <DialogContent 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        minHeight: '80vh',
                        backgroundColor: '#f0f0f0',
                        position: 'relative',
                        p: 0, // Remove padding
                    }}
                >
                    {/* Close button */}
                    <IconButton 
                        onClick={handleCloseFullScreen}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            zIndex: 10,
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.9)'
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {content.cover?.fields.file.url && (
                        <Image
                            src={convertURL(content.cover.fields.file.url)}
                            alt={content.title}
                            width={1600}
                            height={1000}
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '95vh', 
                                objectFit: 'contain',
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ContentPage;