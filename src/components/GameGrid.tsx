import React from 'react';
import { Grid } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { Content } from '../types/contentTypes';
import { convertURL } from '@/util/funtions';
import styles from './GameGrid.module.css'; // Import the CSS Module

interface GameGridProps {
    filteredGamePages: Content[]; // Props to receive filtered game pages
}

const GameGrid: React.FC<GameGridProps> = ({ filteredGamePages }) => {
    return (
        <Grid 
            container 
            spacing={2} 
            justifyContent="center" 
            className={styles.gridContainer} // Apply the container class
        >
            {filteredGamePages.length > 0 ? (
                filteredGamePages.map((page) => (
                    <Grid item xs={6} sm={4} md={3} key={page.id} className={styles.gridItem}> {/* Ensure xs is set to 6 for 2 items per row */}
                        <Link href={`/content/${page.id}`} passHref>
                            <div style={{ 
                                position: 'relative', 
                                width: '100%', 
                                height: 'auto', 
                                paddingTop: '75%', 
                                overflow: 'hidden' 
                            }}>
                                {page.cover?.fields.file.url ? <Image
                                    src={convertURL(page.cover.fields.file.url)} 
                                    alt={page.title}
                                    layout="fill" 
                                    objectFit="contain" 
                                    loading="lazy"
                                /> : null}
                            </div>
                            <h2>{page.title}</h2>
                        </Link>
                    </Grid>
                ))
            ) : (
                <div style={{ textAlign: 'center', width: '100%' }}>
                    <h2>No matches</h2> {/* Message when no matches are found */}
                </div>
            )}
        </Grid>
    );
};

export default GameGrid; 