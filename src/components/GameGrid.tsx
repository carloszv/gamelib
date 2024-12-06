import React from 'react';
import { Grid } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { Content } from '../types/contentTypes';
import { convertURL } from '@/util/funtions';

interface GameGridProps {
    filteredGamePages: Content[]; // Props to receive filtered game pages
}

const GameGrid: React.FC<GameGridProps> = ({ filteredGamePages }) => {
    return (
        <Grid 
            container 
            spacing={2} 
            justifyContent="center" 
            style={{ 
                marginTop: 20,
                maxWidth: '1200px', 
                width: '100%', 
                padding: '0 16px' 
            }}
        >
            {filteredGamePages.length > 0 ? (
                filteredGamePages.map((page) => (
                    <Grid item xs={6} sm={3} key={page.id} style={{ 
                        border: '1px solid blue', // Add blue border
                        borderRadius: '10px', // Round corners
                        textAlign: 'center', // Center the text
                        padding: '10px', // Optional: Add padding for better spacing
                        overflow: 'hidden', // Ensure overflow is hidden to maintain frame shape
                        cursor: 'pointer', // Change cursor to pointer on hover
                        margin: '10px' // Add margin between grid items
                    }}>
                        <Link href={`/content/${page.id}`} passHref> {/* Link to the page */}
                            <div style={{ 
                                position: 'relative', // Position relative for the Image to fill
                                width: '100%', // Full width of the grid item
                                height: 'auto', // Set height to auto to maintain aspect ratio
                                paddingTop: '75%', // Maintain aspect ratio (e.g., 4:3 ratio)
                                overflow: 'hidden' // Hide overflow to maintain shape
                            }}>
                                {page.cover?.fields.file.url ? <Image
                                    src={convertURL(page.cover.fields.file.url)} // Access the cover image URL directly
                                    alt={page.title}
                                    layout="fill" // Use fill layout to cover the entire div
                                    objectFit="contain" // Ensure the image is fully visible
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