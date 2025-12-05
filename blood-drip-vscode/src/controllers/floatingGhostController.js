const vscode = require('vscode');
const ErrorHandler = require('../utils/errorHandler');

const GHOST_EMOJIS = ['👻', '💀', '🦇', '🕷️', '👁️'];
const MIN_APPEAR_INTERVAL = 5000;  // 5 seconds minimum
const MAX_APPEAR_INTERVAL = 15000; // 15 seconds maximum
const GHOST_DURATION = 2000;       // Ghost visible for 2 seconds
const MOVE_INTERVAL = 300;         // Move every 300ms

/**
 * Controller for floating ghost that randomly appears in the editor
 */
class FloatingGhostController {
    constructor() {
        /** @type {vscode.ExtensionContext|null} */
        this.context = null;
        /** @type {vscode.TextEditorDecorationType|null} */
        this.ghostDecorationType = null;
        /** @type {NodeJS.Timeout|null} */
        this.appearTimeout = null;
        /** @type {NodeJS.Timeout|null} */
        this.moveInterval = null;
        /** @type {NodeJS.Timeout|null} */
        this.hideTimeout = null;
        /** @type {boolean} */
        this.isEnabled = true;
        /** @type {boolean} */
        this.isGhostVisible = false;
        /** @type {{line: number, character: number}|null} */
        this.currentPosition = null;
    }

    /**
     * Initialize the floating ghost controller
     * @param {vscode.ExtensionContext} context
     */
    initialize(context) {
        this.context = context;
        this.scheduleNextGhost();
        ErrorHandler.logInfo('Floating Ghost Controller initialized');
    }

    /**
     * Schedule the next ghost appearance
     */
    scheduleNextGhost() {
        if (!this.isEnabled) return;

        // Random interval between min and max
        const interval = MIN_APPEAR_INTERVAL + 
            Math.random() * (MAX_APPEAR_INTERVAL - MIN_APPEAR_INTERVAL);

        this.appearTimeout = setTimeout(() => {
            this.spawnGhost();
        }, interval);
    }

    /**
     * Spawn a ghost at a random position
     */
    spawnGhost() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !this.isEnabled) {
            this.scheduleNextGhost();
            return;
        }

        try {
            const document = editor.document;
            const lineCount = document.lineCount;

            if (lineCount === 0) {
                this.scheduleNextGhost();
                return;
            }

            // Pick random starting position
            const randomLine = Math.floor(Math.random() * lineCount);
            const lineText = document.lineAt(randomLine).text;
            const randomChar = Math.floor(Math.random() * Math.max(1, lineText.length));

            this.currentPosition = { line: randomLine, character: randomChar };
            this.isGhostVisible = true;

            // Pick random ghost emoji
            const ghostEmoji = GHOST_EMOJIS[Math.floor(Math.random() * GHOST_EMOJIS.length)];

            // Create decoration
            this.createGhostDecoration(ghostEmoji);
            this.renderGhost(editor);

            // Start moving the ghost
            this.startMoving(editor);

            // Schedule ghost to disappear
            this.hideTimeout = setTimeout(() => {
                this.hideGhost(editor);
            }, GHOST_DURATION);

        } catch (error) {
            ErrorHandler.handleError(error, 'Ghost spawn');
            this.scheduleNextGhost();
        }
    }


    /**
     * Create ghost decoration type
     * @param {string} emoji
     */
    createGhostDecoration(emoji) {
        if (this.ghostDecorationType) {
            this.ghostDecorationType.dispose();
        }

        this.ghostDecorationType = vscode.window.createTextEditorDecorationType({
            after: {
                contentText: ` ${emoji} `,
                color: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(100, 100, 100, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                margin: '0 0 0 0.5em',
                fontWeight: 'bold'
            }
        });
    }

    /**
     * Render ghost at current position
     * @param {vscode.TextEditor} editor
     */
    renderGhost(editor) {
        if (!this.ghostDecorationType || !this.currentPosition) return;

        try {
            const { line, character } = this.currentPosition;
            
            // Validate position
            if (line >= editor.document.lineCount) return;
            
            const lineText = editor.document.lineAt(line).text;
            const safeChar = Math.min(character, lineText.length);

            const range = new vscode.Range(line, safeChar, line, safeChar);
            editor.setDecorations(this.ghostDecorationType, [range]);
        } catch (error) {
            ErrorHandler.handleError(error, 'Ghost render');
        }
    }

    /**
     * Start moving the ghost around
     * @param {vscode.TextEditor} editor
     */
    startMoving(editor) {
        this.moveInterval = setInterval(() => {
            if (!this.isGhostVisible || !this.currentPosition) return;

            const document = editor.document;
            const lineCount = document.lineCount;

            // Random movement direction
            const deltaLine = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const deltaChar = Math.floor(Math.random() * 5) - 2; // -2 to 2

            let newLine = this.currentPosition.line + deltaLine;
            let newChar = this.currentPosition.character + deltaChar;

            // Clamp to valid range
            newLine = Math.max(0, Math.min(lineCount - 1, newLine));
            const lineText = document.lineAt(newLine).text;
            newChar = Math.max(0, Math.min(lineText.length, newChar));

            this.currentPosition = { line: newLine, character: newChar };
            this.renderGhost(editor);
        }, MOVE_INTERVAL);
    }

    /**
     * Hide the ghost and schedule next appearance
     * @param {vscode.TextEditor} editor
     */
    hideGhost(editor) {
        this.isGhostVisible = false;
        this.currentPosition = null;

        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }

        if (this.ghostDecorationType) {
            editor.setDecorations(this.ghostDecorationType, []);
            this.ghostDecorationType.dispose();
            this.ghostDecorationType = null;
        }

        // Schedule next ghost
        this.scheduleNextGhost();
    }

    /**
     * Enable the floating ghost
     */
    enable() {
        this.isEnabled = true;
        this.scheduleNextGhost();
    }

    /**
     * Disable the floating ghost
     */
    disable() {
        this.isEnabled = false;
        this.clearAllTimers();

        const editor = vscode.window.activeTextEditor;
        if (editor && this.ghostDecorationType) {
            editor.setDecorations(this.ghostDecorationType, []);
        }
    }

    /**
     * Toggle the floating ghost
     * @returns {boolean} New enabled state
     */
    toggle() {
        if (this.isEnabled) {
            this.disable();
        } else {
            this.enable();
        }
        return this.isEnabled;
    }

    /**
     * Clear all timers
     */
    clearAllTimers() {
        if (this.appearTimeout) {
            clearTimeout(this.appearTimeout);
            this.appearTimeout = null;
        }
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    /**
     * Dispose of all resources
     */
    dispose() {
        this.clearAllTimers();

        if (this.ghostDecorationType) {
            this.ghostDecorationType.dispose();
            this.ghostDecorationType = null;
        }

        ErrorHandler.logInfo('Floating Ghost Controller disposed');
    }
}

module.exports = FloatingGhostController;
