import { Content } from "@/types/contentTypes";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { alpha, IconButton, styled } from '@mui/material';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    width: 40,
    height: 40,
    marginLeft: 10,
    backgroundColor: alpha(theme.palette.secondary.main, 0.08),
    color: theme.palette.secondary.main,
    '&:hover': {
        backgroundColor: alpha(theme.palette.secondary.main, 0.12),
    },
    '&.Mui-disabled': {
        backgroundColor: alpha(theme.palette.action.disabled, 0.08),
        color: theme.palette.action.disabled,
    },
    transition: 'all 0.2s ease-in-out',
}));

const Counter = styled('span')(({ theme }) => ({
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '0.7rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

type WishlistButtonProps = {
    showWishList: boolean
    gamePagesWishList: Content[]
    handleShowWishlist: () => void
}

const WishlistButton = ({ showWishList, gamePagesWishList, handleShowWishlist }: WishlistButtonProps) => {
    return (
        <StyledIconButton
            onClick={handleShowWishlist}
            disabled={gamePagesWishList.length === 0}
            size="small"
            title={gamePagesWishList.length > 0 ? (showWishList ? "Hide Wishlist" : "Show Wishlist") : "No items in wishlist"}
        >
            {showWishList ? 
                <FavoriteIcon fontSize="small" /> : 
                <FavoriteBorderIcon fontSize="small" />
            }
            {gamePagesWishList.length > 0 && (
                <Counter>
                    {gamePagesWishList.length}
                </Counter>
            )}
        </StyledIconButton>
    );
};

export default WishlistButton;