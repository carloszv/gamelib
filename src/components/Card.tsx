import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Content } from '../types/contentTypes';
import { convertURL } from '@/util/funtions';
import { makeStyles } from '@mui/styles';
import { Grid, Typography } from '@mui/material';
import { getRatingStyle } from '@/util/funtions';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const useStyles = makeStyles((theme) => ({
    card: {
        position: 'relative', 
        width: '100%', 
        paddingTop: '135%', // More vertical aspect ratio
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
        backgroundColor: '#f0f0f0',
        transition: 'all 0.3s ease',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
        padding: '10px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    ratingCircle: {
        display: 'inline-block',
        width: '40px',
        height: '40px',
        lineHeight: '40px',
        textAlign: 'center',
        borderRadius: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px',
        border: '2px solid white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
    },
    title: {
        marginTop: '10px',
        textAlign: 'center',
        fontWeight: 600,
        transition: 'color 0.3s ease',
        '&:hover': {
            color: '#1976d2' // Add a hover effect to the title
        }
    },
    emoji: {
        color: 'gold',
        filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))',
        width: '30px',
        height: '30px'
    }
}));

interface CardProps {
    page: Content;
    className?: string;
    showTitle?: boolean;
    index?: number; // Add index prop to determine if image is above the fold
}

const Card: React.FC<CardProps> = ({ page, showTitle = true, index = 0 }) => {
    const classes = useStyles();
    // Consider first 6 images as above the fold (adjust this number based on your layout)
    const isAboveFold = index < 6;

    return (
        <Link href={`/content/${page.id}`} passHref style={{ textDecoration: 'none' }}>
            {page.cover?.fields.file.url ? (
                <div className={classes.card}>
                    <Image
                        src={convertURL(page.cover.fields.file.url)} 
                        alt={page.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ 
                            objectFit: "fill",
                            filter: 'brightness(0.9)' // Slightly darken the image
                        }}
                        loading={isAboveFold ? "eager" : "lazy"}
                        priority={isAboveFold}
                    />
                    <div className={classes.imageOverlay}>
                        {page.rating && (
                            <div 
                                className={classes.ratingCircle} 
                                style={{ ...getRatingStyle(page.rating) }}
                            >
                                {page.rating}
                            </div>
                        )}
                        {page.masterpiece && (
                            <EmojiEventsIcon className={classes.emoji} />
                        )}
                    </div>
                </div>
            ) : null}
            {showTitle && <Typography 
                variant="h6" 
                className={classes.title}
                color="textPrimary"
            >
                {page.title}
            </Typography>}
        </Link>
    );
};

export default Card;