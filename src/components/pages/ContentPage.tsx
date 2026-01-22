import ExternalLinks from '@/components/ExternalLinks';
import Layout from '@/components/Layout';
import Video from '@/components/Video';
import { Content } from '@/types/contentTypes';
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
    Zoom,
    Chip,
    Divider,
    Grid,
    alpha,
    styled,
    useMediaQuery,
    useTheme
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';


interface ContentPageProps {
    content: Content | null;
}

const HeroSection = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    height: '60vh',
    minHeight: 400,
    maxHeight: 600,
    marginBottom: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    [theme.breakpoints.down('sm')]: {
        height: 'auto',
        minHeight: 'auto',
        maxHeight: 'none',
        backgroundColor: 'transparent', // Remove dark background on mobile
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

const CoverImageContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
    },
    // Video game case aspect ratio (approximately 16:9 or similar)
    aspectRatio: '16 / 9',
    [theme.breakpoints.down('sm')]: {
        aspectRatio: '3 / 4', // More vertical on mobile
    },
}));

const ScoreBadge = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    width: 120,
    height: 120,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 700,
    fontSize: 36,
    border: '4px solid white',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    zIndex: 2,
    [theme.breakpoints.down('sm')]: {
        width: 80,
        height: 80,
        fontSize: 28,
        border: '3px solid white',
    },
}));

const MasterpieceBadge = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(3),
    right: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    backgroundColor: alpha('#FFD700', 0.95),
    color: '#1a1a1a',
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius * 2,
    fontWeight: 700,
    fontSize: '0.875rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    zIndex: 2,
}));

const PlatformChip = styled(Chip)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: '0.875rem',
    height: 32,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
}));

const ContentPage: React.FC<ContentPageProps> = ({ content }) => {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [openFullScreen, setOpenFullScreen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [coverError, setCoverError] = useState(false);
    const [dialogImageError, setDialogImageError] = useState(false);
    const [dialogImageUrl, setDialogImageUrl] = useState<string | null>(null);

    if (router.isFallback) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="secondary" size={60} thickness={4} />
            </Container>
        );
    }

    const handleBackClick = () => {
        router.push('/');
    };

    const handleOpenFullScreen = (imageUrl: string) => {
        setDialogImageUrl(imageUrl);
        setOpenFullScreen(true);
    };

    const handleCloseFullScreen = () => {
        setOpenFullScreen(false);
        setDialogImageError(false);
        setDialogImageUrl(null);
    };

    if (!content) return null;

    return (
        <Layout title={content.title}>
            <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
                <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                    {/* Back Button */}
                    <IconButton 
                        onClick={handleBackClick} 
                        sx={{ 
                            mb: 3,
                            backgroundColor: 'white',
                            '&:hover': {
                                backgroundColor: alpha('#000', 0.05),
                            }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    {/* Hero Section with Cover Image */}
                    <HeroSection>
                        {content.cover?.fields.file.url && !imageError ? (
                            isMobile ? (
                                <Image
                                    src={convertURL(content.cover.fields.file.url)}
                                    alt={content.title}
                                    width={800}
                                    height={1200}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        display: 'block',
                                    }}
                                    priority
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <Image
                                    src={convertURL(content.cover.fields.file.url)}
                                    alt={content.title}
                                    fill
                                    style={{
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                    }}
                                    priority
                                    onError={() => setImageError(true)}
                                />
                            )
                        ) : (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: '#e0e0e0',
                                    backgroundImage: `
                                        repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px),
                                        repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)
                                    `,
                                    filter: 'blur(20px)',
                                    zIndex: 0,
                                }}
                            />
                        )}
                        {/* Gradient Overlay */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '40%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                                zIndex: 1,
                            }}
                        />

                        {/* Score Badge */}
                        {content.rating && (
                            <ScoreBadge sx={getRatingStyle(content.rating)}>
                                {content.rating}
                            </ScoreBadge>
                        )}

                        {/* Masterpiece Badge */}
                        {content.masterpiece && (
                            <MasterpieceBadge>
                                <EmojiEventsIcon sx={{ fontSize: 20 }} />
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    MASTERPIECE
                                </Typography>
                            </MasterpieceBadge>
                        )}
                    </HeroSection>

                    {/* Title and Platform Section */}
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                            <Typography 
                                variant="h3" 
                                component="h1" 
                                sx={{ 
                                    fontWeight: 700,
                                    fontSize: { xs: '2rem', md: '2.75rem' },
                                    lineHeight: 1.2,
                                    color: '#1a1a1a',
                                }}
                            >
                                {content.title}
                            </Typography>
                            {content.platform && (
                                <PlatformChip label={content.platform} />
                            )}
                        </Box>
                        <Divider sx={{ my: 3 }} />
                    </Box>

                    {/* Main Content Grid */}
                    <Grid container spacing={4}>
                        {/* Left Column: Review Article and Video Review */}
                        <Grid item xs={12} md={8}>
                            {/* Review Article Section */}
                            {content.article && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 3, md: 4 },
                                        borderRadius: 2,
                                        backgroundColor: 'white',
                                        mb: 3,
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 3,
                                            color: '#1a1a1a',
                                            fontSize: { xs: '1.5rem', md: '1.75rem' },
                                        }}
                                    >
                                        Review
                                    </Typography>
                                    <Divider sx={{ mb: 3 }} />
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            lineHeight: 1.8,
                                            color: '#333',
                                            fontSize: '1.1rem',
                                            '& p': {
                                                marginBottom: '1.5rem',
                                            },
                                            '& h2, & h3': {
                                                marginTop: '2rem',
                                                marginBottom: '1rem',
                                                fontWeight: 700,
                                            },
                                        }}
                                        dangerouslySetInnerHTML={{ __html: documentToHtmlString(content.article as Document) }}
                                    />
                                </Paper>
                            )}

                            {/* Video Review Section - Below Description */}
                            {(content.videoReview || content.videoReview2 || content.videoReview3) && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 3, md: 4 },
                                        borderRadius: 2,
                                        backgroundColor: 'white',
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        component="h3"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 3,
                                            color: '#1a1a1a',
                                            fontSize: { xs: '1.5rem', md: '1.75rem' },
                                        }}
                                    >
                                        Video Review
                                    </Typography>
                                    <Divider sx={{ mb: 3 }} />

                                    {content.videoReview && (
                                        <Box sx={{ mb: (content.videoReview2 || content.videoReview3) ? 3 : 0 }}>
                                            <Video url={content.videoReview} maxWidth={800} />
                                        </Box>
                                    )}

                                    {content.videoReview2 && (
                                        <Box sx={{ mb: content.videoReview3 ? 3 : 0 }}>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}
                                            >
                                                Video Review 2
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <Video url={content.videoReview2} maxWidth={800} />
                                        </Box>
                                    )}

                                    {content.videoReview3 && (
                                        <Box>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}
                                            >
                                                Video Review 3
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <Video url={content.videoReview3} maxWidth={800} />
                                        </Box>
                                    )}
                                </Paper>
                            )}
                        </Grid>

                        {/* Right Sidebar: Cover Image and External Links */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ position: 'sticky', top: 20 }}>
                                {/* Cover Image - Desktop only */}
                                {content.cover?.fields.file.url && (
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            mb: 3,
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            display: { xs: 'none', md: 'block' }, // Hide on mobile, show on desktop
                                        }}
                                    >
                                        <CoverImageContainer
                                            onClick={() => handleOpenFullScreen(convertURL(content.cover!.fields.file.url))}
                                        >
                                            {!coverError ? (
                                                <Image
                                                    src={convertURL(content.cover.fields.file.url)}
                                                    alt={`${content.title} Cover`}
                                                    fill
                                                    style={{
                                                        objectFit: 'contain',
                                                        objectPosition: 'center',
                                                    }}
                                                    onError={() => setCoverError(true)}
                                                />
                                            ) : (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        backgroundColor: '#e0e0e0',
                                                        backgroundImage: `
                                                            repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px),
                                                            repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)
                                                        `,
                                                        filter: 'blur(20px)',
                                                    }}
                                                />
                                            )}
                                        </CoverImageContainer>
                                    </Paper>
                                )}

                                {/* External Links */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        backgroundColor: 'white',
                                    }}
                                >
                                    <ExternalLinks
                                        externalLinks={[
                                            content.externalLink1,
                                            content.externalLink2,
                                            content.externalLink3
                                        ]}
                                    />
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Full Screen Image Dialog */}
            <Dialog
                open={openFullScreen}
                onClose={handleCloseFullScreen}
                maxWidth="xl"
                fullWidth
                TransitionComponent={Zoom}
                PaperProps={{
                    sx: {
                        borderRadius: 4,
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
                        minHeight: '60vh',
                        maxHeight: '90vh',
                        backgroundColor: '#1a1a1a',
                        position: 'relative',
                        p: 2,
                        overflow: 'hidden',
                    }}
                >
                    {/* Close button */}
                    <IconButton
                        onClick={handleCloseFullScreen}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 10,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,1)'
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {dialogImageUrl && !dialogImageError ? (
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                maxWidth: '90vw',
                                maxHeight: '85vh',
                            }}
                        >
                            <Image
                                src={dialogImageUrl}
                                alt={content.title}
                                width={1200}
                                height={1600}
                                style={{
                                    width: 'auto',
                                    height: 'auto',
                                    maxWidth: '100%',
                                    maxHeight: '85vh',
                                    objectFit: 'contain',
                                }}
                                onError={() => setDialogImageError(true)}
                            />
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                maxWidth: '90vw',
                                maxHeight: '85vh',
                                backgroundColor: '#e0e0e0',
                                backgroundImage: `
                                    repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px),
                                    repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)
                                `,
                                filter: 'blur(20px)',
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default ContentPage;

export async function getStaticProps() {}
