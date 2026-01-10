export const convertURL = (url: string) => {
    return `https:${url}`
}

export const getRatingStyle = (rating: number) => {
    let backgroundColor = '';
    if (rating >= 1 && rating < 5) {
        backgroundColor = 'rgba(255, 255, 0, 0.5)'; // Yellow
    } else if (rating >= 5 && rating < 7) {
        backgroundColor = 'rgba(255, 165, 0, 0.5)'; // Orange
    } else if (rating >= 7 && rating < 9) {
        backgroundColor = 'rgba(144, 238, 144, 0.5)'; // Light Green
    } else if (rating >= 9) {
        backgroundColor = 'rgba(0, 128, 0, 0.5)'; // Dark Green
    } else {
        backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Red for 0
    }
    return { backgroundColor };
};

// Convert title to URL-friendly slug
export const titleToSlug = (title: string): string => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Convert slug back to title (for finding games)
// Note: This is approximate since we can't perfectly reverse the slug
// We'll need to match by comparing slugs
export const slugToTitle = (slug: string): string => {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};