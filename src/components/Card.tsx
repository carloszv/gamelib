import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Content } from '../types/contentTypes';
import { convertURL }from '@/util/funtions';
import { makeStyles } from '@mui/styles';
import { Grid } from '@mui/material';
import { getRatingStyle } from '@/util/funtions';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const useStyles = makeStyles((theme) => ({
   ratingCircle: {
        position: 'absolute',
        bottom: '10px', // Position from the top
        right: '60px', // Position from the right
        display: 'inline-block',
        width: '40px', // Circle width
        height: '40px', // Circle height
        borderRadius: '50%',
        lineHeight: '40px', // Center text vertically
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px', // Font size
        border: '3px solid white', // Thin white border
        '@media (max-width: 430px)': {
            bottom: '5px', // Position from the top
            right: '30px', // Position from the right
            width: '25px', // Circle width
            height: '25px', // Circle height
            lineHeight: '25px', // Center text vertically
            fontSize: '12px', // Font size
        },
    },
    emoji: {
        position: 'absolute',
        top: '0px', // Position from the top
        right: '60px', // Position next to the rating circle
        color: 'yellow',
        padding: '2px',
        width: '20px', // Circle width
        height: '20px', // Circle height
        zIndex: 100,
        '@media (max-width: 430px)': {
            right: '30px', // Position from the right
            width: '20px', // Circle width
            height: '20px', // Circle height
        },
    }
}));

interface CardProps {
    page: Content; // Props to receive a single game page
    className?: string; // Optional className prop for custom styles
}

const Card: React.FC<CardProps> = ({ page, className }) => {
    const classes = useStyles(); // Use the styles

    console.log(page);

    return (
        <Grid item xs={6} sm={4} md={3} key={page.id} className={className}>
            <Link href={`/content/${page.id}`} passHref>
                <div style={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: 'auto', 
                    paddingTop: '75%', 
                    overflow: 'hidden' 
                }}>
                    {page.cover?.fields.file.url ? (
                        <div>
                            <Image
                                src={convertURL(page.cover.fields.file.url)} 
                                alt={page.title}
                                layout="fill" 
                                objectFit="contain" 
                                loading="lazy"
                            />
                            {page.rating && <div className={classes.ratingCircle} style={{ ...getRatingStyle(page.rating) }}>
                                {page.rating}
                            </div>}
                            {page.masterpiece && (
                                <EmojiEventsIcon className={classes.emoji} />
                            )}
                        </div>
                    ) : null}
                
                </div>
                <h2>{page.title}</h2>
            </Link>
        </Grid>
    );
};

export default Card; 