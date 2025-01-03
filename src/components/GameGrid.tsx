import React from 'react';
import { Grid } from '@mui/material';
import Card from './Card'; // Import the new Card component
import { Content } from '../types/contentTypes';
import { makeStyles } from '@mui/styles';
import Image from 'next/image';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        marginTop: '20px',
        maxWidth: '1200px',
        width: '100%',
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '12px',
    },
    cardWrapper: {
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            zIndex: 10
        }
    },
}));

interface GameGridProps {
    filteredGamePages: Content[]; // Props to receive filtered game pages
    showTitle: boolean;
}

const GameGrid: React.FC<GameGridProps> = ({ filteredGamePages, showTitle = true }) => {
    const classes = useStyles();
    return (
        <Grid 
            container 
            className={classes.gridContainer}
        >
            {filteredGamePages.length > 0 ? (
                filteredGamePages.map((page) => (
                    <Grid key={page.id} item xs={5.5} sm={4} md={2} className={classes.cardWrapper} >
                        <Card page={page} showTitle={showTitle} />
                    </Grid>
                ))
            ) : (
                <div className="flex justify-center items-center w-full max-w-full px-4">
                    <div className="w-full max-w-md">
                        <Image
                            src="/not_found.png"
                            alt="not found"
                            layout="responsive"
                            width={600}
                            height={600}
                            className="brightness-90" // Equivalent to filter: brightness(0.9)
                        />
                    </div>
                </div>
            )}
        </Grid>
    );
};

export default GameGrid; 