import React from 'react';
import { Grid } from '@mui/material';
import Card from './Card'; // Import the new Card component
import { Content } from '../types/contentTypes';
import styles from './GameGrid.module.css'; // Import the CSS Module

interface GameGridProps {
    filteredGamePages: Content[]; // Props to receive filtered game pages
}

const GameGrid: React.FC<GameGridProps> = ({ filteredGamePages }) => {
    return (
        <Grid 
            container 
            className={styles.gridContainer}
        >
            {filteredGamePages.length > 0 ? (
                filteredGamePages.map((page) => (
                    <Card page={page} key={page.id} className={styles.gridItem} /> // Pass styles as a prop
                ))
            ) : (
                <div style={{ textAlign: 'center', width: '100%' }}>
                    <h2>No matches</h2>
                </div>
            )}
        </Grid>
    );
};

export default GameGrid; 