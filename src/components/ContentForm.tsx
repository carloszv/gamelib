import React, { useState } from 'react';
import { Button, TextField, Grid } from '@mui/material';
import { Content } from '../types/contentTypes'; // Import the Content type
import { fetchCreateContent } from '../api/api'; // Import the function to create content

interface ContentFormProps {
    onClose: () => void; // Prop to close the dialog
}

const ContentForm: React.FC<ContentFormProps> = ({ onClose }) => {
    const [formData, setFormData] = useState<Content>({
        title: '',
        cover: undefined,
        article: undefined,
        rating: undefined,
        masterpiece: false,
        id: undefined,
        externalLink1: '',
        externalLink2: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        await fetchCreateContent(formData); // Call the function to create content
        onClose(); // Close the dialog after submission
    };

    return (
        <form>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Title"
                        name="title"
                        fullWidth
                        variant="outlined"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="External Link 1"
                        name="externalLink1"
                        fullWidth
                        variant="outlined"
                        value={formData.externalLink1}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="External Link 2"
                        name="externalLink2"
                        fullWidth
                        variant="outlined"
                        value={formData.externalLink2}
                        onChange={handleChange}
                    />
                </Grid>
                {/* Add more fields as necessary for the Content type */}
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default ContentForm; 