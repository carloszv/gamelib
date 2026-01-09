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
    styled,
    alpha
} from '@mui/material';
import { useSearch } from './contexts/SearchContext';

const StyledMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        width: 280,
        maxHeight: 400,
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        marginTop: 8,
        '& .MuiList-root': {
            padding: '8px 0',
        },
    },
}));

const FilterGroup = styled(Box)(({ theme }) => ({
    padding: '12px 16px',
    '&:not(:last-child)': {
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    },
}));

const FilterTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: 12,
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    padding: '8px 16px',
    margin: '2px 8px',
    borderRadius: 8,
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
    '&.Mui-selected': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.16),
        },
    },
}));

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    padding: 8,
    '&.Mui-checked': {
        color: theme.palette.primary.main,
    },
}));

const FilterButton = styled(IconButton)(({ theme }) => ({
    width: 40,
    height: 40,
    marginLeft: 10,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
    },
    transition: 'all 0.2s ease-in-out',
}));

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

    // Note: Platform initialization is now handled in SearchContext with default values

    return (
        <>
            <FilterButton
                onClick={handleClick}
                size="small"
            >
                <FilterListIcon />
            </FilterButton>
            <StyledMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <FilterGroup>
                    <FilterTitle variant="subtitle2">Console Type</FilterTitle>
                    {PLATFORMS.map((platform) => (
                        <StyledMenuItem 
                            key={platform} 
                            onClick={() => handlePlatformChange(platform)}
                            selected={selectedPlatforms.includes(platform)}
                        >
                            <StyledCheckbox
                                checked={selectedPlatforms.includes(platform)}
                                size="small"
                            />
                            <ListItemText 
                                primary={platform}
                                primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                    fontWeight: selectedPlatforms.includes(platform) ? 600 : 400,
                                }}
                            />
                        </StyledMenuItem>
                    ))}
                </FilterGroup>

                <FilterGroup>
                    <FilterTitle variant="subtitle2">More</FilterTitle>
                    <StyledMenuItem 
                        onClick={() => handleCompletionChange(true)}
                        selected={showCompleted}
                    >
                        <StyledCheckbox
                            checked={showCompleted}
                            size="small"
                        />
                        <ListItemText 
                            primary="Completed"
                            primaryTypographyProps={{
                                fontSize: '0.875rem',
                                fontWeight: showCompleted ? 600 : 400,
                            }}
                        />
                    </StyledMenuItem>
                    <StyledMenuItem 
                        onClick={() => handleCompletionChange(false)}
                        selected={showNotCompleted}
                    >
                        <StyledCheckbox
                            checked={showNotCompleted}
                            size="small"
                        />
                        <ListItemText 
                            primary="Not Completed"
                            primaryTypographyProps={{
                                fontSize: '0.875rem',
                                fontWeight: showNotCompleted ? 600 : 400,
                            }}
                        />
                    </StyledMenuItem>
                    <StyledMenuItem 
                        onClick={() => masterpieceCount > 0 && setShowMasterpiece(!showMasterpiece)}
                        disabled={masterpieceCount === 0}
                        selected={masterpieceCount > 0 && showMasterpiece}
                    >
                        <StyledCheckbox
                            checked={masterpieceCount > 0 && showMasterpiece}
                            size="small"
                            disabled={masterpieceCount === 0}
                        />
                        <ListItemText 
                            primary={`Masterpiece${masterpieceCount > 0 ? ` (${masterpieceCount})` : ''}`}
                            primaryTypographyProps={{
                                fontSize: '0.875rem',
                                fontWeight: masterpieceCount > 0 && showMasterpiece ? 600 : 400,
                                color: masterpieceCount === 0 ? 'text.disabled' : 'text.primary',
                            }}
                        />
                    </StyledMenuItem>
                </FilterGroup>
            </StyledMenu>
        </>
    );
};

export default SearchFilter;