import React, { useState } from 'react';
import { 
    IconButton, 
    Drawer, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemText, 
    styled, 
    alpha,
    Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CollectionsIcon from '@mui/icons-material/Collections';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    width: 40,
    height: 40,
    marginLeft: 10,
    backgroundColor: alpha(theme.palette.secondary.main, 0.08),
    color: theme.palette.secondary.main,
    '&:hover': {
        backgroundColor: alpha(theme.palette.secondary.main, 0.12),
    },
    transition: 'all 0.2s ease-in-out',
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: 280,
        paddingTop: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
    },
}));

const StyledListItemButton = styled(ListItemButton)<{ selected?: boolean }>(({ theme, selected }) => ({
    margin: theme.spacing(0.5, 1),
    borderRadius: '8px',
    backgroundColor: selected ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
    '&:hover': {
        backgroundColor: selected 
            ? alpha(theme.palette.primary.main, 0.15) 
            : alpha(theme.palette.action.hover, 0.05),
    },
    transition: 'all 0.2s ease-in-out',
}));

const MenuItemContent = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
});

const Counter = styled('span')(({ theme }) => ({
    marginLeft: 'auto',
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    borderRadius: '12px',
    padding: '4px 8px',
    fontSize: '0.75rem',
    fontWeight: 600,
    minWidth: '24px',
    textAlign: 'center',
}));

type ViewMode = 'collection' | 'wishlist' | 'completed';

type MenuButtonProps = {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    collectionCount: number;
    wishlistCount: number;
    completedCount: number;
}

const MenuButton: React.FC<MenuButtonProps> = ({ 
    viewMode, 
    onViewModeChange, 
    collectionCount,
    wishlistCount,
    completedCount
}) => {
    const [open, setOpen] = useState(false);

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (mode: ViewMode) => {
        onViewModeChange(mode);
        handleClose();
    };

    const menuItems = [
        {
            mode: 'collection' as ViewMode,
            label: 'Collection',
            icon: <CollectionsIcon />,
            count: collectionCount,
            enabled: true,
        },
        {
            mode: 'wishlist' as ViewMode,
            label: 'Wishlist',
            icon: <FavoriteIcon />,
            count: wishlistCount,
            enabled: true,
        },
        {
            mode: 'completed' as ViewMode,
            label: 'Played Games',
            icon: <CheckCircleIcon />,
            count: completedCount,
            enabled: true,
        },
    ];

    return (
        <>
            <StyledIconButton
                onClick={handleToggle}
                size="small"
                title="View Options"
            >
                <MenuIcon fontSize="small" />
            </StyledIconButton>

            <StyledDrawer
                anchor="right"
                open={open}
                onClose={handleClose}
                ModalProps={{
                    keepMounted: true, // Better mobile performance
                }}
            >
                <List sx={{ paddingTop: 2 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.mode} disablePadding>
                            <StyledListItemButton
                                selected={viewMode === item.mode}
                                onClick={() => item.enabled && handleSelect(item.mode)}
                                disabled={!item.enabled}
                                sx={{
                                    opacity: item.enabled ? 1 : 0.5,
                                    cursor: item.enabled ? 'pointer' : 'not-allowed',
                                }}
                            >
                                <MenuItemContent>
                                    {item.icon}
                                    <ListItemText 
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontWeight: viewMode === item.mode ? 600 : 400,
                                        }}
                                    />
                                    {item.count > 0 && (
                                        <Counter>{item.count}</Counter>
                                    )}
                                </MenuItemContent>
                            </StyledListItemButton>
                        </ListItem>
                    ))}
                </List>
            </StyledDrawer>
        </>
    );
};

export default MenuButton;
