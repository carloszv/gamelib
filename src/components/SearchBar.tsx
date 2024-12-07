import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    const handleClear = () => {
        setSearchQuery('');
        onSearch('');
    };

    return (
        <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleChange}
            InputProps={{
                style: {
                    fontSize: '16px',
                    maxWidth: 200
                },
                endAdornment: searchQuery && (
                    <InputAdornment position="end">
                        <IconButton
                            size="small"
                            onClick={handleClear}
                            edge="end"
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
};

export default SearchBar;