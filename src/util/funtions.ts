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