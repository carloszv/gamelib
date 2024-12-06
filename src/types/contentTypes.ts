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
    cover?: ContentImage; // Cover image
    article?: {
        json: any; // Rich text content in JSON format
    };
    rating?: number;
    masterpiece?: boolean;
    id?: string; // Custom ID field
    externalLink1?: string
    externalLink2?: string
} 