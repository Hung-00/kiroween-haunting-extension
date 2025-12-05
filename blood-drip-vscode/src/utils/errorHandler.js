const vscode = require('vscode');

/**
 * Error handler for the Blood Drip extension
 */
class ErrorHandler {
    /**
     * Handle and log errors
     * @param {Error} error - The error to handle
     * @param {string} context - Context where error occurred
     */
    static handleError(error, context) {
        console.error(`[Blood Drip] ${context}:`, error);

        if (error.name === 'ResourceError') {
            this.handleResourceError(error);
        } else if (error.name === 'PerformanceError') {
            this.handlePerformanceError(error);
        }
    }

    /**
     * Handle resource-related errors
     * @param {Error} error - Resource error
     */
    static handleResourceError(error) {
        vscode.window.showWarningMessage(
            `Blood Drip: Resource issue - ${error.message}`
        );
    }

    /**
     * Handle performance-related errors (silent)
     * @param {Error} error - Performance error
     */
    static handlePerformanceError(error) {
        console.warn('[Blood Drip] Performance issue:', error.message);
    }

    /**
     * Log info message
     * @param {string} message - Message to log
     */
    static logInfo(message) {
        console.log(`[Blood Drip] ${message}`);
    }
}

module.exports = ErrorHandler;
