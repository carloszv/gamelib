export interface GamePageType {
    sys: {
        id: string;
    };
    title: string;
    platform: string;
    cover: {
        url: string;
        title: string;
    };
    article: {
        content: any;
        data: any;
    };
    rating: number;
    masterpiece: boolean;
    wishlist: boolean;
    videoReview: string;
    externalLink1: string;
    externalLink2: string;
    externalLink3: string;
}
