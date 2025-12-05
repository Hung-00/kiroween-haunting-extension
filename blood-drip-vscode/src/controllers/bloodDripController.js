const vscode = require('vscode');
const { createBloodDripStyle } = require('../models/decorationStyles');
const { debounce, createAnimationLoop } = require('../utils/animationUtils');
const ErrorHandler = require('../utils/errorHandler');

const DEBOUNCE_DELAY = 100;
const ANIMATION_FPS = 30;

/**
 * Controller for blood drip animations on error lines
 */
class BloodDripController {
    constructor() {
        /** @type {vscode.ExtensionContext|null} */
        this.context = null;
        /** @type {vscode.TextEditorDecorationType|null} */
        this.decorationType = null;
        /** @type {Map<string, {line: number, frame: number}>} */
        this.errorLines = new Map();
        /** @type {vscode.Disposable[]} */
        this.disposables = [];
        /** @type {boolean} */
        this.isEnabled = true;
        /** @type {boolean} */
        this.isPaused = false;
        /** @type {Object|null} */
        this.animationLoop = null;
        /** @type {Function} */
        this.debouncedUpdate = debounce(this.handleDiagnosticsChange.bind(this), DEBOUNCE_DELAY);
    }

    /**
     * Initialize the blood drip controller
     * @param {vscode.ExtensionContext} context
     */
    initialize(context) {
        this.context = context;
        this.createDecorationType();

        // Listen for diagnostic changes
        const diagnosticDisposable = vscode.languages.onDidChangeDiagnostics((e) => {
            if (this.isEnabled) {
                this.debouncedUpdate(e.uris);
            }
        });
        this.disposables.push(diagnosticDisposable);

        // Listen for active editor changes
        const editorDisposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (this.isEnabled && editor) {
                this.updateDecorations(editor);
            }
        });
        this.disposables.push(editorDisposable);

        // Start animation loop
        this.animationLoop = createAnimationLoop(() => {
            if (!this.isPaused) {
                this.animateFrame();
            }
        }, ANIMATION_FPS);
        this.animationLoop.start();

        // Initial check for active editor
        if (vscode.window.activeTextEditor) {
            this.handleDiagnosticsChange([vscode.window.activeTextEditor.document.uri]);
        }

        ErrorHandler.logInfo('Blood Drip Controller initialized');
    }


    /**
     * Create decoration type for blood drip effect
     */
    createDecorationType() {
        if (this.decorationType) {
            this.decorationType.dispose();
        }

        this.decorationType = vscode.window.createTextEditorDecorationType(
            createBloodDripStyle(1)
        );
    }

    /**
     * Handle diagnostic changes
     * @param {vscode.Uri[]} uris - URIs that changed
     */
    handleDiagnosticsChange(uris) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const documentUri = editor.document.uri.toString();
        const affectsCurrentDocument = uris.some(uri => uri.toString() === documentUri);

        if (affectsCurrentDocument) {
            this.updateErrorLines(editor);
            this.updateDecorations(editor);
        }
    }

    /**
     * Update the list of error lines
     * @param {vscode.TextEditor} editor
     */
    updateErrorLines(editor) {
        const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
        const newErrorLines = new Map();

        diagnostics
            .filter(d => d.severity === vscode.DiagnosticSeverity.Error)
            .forEach(diagnostic => {
                const line = diagnostic.range.start.line;
                const key = `${line}`;

                // Preserve existing animation frame if line already had error
                const existing = this.errorLines.get(key);
                newErrorLines.set(key, {
                    line: line,
                    frame: existing ? existing.frame : 0
                });
            });

        this.errorLines = newErrorLines;
    }

    /**
     * Update decorations for the given editor
     * @param {vscode.TextEditor} editor
     */
    updateDecorations(editor) {
        if (!this.isEnabled || !this.decorationType) {
            return;
        }

        try {
            const ranges = [];

            this.errorLines.forEach((errorInfo) => {
                const range = new vscode.Range(errorInfo.line, 0, errorInfo.line, 0);
                ranges.push(range);
            });

            editor.setDecorations(this.decorationType, ranges);
        } catch (error) {
            ErrorHandler.handleError(error, 'Blood drip decoration update');
        }
    }

    /**
     * Animate one frame of the blood drip effect
     */
    animateFrame() {
        // Increment frame counters for animation
        this.errorLines.forEach((errorInfo, key) => {
            errorInfo.frame = (errorInfo.frame + 1) % 30;
        });

        // Refresh decorations if there are error lines
        const editor = vscode.window.activeTextEditor;
        if (editor && this.errorLines.size > 0) {
            this.updateDecorations(editor);
        }
    }

    /**
     * Enable the blood drip effect
     */
    enable() {
        this.isEnabled = true;
        if (this.animationLoop) {
            this.animationLoop.start();
        }
        if (vscode.window.activeTextEditor) {
            this.handleDiagnosticsChange([vscode.window.activeTextEditor.document.uri]);
        }
    }

    /**
     * Disable the blood drip effect
     */
    disable() {
        this.isEnabled = false;
        this.clearDecorations();
    }

    /**
     * Pause the blood drip animation
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * Resume the blood drip animation
     */
    resume() {
        this.isPaused = false;
    }

    /**
     * Clear all decorations
     */
    clearDecorations() {
        const editor = vscode.window.activeTextEditor;
        if (editor && this.decorationType) {
            editor.setDecorations(this.decorationType, []);
        }
        this.errorLines.clear();
    }

    /**
     * Dispose of all resources
     */
    dispose() {
        if (this.animationLoop) {
            this.animationLoop.stop();
            this.animationLoop = null;
        }

        this.clearDecorations();

        if (this.decorationType) {
            this.decorationType.dispose();
            this.decorationType = null;
        }

        this.disposables.forEach(d => d.dispose());
        this.disposables = [];

        ErrorHandler.logInfo('Blood Drip Controller disposed');
    }
}

module.exports = BloodDripController;
