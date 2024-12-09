import { Content } from "@/types/contentTypes";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 4,
        border: '1px solid #ff4081',
        transition: 'all 0.3s ease',
        padding: 7,
        marginLeft: 20
    },
    counter: {
        marginLeft: -10,
        marginTop: 30,
        backgroundColor: '#ff4081',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 6px',
        fontSize: '0.7rem'
    }
}));

type WishlistButtonProps = {
    showWishList: boolean
    gamePagesWishList: Content[]
    handleShowWishlist: () => void
}

const WishlistButton = ({ showWishList, gamePagesWishList, handleShowWishlist }: WishlistButtonProps) => {
    const classes = useStyles();

    return (
        <div 
            className={classes.wrapper} 
            style={{
                backgroundColor: showWishList ? '#ff4081' : 'transparent',
                color: showWishList ? 'white' : 'inherit',
                cursor: gamePagesWishList.length > 0 ? 'pointer' : 'not-allowed',
                opacity: gamePagesWishList.length > 0 ? 1 : 0.5,
            }}
            onClick={handleShowWishlist}
            title={gamePagesWishList.length > 0 ? (showWishList ? "Hide Wishlist" : "Show Wishlist") : "No items in wishlist"}
        >
            {showWishList ? <FavoriteIcon fontSize='large' htmlColor='white' /> : <FavoriteBorderIcon fontSize='large' htmlColor='#ff4081'/>}
            {gamePagesWishList.length > 0 && (
                <span className={classes.counter}>
                    {gamePagesWishList.length}
                </span>
            )}
        </div>
    )
}

export default WishlistButton