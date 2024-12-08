import React from 'react';
import { Box, Link, styled } from '@mui/material';

type ExternalLinksProps = {
    externalLinks?: Array<string | undefined>
}

const extractLinkName = (url: string) => {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname.replace(/^www\./, '');
        return hostname.split('.')[0].charAt(0).toUpperCase() + 
               hostname.split('.')[0].slice(1);
    } catch (error) {
        return 'External Link';
    }
};

const StyledLink = styled(Link)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.shape.borderRadius,
    textDecoration: 'none',
    color: theme.palette.text.primary,
    fontWeight: 500,
    width: '100%', 
    marginBottom: theme.spacing(1),
    transition: theme.transitions.create(['background-color', 'transform'], {
        duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
        backgroundColor: theme.palette.grey[300],
        transform: 'translateX(5px)',
        boxShadow: theme.shadows[2],
    },
    '&::before': {
        content: '"🌐"',
        marginRight: theme.spacing(1),
    },
}));

const ExternalLinks = ({ externalLinks }: ExternalLinksProps) => {
    const links = externalLinks?.filter(Boolean);
  
    return links ? (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', // Center links horizontally
        justifyContent: 'center', 
        width: '100%',
        maxWidth: 300, // Consistent width
        margin: '0 auto', // Center the entire container
        gap: 1 
      }}>
        {links.map((link, index) => (
          <StyledLink 
            key={index} 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {link ? extractLinkName(link) : `External Link ${index + 1}`}
          </StyledLink>
        ))}
      </Box>
    ) : null;
};

export default ExternalLinks;