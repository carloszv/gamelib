import React, { useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
    FormControl,
    InputAdornment,
    MenuItem,
    Select,
    styled
} from '@mui/material';
import { useSearch } from './contexts/SearchContext';

// Create a styled Select component with explicit cursor styling
const StyledSelect = styled(Select)({
    cursor: 'pointer',
    '& .MuiSelect-select': {
        cursor: 'pointer',
    }
});

const SearchFilter: React.FC<{
    PLATFORMS: string[]
}> = ({ PLATFORMS }) => {    
    const { selectedPlatform, setSelectedPlatform } = useSearch();
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleChange = (event: any) => {
        setSelectedPlatform(event.target.value);
        handleClose();
    }

    const truncatePlatform = (platform: string) => {
        return platform.length > 3 
            ? `${platform.slice(0, 3)}...` 
            : platform;
    };

    return (
        <div 
            onClick={handleOpen}
            style={{ 
                cursor: 'pointer',
            }}
        >
            <FormControl
                variant="outlined"
                fullWidth
                style={{
                    marginLeft: '10px',
                }}
            >
                <StyledSelect
                    open={isOpen}
                    onClose={handleClose}
                    value={selectedPlatform}
                    onChange={handleChange}
                    displayEmpty
                    startAdornment={
                        <InputAdornment position="start">
                            <FilterListIcon style={{marginRight: 10}}/>
                        </InputAdornment>
                    }
                    renderValue={(selected) => {
                        if (!selected) {
                            return null;
                        }
                        return truncatePlatform(selected as string);
                    }}
                >
                    <MenuItem value="">
                        <em>All</em>
                    </MenuItem>
                    {PLATFORMS.map(platform => (
                        <MenuItem key={platform} value={platform}>
                            {platform}
                        </MenuItem>
                    ))}
                </StyledSelect>
            </FormControl>
        </div>
    );
};

export default SearchFilter;