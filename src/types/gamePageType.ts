export interface GamePageType {
    sys: {
        id: string;
    };
    title: string;
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
    externaLink1: string;
    externaLink2: string;
}
