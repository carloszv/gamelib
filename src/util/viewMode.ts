import { ViewMode } from '@/components/contexts/SearchContext';

export const CATEGORY_PATHS = ['collection', 'wishlist', 'games', 'friends'] as const;
export type CategoryPath = (typeof CATEGORY_PATHS)[number];

export const categoryToViewMode = (category: string | undefined): ViewMode | null => {
    switch (category) {
        case 'collection':
            return 'collection';
        case 'wishlist':
            return 'wishlist';
        case 'games':
            return 'completed';
        case 'friends':
            return 'friends';
        default:
            return null;
    }
};

export const viewModeToCategory = (mode: ViewMode): CategoryPath => {
    switch (mode) {
        case 'collection':
            return 'collection';
        case 'wishlist':
            return 'wishlist';
        case 'completed':
            return 'games';
        case 'friends':
            return 'friends';
    }
};

export const isValidCategory = (category: string): category is CategoryPath => {
    return (CATEGORY_PATHS as readonly string[]).includes(category);
};
