const vscode = require('vscode');
const ErrorHandler = require('../utils/errorHandler');

/**
 * Controller for candlelight mode - dims lines away from cursor
 */
class CandlelightController {
    constructor() {
        /** @type {vscode.ExtensionContext|null} */
        this.context = null;
        /** @type {vscode.TextEditorDecorationType|null} */
        this.focusDecorationType = null;
        /** @type {vscode.TextEditorDecorationType|null} */
        this.dimDecorationType = null;
        /** @type {vscode.Disposable[]} */
        this.disposables = [];
        /** @type {boolean} */
        this.isEnabled = false; // Disabled by default
        /** @type {number} */
        this.focusRange = 3; // Lines above and below cursor
    }

    /**
     * Initialize the candlelight controller
     * @param {vscode.ExtensionContext} context
     */
    initialize(context) {
        this.context = context;
        this.createDecorationTypes();

        // Listen for cursor position changes
        const selectionDisposable = vscode.window.onDidChangeTextEditorSelection((e) => {
            if (this.isEnabled) {
                this.updateFocus(e);
            }
        });
        this.disposables.push(selectionDisposable);

        ErrorHandler.logInfo('Candlelight Controller initialized');
    }

    /**
     * Create decoration types for focus and dim effects
     */
    createDecorationTypes() {
        if (this.focusDecorationType) {
            this.focusDecorationType.dispose();
        }
        if (this.dimDecorationType) {
            this.dimDecorationType.dispose();
        }

        // Warm candlelight effect for focused lines
        this.focusDecorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 250, 205, 0.08)',
            isWholeLine: true
        });

        // Dim effect for unfocused lines
        this.dimDecorationType = vscode.window.createTextEditorDecorationType({
            opacity: '0.4',
            isWholeLine: true
        });
    }

    /**
     * Update focus based on cursor position
     * @param {vscode.TextEditorSelectionChangeEvent} event
     */
    updateFocus(event) {
        const editor = event.textEditor;
        const cursorLine = event.selections[0].active.line;
        this.applyCandlelightEffect(editor, cursorLine);
    }

    /**
     * Apply candlelight effect to editor
     * @param {vscode.TextEditor} editor
     * @param {number} cursorLine
     */
    applyCandlelightEffect(editor, cursorLine) {
        if (!this.isEnabled) return;

        try {
            const totalLines = editor.document.lineCount;
            const focusRanges = [];
            const dimRanges = [];

            // Calculate focus area
            const focusStart = Math.max(0, cursorLine - this.focusRange);
            const focusEnd = Math.min(totalLines - 1, cursorLine + this.focusRange);

            // Add focus highlighting
            for (let line = focusStart; line <= focusEnd; line++) {
                const lineText = editor.document.lineAt(line).text;
                const range = new vscode.Range(line, 0, line, lineText.length);
                focusRanges.push(range);
            }

            // Dim all other lines
            for (let line = 0; line < totalLines; line++) {
                if (line < focusStart || line > focusEnd) {
                    const lineText = editor.document.lineAt(line).text;
                    const range = new vscode.Range(line, 0, line, lineText.length);
                    dimRanges.push(range);
                }
            }

            if (this.focusDecorationType) {
                editor.setDecorations(this.focusDecorationType, focusRanges);
            }
            if (this.dimDecorationType) {
                editor.setDecorations(this.dimDecorationType, dimRanges);
            }
        } catch (error) {
            ErrorHandler.handleError(error, 'Candlelight effect');
        }
    }

    /**
     * Enable the candlelight effect
     */
    enable() {
        this.isEnabled = true;
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const cursorLine = editor.selection.active.line;
            this.applyCandlelightEffect(editor, cursorLine);
        }
    }

    /**
     * Disable the candlelight effect
     */
    disable() {
        this.isEnabled = false;
        this.clearDecorations();
    }

    /**
     * Toggle the candlelight effect
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
     * Clear all decorations
     */
    clearDecorations() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            if (this.focusDecorationType) {
                editor.setDecorations(this.focusDecorationType, []);
            }
            if (this.dimDecorationType) {
                editor.setDecorations(this.dimDecorationType, []);
            }
        }
    }

    /**
     * Dispose of all resources
     */
    dispose() {
        this.clearDecorations();

        if (this.focusDecorationType) {
            this.focusDecorationType.dispose();
            this.focusDecorationType = null;
        }
        if (this.dimDecorationType) {
            this.dimDecorationType.dispose();
            this.dimDecorationType = null;
        }

        this.disposables.forEach(d => d.dispose());
        this.disposables = [];

        ErrorHandler.logInfo('Candlelight Controller disposed');
    }
}

module.exports = CandlelightController;
