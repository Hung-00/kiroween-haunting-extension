const vscode = require('vscode');
const { createCursorTrailStyle } = require('../models/decorationStyles');
const { calculateFadeOpacity } = require('../utils/animationUtils');
const ErrorHandler = require('../utils/errorHandler');

const MAX_TRAIL_SEGMENTS = 10;
const TRAIL_FADE_DURATION = 800;
const TRAIL_UPDATE_INTERVAL = 50;
const START_OPACITY = 0.5;
const END_OPACITY = 0.1;

/**
 * Controller for ethereal cursor movement trails
 */
class CursorTrailController {
    constructor() {
        /** @type {vscode.ExtensionContext|null} */
        this.context = null;
        /** @type {Array<{position: vscode.Position, timestamp: number, decorationType: vscode.TextEditorDecorationType}>} */
        this.trailSegments = [];
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

        // Listen for cursor position changes
        const selectionDisposable = vscode.window.onDidChangeTextEditorSelection((e) => {
            if (this.isEnabled && !this.isPaused && e.selections.length > 0) {
                this.onCursorMove(e.textEditor, e.selections[0].active);
            }
        });
        this.disposables.push(selectionDisposable);

        // Start the update loop for fading trails
        this.startUpdateLoop();

        ErrorHandler.logInfo('Cursor Trail Controller initialized');
    }


    /**
     * Start the update loop for fading trails
     */
    startUpdateLoop() {
        if (this.updateInterval) return;

        this.updateInterval = setInterval(() => {
            if (!this.isPaused) {
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
     * Handle cursor movement
     * @param {vscode.TextEditor} editor
     * @param {vscode.Position} position
     */
    onCursorMove(editor, position) {
        try {
            // Create a new trail segment at the cursor position
            const decorationType = vscode.window.createTextEditorDecorationType(
                createCursorTrailStyle(START_OPACITY)
            );

            const segment = {
                position: position,
                timestamp: Date.now(),
                decorationType: decorationType
            };

            // Apply decoration
            const range = new vscode.Range(position, position.translate(0, 1));
            editor.setDecorations(decorationType, [range]);

            this.trailSegments.push(segment);

            // Limit trail segments
            while (this.trailSegments.length > MAX_TRAIL_SEGMENTS) {
                const oldSegment = this.trailSegments.shift();
                if (oldSegment) {
                    oldSegment.decorationType.dispose();
                }
            }
        } catch (error) {
            ErrorHandler.handleError(error, 'Cursor trail creation');
        }
    }

    /**
     * Update trail segments (fade and remove expired)
     */
    updateTrails() {
        const now = Date.now();
        const editor = vscode.window.activeTextEditor;

        if (!editor) return;

        // Remove expired segments
        this.trailSegments = this.trailSegments.filter((segment) => {
            const age = now - segment.timestamp;

            if (age >= TRAIL_FADE_DURATION) {
                segment.decorationType.dispose();
                return false;
            }

            return true;
        });
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
        this.trailSegments.forEach((segment) => {
            segment.decorationType.dispose();
        });
        this.trailSegments = [];
    }

    /**
     * Dispose of all resources
     */
    dispose() {
        this.stopUpdateLoop();
        this.clearAllTrails();

        this.disposables.forEach(d => d.dispose());
        this.disposables = [];

        ErrorHandler.logInfo('Cursor Trail Controller disposed');
    }
}

module.exports = CursorTrailController;
