const vscode = require('vscode');
const ErrorHandler = require('../utils/errorHandler');

const MAX_TRAIL_SEGMENTS = 20;
const TRAIL_FADE_DURATION = 5000; // 5 seconds like the reference
const TRAIL_UPDATE_INTERVAL = 100;

/**
 * Controller for ethereal cursor movement trails (ghost cursor)
 */
class CursorTrailController {
    constructor() {
        /** @type {vscode.ExtensionContext|null} */
        this.context = null;
        /** @type {Array<{line: number, character: number, timestamp: number}>} */
        this.cursorHistory = [];
        /** @type {vscode.TextEditorDecorationType|null} */
        this.decorationType = null;
        /** @type {vscode.Disposable[]} */
        this.disposables = [];
        /** @type {boolean} */
        this.isEnabled = true;
        /** @type {boolean} */
        this.isPaused = false;
        /** @type {NodeJS.Timeout|null} */
        this.updateInterval = null;
    }

    /**
     * Initialize the cursor trail controller
     * @param {vscode.ExtensionContext} context
     */
    initialize(context) {
        this.context = context;
        this.createDecorationType();

        // Listen for cursor position changes
        const selectionDisposable = vscode.window.onDidChangeTextEditorSelection((e) => {
            if (this.isEnabled && !this.isPaused && e.selections.length > 0) {
                this.trackCursor(e);
            }
        });
        this.disposables.push(selectionDisposable);

        // Start the update loop for fading trails
        this.startUpdateLoop();

        ErrorHandler.logInfo('Cursor Trail Controller initialized');
    }

    /**
     * Create decoration type for ghost trail
     */
    createDecorationType() {
        if (this.decorationType) {
            this.decorationType.dispose();
        }

        this.decorationType = vscode.window.createTextEditorDecorationType({
            after: {
                contentText: '👻',
                color: 'rgba(255, 255, 255, 0.3)',
                margin: '0 0 0 0.5em'
            }
        });
    }

    /**
     * Track cursor movement
     * @param {vscode.TextEditorSelectionChangeEvent} event
     */
    trackCursor(event) {
        const position = event.selections[0].active;

        // Add to history
        this.cursorHistory.push({
            line: position.line,
            character: position.character,
            timestamp: Date.now()
        });

        // Keep only recent positions
        if (this.cursorHistory.length > MAX_TRAIL_SEGMENTS) {
            this.cursorHistory.shift();
        }

        // Remove old ghosts (older than fade duration)
        const now = Date.now();
        this.cursorHistory = this.cursorHistory.filter(pos =>
            now - pos.timestamp < TRAIL_FADE_DURATION
        );

        this.renderGhostTrail(event.textEditor);
    }


    /**
     * Render ghost trail at previous cursor positions
     * @param {vscode.TextEditor} editor
     */
    renderGhostTrail(editor) {
        if (!this.decorationType) return;

        try {
            const ghostRanges = [];
            const now = Date.now();

            this.cursorHistory.forEach((pos, index) => {
                // Skip the most recent position (current cursor)
                if (index === this.cursorHistory.length - 1) return;

                // Calculate opacity based on position in history and age
                const baseOpacity = 0.1 + (index / this.cursorHistory.length) * 0.3;
                const age = now - pos.timestamp;
                const fadeOpacity = Math.max(0, 1 - (age / TRAIL_FADE_DURATION));
                const finalOpacity = baseOpacity * fadeOpacity;

                // Check if line exists
                if (pos.line >= editor.document.lineCount) return;

                const lineText = editor.document.lineAt(pos.line).text;
                const character = Math.min(pos.character, lineText.length);

                const range = new vscode.Range(pos.line, character, pos.line, character);

                ghostRanges.push({
                    range,
                    renderOptions: {
                        after: {
                            contentText: '·',
                            color: `rgba(200, 200, 200, ${finalOpacity})`,
                            margin: '0',
                            fontWeight: 'bold'
                        }
                    }
                });
            });

            editor.setDecorations(this.decorationType, ghostRanges);
        } catch (error) {
            ErrorHandler.handleError(error, 'Ghost trail rendering');
        }
    }

    /**
     * Start the update loop for fading trails
     */
    startUpdateLoop() {
        if (this.updateInterval) return;

        this.updateInterval = setInterval(() => {
            if (!this.isPaused && this.isEnabled) {
                this.updateTrails();
            }
        }, TRAIL_UPDATE_INTERVAL);
    }

    /**
     * Stop the update loop
     */
    stopUpdateLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Update trail segments (remove expired)
     */
    updateTrails() {
        const now = Date.now();
        const editor = vscode.window.activeTextEditor;

        // Remove expired segments
        this.cursorHistory = this.cursorHistory.filter(pos =>
            now - pos.timestamp < TRAIL_FADE_DURATION
        );

        // Re-render if we have an editor
        if (editor && this.cursorHistory.length > 0) {
            this.renderGhostTrail(editor);
        }
    }

    /**
     * Enable the cursor trail effect
     */
    enable() {
        this.isEnabled = true;
        this.startUpdateLoop();
    }

    /**
     * Disable the cursor trail effect
     */
    disable() {
        this.isEnabled = false;
        this.clearAllTrails();
    }

    /**
     * Pause the cursor trail effect
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * Resume the cursor trail effect
     */
    resume() {
        this.isPaused = false;
    }

    /**
     * Clear all trail segments
     */
    clearAllTrails() {
        this.cursorHistory = [];
        const editor = vscode.window.activeTextEditor;
        if (editor && this.decorationType) {
            editor.setDecorations(this.decorationType, []);
        }
    }

    /**
     * Dispose of all resources
     */
    dispose() {
        this.stopUpdateLoop();
        this.clearAllTrails();

        if (this.decorationType) {
            this.decorationType.dispose();
            this.decorationType = null;
        }

        this.disposables.forEach(d => d.dispose());
        this.disposables = [];

        ErrorHandler.logInfo('Cursor Trail Controller disposed');
    }
}

module.exports = CursorTrailController;
