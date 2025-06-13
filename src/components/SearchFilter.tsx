import React, { useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
    FormControl,
    InputAdornment,
    Menu,
    MenuItem,
    Checkbox,
    ListItemText,
    Typography,
    Divider,
    Box,
    IconButton,
    styled
} from '@mui/material';
import { useSearch } from './contexts/SearchContext';

const StyledMenu = styled(Menu)({
    '& .MuiPaper-root': {
        width: 250,
        maxHeight: 400,
    },
});

const FilterGroup = styled(Box)({
    padding: '8px 16px',
    '&:not(:last-child)': {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    },
});

const FilterTitle = styled(Typography)({
    fontWeight: 600,
    marginBottom: 8,
    color: '#666',
});

interface SearchFilterProps {
    PLATFORMS: string[];
    masterpieceCount: number;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ PLATFORMS, masterpieceCount }) => {    
    const { 
        selectedPlatforms, 
        setSelectedPlatforms,
        showCompleted,
        setShowCompleted,
        showNotCompleted,
        setShowNotCompleted,
        showMasterpiece,
        setShowMasterpiece
    } = useSearch();
    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handlePlatformChange = (platform: string) => {
        const currentIndex = selectedPlatforms.indexOf(platform);
        const newSelectedPlatforms = [...selectedPlatforms];

        if (currentIndex === -1) {
            // If this platform wasn't selected, just add it
            newSelectedPlatforms.push(platform);
        } else {
            // If this platform was selected and it's the last one, find an unselected one to check
            if (newSelectedPlatforms.length === 1) {
                const unselectedPlatform = PLATFORMS.find(p => !newSelectedPlatforms.includes(p));
                if (unselectedPlatform) {
                    newSelectedPlatforms.push(unselectedPlatform);
                }
            }
            newSelectedPlatforms.splice(currentIndex, 1);
        }

        setSelectedPlatforms(newSelectedPlatforms);
    };

    const handleCompletionChange = (isCompleted: boolean) => {
        if (isCompleted) {
            // If clicking on Completed
            if (showCompleted && !showNotCompleted) {
                // If Completed is checked and Not Completed is unchecked, check Not Completed
                setShowNotCompleted(true);
            }
            setShowCompleted(!showCompleted);
        } else {
            // If clicking on Not Completed
            if (showNotCompleted && !showCompleted) {
                // If Not Completed is checked and Completed is unchecked, check Completed
                setShowCompleted(true);
            }
            setShowNotCompleted(!showNotCompleted);
        }
    };

    // Initialize platforms if none are selected
    React.useEffect(() => {
        if (selectedPlatforms.length === 0) {
            setSelectedPlatforms(PLATFORMS);
        }
    }, [PLATFORMS, selectedPlatforms.length, setSelectedPlatforms]);

    return (
        <>
            <IconButton
                onClick={handleClick}
                style={{ marginLeft: 10 }}
                color="primary"
            >
                <FilterListIcon />
            </IconButton>
            <StyledMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <FilterGroup>
                    <FilterTitle variant="subtitle2">Console Type</FilterTitle>
                    {PLATFORMS.map((platform) => (
                        <MenuItem key={platform} onClick={() => handlePlatformChange(platform)}>
                            <Checkbox
                                checked={selectedPlatforms.includes(platform)}
                                size="small"
                            />
                            <ListItemText primary={platform} />
                        </MenuItem>
                    ))}
                </FilterGroup>

                <FilterGroup>
                    <FilterTitle variant="subtitle2">More</FilterTitle>
                    <MenuItem onClick={() => handleCompletionChange(true)}>
                        <Checkbox
                            checked={showCompleted}
                            size="small"
                        />
                        <ListItemText primary="Completed" />
                    </MenuItem>
                    <MenuItem onClick={() => handleCompletionChange(false)}>
                        <Checkbox
                            checked={showNotCompleted}
                            size="small"
                        />
                        <ListItemText primary="Not Completed" />
                    </MenuItem>
                    <MenuItem 
                        onClick={() => masterpieceCount > 0 && setShowMasterpiece(!showMasterpiece)}
                        disabled={masterpieceCount === 0}
                    >
                        <Checkbox
                            checked={showMasterpiece}
                            size="small"
                            disabled={masterpieceCount === 0}
                        />
                        <ListItemText 
                            primary={`Masterpiece${masterpieceCount > 0 ? ` (${masterpieceCount})` : ''}`} 
                        />
                    </MenuItem>
                </FilterGroup>
            </StyledMenu>
        </>
    );
};

export default SearchFilter;