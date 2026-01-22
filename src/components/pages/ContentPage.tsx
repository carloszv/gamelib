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
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
    Snackbar,
    Alert,
    Tooltip,
    useMediaQuery,
    useTheme
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';


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
    const [mounted, setMounted] = useState(false);
    const [openFullScreen, setOpenFullScreen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [coverError, setCoverError] = useState(false);
    const [dialogImageError, setDialogImageError] = useState(false);
    const [dialogImageUrl, setDialogImageUrl] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle fallback state consistently
    if (router.isFallback) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="secondary" size={60} thickness={4} />
            </Container>
        );
    }

    if (!content) return null;

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

    const handleWhatsAppShare = () => {
        if (typeof window !== 'undefined') {
            const url = window.location.href;
            const text = `Check out ${content.title}!`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            window.open(whatsappUrl, '_blank');
        }
    };

    const handleCopyLink = async () => {
        if (typeof window !== 'undefined') {
            try {
                const url = window.location.href;
                await navigator.clipboard.writeText(url);
                setSnackbarOpen(true);
            } catch (err) {
                console.error('Failed to copy link:', err);
            }
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    // Only render content after mount to prevent hydration mismatches
    if (!mounted) {
        return (
            <Layout title={content.title || 'Loading...'}>
                <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress color="secondary" size={60} thickness={4} />
                </Container>
            </Layout>
        );
    }

    return (
        <Layout title={content.title}>
            <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
                <Container maxWidth="lg" className="content-container-responsive" sx={{ py: 3 }}>
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
                    <HeroSection className="hero-section-mobile">
                        {content.cover?.fields.file.url && !imageError ? (
                            isMobile ? (
                                <Image
                                    src={convertURL(content.cover.fields.file.url)}
                                    alt={content.title}
                                    width={800}
                                    height={1067}
                                    className="hero-cover-image"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        objectPosition: 'center',
                                    }}
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <Image
                                    src={convertURL(content.cover.fields.file.url)}
                                    alt={content.title}
                                    fill
                                    className="hero-cover-image"
                                    style={{
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                    }}
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
                            <ScoreBadge className="score-badge-responsive" sx={getRatingStyle(content.rating)}>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flex: 1 }}>
                                <Typography 
                                    variant="h3" 
                                    component="h1" 
                                    className="content-title-responsive"
                                    sx={{ 
                                        fontWeight: 700,
                                        fontSize: '2rem',
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
                            {/* Share Buttons */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Tooltip title="Share on WhatsApp">
                                    <IconButton
                                        onClick={handleWhatsAppShare}
                                        sx={{
                                            backgroundColor: 'white',
                                            '&:hover': {
                                                backgroundColor: alpha('#25D366', 0.1),
                                            },
                                        }}
                                    >
                                        <WhatsAppIcon sx={{ color: '#25D366' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Copy link">
                                    <IconButton
                                        onClick={handleCopyLink}
                                        sx={{
                                            backgroundColor: 'white',
                                            '&:hover': {
                                                backgroundColor: alpha('#000', 0.05),
                                            },
                                        }}
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
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
                                    className="review-paper-responsive"
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        backgroundColor: 'white',
                                        mb: 3,
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        className="review-title-responsive"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 3,
                                            color: '#1a1a1a',
                                            fontSize: '1.5rem',
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
                                    className="video-paper-responsive"
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        backgroundColor: 'white',
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        component="h3"
                                        className="video-title-responsive"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 3,
                                            color: '#1a1a1a',
                                            fontSize: '1.5rem',
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
                                        className="cover-sidebar-desktop"
                                        sx={{
                                            p: 2,
                                            mb: 3,
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                        }}
                                    >
                                        <CoverImageContainer
                                            className="cover-image-container"
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

            {/* Snackbar for copy link notification */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Link copied to clipboard!
                </Alert>
            </Snackbar>
        </Layout>
    );
};

export default ContentPage;

export async function getStaticProps() {}
