import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import ContentForm from './ContentForm';

const AddButton: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

    const correctPassword = process.env.NEXT_PUBLIC_PASSWORD; // Get the password from .env.local

    const handleOpen = () => {
        setOpen(true);
        setIsPasswordCorrect(false);
        setPassword('');
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handlePasswordSubmit = () => {
        if (password === correctPassword) {
            setIsPasswordCorrect(true);
        } else {
            alert('Incorrect password'); // Alert for incorrect password
        }
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Add Content
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Enter Password</DialogTitle>
                <DialogContent>
                    {isPasswordCorrect ? (
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    ) : (
                        <ContentForm onClose={handleClose} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    {!isPasswordCorrect ? (
                        <Button onClick={handlePasswordSubmit} color="primary">
                            Submit
                        </Button>
                    ) : null}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddButton; 