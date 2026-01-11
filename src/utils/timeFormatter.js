/**
 * Formats a given number of seconds into a M:SS or MM:SS string.
 * @param {number} seconds - The time in seconds.
 * @returns {string} The formatted time string.
 */
export const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, '0')}`;
};
