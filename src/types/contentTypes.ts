export interface ContentImage {
    sys: {
        id: string; // Unique identifier for the asset
    };
    fields: {
        description: string;
        file: {
            url: string,
            details: {
                image: {
                    height: number,
                    width: number
                }
                size: number
            },
            fileName: string,
            contentType: string
        };
        title: string
    }
}

export interface Content {
    title: string; // Title of the content
    platform?: string;
    cover?: ContentImage; // Cover image
    article?: {
        content: any; // Rich text content in JSON format
        data: any;
    };
    rating?: number;
    masterpiece?: boolean;
    id?: string; // Custom ID field
    videoReview?: string;
    externalLink1?: string;
    externalLink2?: string;
    externalLink3?: string;
} 