import React from 'react';
import { TextField, InputAdornment, IconButton, styled, alpha } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { useSearch } from './contexts/SearchContext';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        borderRadius: '12px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
        },
        '&.Mui-focused': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
        },
        '& fieldset': {
            borderColor: 'transparent',
        },
        '&:hover fieldset': {
            borderColor: alpha(theme.palette.primary.main, 0.3),
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
    '& .MuiInputBase-input': {
        fontSize: '1rem',
        padding: '12px 16px',
        color: theme.palette.text.primary,
        '&::placeholder': {
            color: alpha(theme.palette.text.primary, 0.6),
            opacity: 1,
        },
    },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: alpha(theme.palette.text.primary, 0.6),
    '&:hover': {
        color: theme.palette.text.primary,
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
}));

const SearchBar: React.FC<{ onSearch?: (query: string) => void }> = ({ onSearch }) => {
    const { searchQuery, setSearchQuery } = useSearch();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        onSearch?.(query);
    };

    const handleClear = () => {
        setSearchQuery('');
        onSearch?.('');
    };

    return (
        <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleChange}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.primary' }} />
                    </InputAdornment>
                ),
                endAdornment: searchQuery && (
                    <InputAdornment position="end">
                        <StyledIconButton
                            size="small"
                            onClick={handleClear}
                            edge="end"
                        >
                            <ClearIcon fontSize="small" />
                        </StyledIconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchBar;