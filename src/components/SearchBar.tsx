import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useSearch } from './contexts/SearchContext';

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