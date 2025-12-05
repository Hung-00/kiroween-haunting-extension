/**
 * Animation utility functions
 */

const TARGET_FPS = 30;
const FRAME_DURATION = 1000 / TARGET_FPS;

/**
 * Creates a throttled animation loop
 * @param {Function} callback - Function to call each frame
 * @param {number} fps - Target frames per second
 * @returns {Object} Animation controller with start/stop methods
 */
function createAnimationLoop(callback, fps = TARGET_FPS) {
    let intervalId = null;
    let isRunning = false;
    const frameDuration = 1000 / fps;

    return {
        start() {
            if (isRunning) return;
            isRunning = true;
            intervalId = setInterval(callback, frameDuration);
        },
        stop() {
            if (!isRunning) return;
            isRunning = false;
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        },
        isRunning() {
            return isRunning;
        }
    };
}

/**
 * Calculates fade opacity based on elapsed time
 * @param {number} startTime - Timestamp when fade started
 * @param {number} duration - Total fade duration in ms
 * @param {number} startOpacity - Starting opacity value
 * @param {number} endOpacity - Ending opacity value
 * @returns {number} Current opacity value
 */
function calculateFadeOpacity(startTime, duration, startOpacity = 0.5, endOpacity = 0.1) {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    return startOpacity - (progress * (startOpacity - endOpacity));
}

/**
 * Debounce function to limit rapid calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

module.exports = {
    TARGET_FPS,
    FRAME_DURATION,
    createAnimationLoop,
    calculateFadeOpacity,
    debounce
};
