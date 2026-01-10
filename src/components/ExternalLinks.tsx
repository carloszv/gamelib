import React from 'react';
import { Box, Card, CardContent, Typography, styled, alpha } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

type ExternalLinksProps = {
    externalLinks?: Array<string | undefined>
}

interface LinkPreview {
    url: string;
    domain: string;
    favicon: string;
    title: string;
}

const extractDomain = (url: string): string => {
    try {
        // Ensure URL has protocol for URL constructor
        const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') 
            ? url 
            : `https://${url}`;
        const parsedUrl = new URL(urlWithProtocol);
        return parsedUrl.hostname.replace(/^www\./, '');
    } catch (error) {
        // Fallback: try to extract domain manually
        const match = url.match(/https?:\/\/(?:www\.)?([^\/]+)/);
        if (match) {
            return match[1].replace(/^www\./, '');
        }
        return 'external-link.com';
    }
};

const getFaviconUrl = (url: string): string => {
    try {
        const domain = extractDomain(url);
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (error) {
        return '/default-favicon.png';
    }
};

const getLinkTitle = (url: string): string => {
    try {
        // Ensure URL has protocol for URL constructor
        const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') 
            ? url 
            : `https://${url}`;
        const parsedUrl = new URL(urlWithProtocol);
        const hostname = parsedUrl.hostname.replace(/^www\./, '');
        const parts = hostname.split('.');
        if (parts.length >= 2) {
            return parts[parts.length - 2].charAt(0).toUpperCase() + 
                   parts[parts.length - 2].slice(1);
        }
        return hostname;
    } catch (error) {
        // Fallback: try to extract domain manually
        const match = url.match(/https?:\/\/(?:www\.)?([^\/]+)/);
        if (match) {
            const hostname = match[1].replace(/^www\./, '');
            const parts = hostname.split('.');
            if (parts.length >= 2) {
                return parts[parts.length - 2].charAt(0).toUpperCase() + 
                       parts[parts.length - 2].slice(1);
            }
            return hostname;
        }
        return 'External Link';
    }
};

const PreviewCard = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 320,
    height: 120,
    borderRadius: theme.shape.borderRadius * 2,
    transition: theme.transitions.create(['transform', 'box-shadow'], {
        duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
    },
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));


const FaviconContainer = styled(Box)(({ theme }) => ({
    width: 56,
    height: 56,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(2),
    flexShrink: 0,
    overflow: 'hidden',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const ExternalLinks = ({ externalLinks }: ExternalLinksProps) => {
    const links = externalLinks?.filter(Boolean);

    // Compute previews synchronously to avoid hydration mismatch
    // Ensure consistent results on both server and client
    const linkPreviews: LinkPreview[] = React.useMemo(() => {
        if (!links || links.length === 0) return [];
        return links.map((link) => {
            if (!link) return null;
            try {
                return {
                    url: link,
                    domain: extractDomain(link),
                    favicon: getFaviconUrl(link),
                    title: getLinkTitle(link),
                };
            } catch (error) {
                // Fallback for any parsing errors
                return {
                    url: link,
                    domain: 'external-link.com',
                    favicon: '/default-favicon.png',
                    title: 'External Link',
                };
            }
        }).filter((preview): preview is LinkPreview => preview !== null);
    }, [links]);

    if (!links || links.length === 0 || linkPreviews.length === 0) return null;

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%',
            gap: 2,
            mt: 3,
            mb: 2,
        }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                External Links
            </Typography>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                alignItems: 'center',
            }}>
                {linkPreviews.map((preview, index) => (
                    <PreviewCard key={index} elevation={2}>
                        <Box
                            component="a"
                            href={preview.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                                textDecoration: 'none', 
                                color: 'inherit', 
                                display: 'flex',
                                alignItems: 'center',
                                height: '100%',
                                paddingTop: '0px',
                                paddingBottom: '8px',
                                paddingLeft: '16px',
                                paddingRight: '16px',
                                cursor: 'pointer',
                            }}
                        >
                            <FaviconContainer>
                                <img
                                    src={preview.favicon}
                                    alt={preview.title}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        objectFit: 'contain',
                                    }}
                                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                        // Fallback to a default icon if favicon fails to load
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </FaviconContainer>
                            <CardContent sx={{ 
                                flex: 1, 
                                padding: '0 !important',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                minWidth: 0,
                            }}>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        fontWeight: 600,
                                        mb: 0.5,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {preview.title}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            color: 'text.secondary',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {preview.domain}
                                    </Typography>
                                    <OpenInNewIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                </Box>
                            </CardContent>
                        </Box>
                    </PreviewCard>
                ))}
            </Box>
        </Box>
    );
};

export default ExternalLinks;