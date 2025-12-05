const vscode = require('vscode');
const { debounce } = require('../utils/animationUtils');
const ErrorHandler = require('../utils/errorHandler');

const DEBOUNCE_DELAY = 100;
const ANIMATION_FRAMES = ['🩸', '💉', '🔴', '⚫'];
const ANIMATION_SPEED = 200;

/**
 * Controller for blood drip animations on error lines
 */
class BloodDripController {
    constructor() {
        /** @type {vscode.ExtensionContext|null} */
        this.context = null;
        /** @type {Map<string, vscode.TextEditorDecorationType>} */
        this.decorationTypes = new Map();
        /** @type {vscode.Disposable[]} */
        this.disposables = [];
        /** @type {boolean} */
        this.isEnabled = true;
        /** @type {boolean} */
        this.isPaused = false;
        /** @type {Function} */
        this.debouncedUpdate = debounce(this.handleDiagnosticsChange.bind(this), DEBOUNCE_DELAY);
    }

    /**
     * Initialize the blood drip controller
     * @param {vscode.ExtensionContext} context
     */
    initialize(context) {
        this.context = context;
        this.createDecorationTypes();

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
                const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
                this.applyDecorationsToEditor(editor, diagnostics);
            }
        });
        this.disposables.push(editorDisposable);

        // Initial check for active editor
        if (vscode.window.activeTextEditor) {
            this.handleDiagnosticsChange([vscode.window.activeTextEditor.document.uri]);
        }

        ErrorHandler.logInfo('Blood Drip Controller initialized');
    }

    /**
     * Create decoration types for different severity levels
     */
    createDecorationTypes() {
        // Dispose existing types
        this.decorationTypes.forEach(type => type.dispose());
        this.decorationTypes.clear();

        // Critical Error - Heavy blood drip with left border
        this.decorationTypes.set('error', vscode.window.createTextEditorDecorationType({
            isWholeLine: true,
            backgroundColor: 'rgba(139, 0, 0, 0.15)',
            borderColor: 'rgba(139, 0, 0, 0.7)',
            borderWidth: '0 0 0 4px',
            borderStyle: 'solid',
            after: {
                contentText: ' 🩸',
                margin: '0 0 0 1em',
                color: '#8B0000'
            },
            overviewRulerColor: '#8B0000',
            overviewRulerLane: vscode.OverviewRulerLane.Right
        }));

        // Warning - Light blood drip
        this.decorationTypes.set('warning', vscode.window.createTextEditorDecorationType({
            isWholeLine: true,
            backgroundColor: 'rgba(139, 0, 0, 0.08)',
            borderColor: 'rgba(139, 0, 0, 0.4)',
            borderWidth: '0 0 0 2px',
            borderStyle: 'solid',
            after: {
                contentText: ' 💧',
                margin: '0 0 0 1em',
                color: '#CD5C5C'
            }
        }));

        // Info - Ghost mark
        this.decorationTypes.set('info', vscode.window.createTextEditorDecorationType({
            isWholeLine: true,
            backgroundColor: 'rgba(211, 211, 211, 0.08)',
            after: {
                contentText: ' 👻',
                margin: '0 0 0 1em',
                color: '#D3D3D3'
            }
        }));
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
            const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
            this.applyDecorationsToEditor(editor, diagnostics);
        }
    }

    /**
     * Apply decorations to editor based on diagnostics
     * @param {vscode.TextEditor} editor
     * @param {vscode.Diagnostic[]} diagnostics
     */
    applyDecorationsToEditor(editor, diagnostics) {
        if (!this.isEnabled) return;

        try {
            const errorRanges = [];
            const warningRanges = [];
            const infoRanges = [];

            diagnostics.forEach(diagnostic => {
                const line = editor.document.lineAt(diagnostic.range.start.line);
                const range = new vscode.Range(
                    diagnostic.range.start.line,
                    0,
                    diagnostic.range.start.line,
                    line.text.length
                );

                switch (diagnostic.severity) {
                    case vscode.DiagnosticSeverity.Error:
                        errorRanges.push(range);
                        this.animateBloodDrip(editor, range);
                        break;
                    case vscode.DiagnosticSeverity.Warning:
                        warningRanges.push(range);
                        break;
                    case vscode.DiagnosticSeverity.Information:
                    case vscode.DiagnosticSeverity.Hint:
                        infoRanges.push(range);
                        break;
                }
            });

            const errorType = this.decorationTypes.get('error');
            const warningType = this.decorationTypes.get('warning');
            const infoType = this.decorationTypes.get('info');

            if (errorType) editor.setDecorations(errorType, errorRanges);
            if (warningType) editor.setDecorations(warningType, warningRanges);
            if (infoType) editor.setDecorations(infoType, infoRanges);
        } catch (error) {
            ErrorHandler.handleError(error, 'Blood drip decoration update');
        }
    }

    /**
     * Animate blood drip effect on a line
     * @param {vscode.TextEditor} editor
     * @param {vscode.Range} range
     */
    animateBloodDrip(editor, range) {
        let frameIndex = 0;

        const animate = () => {
            if (frameIndex >= ANIMATION_FRAMES.length || this.isPaused) return;

            const decorationType = vscode.window.createTextEditorDecorationType({
                after: {
                    contentText: ` ${ANIMATION_FRAMES[frameIndex]}`,
                    margin: '0 0 0 2em',
                    color: '#8B0000'
                }
            });

            editor.setDecorations(decorationType, [range]);

            setTimeout(() => {
                decorationType.dispose();
                frameIndex++;
                animate();
            }, ANIMATION_SPEED);
        };

        // Start animation after brief delay
        setTimeout(() => animate(), 300);
    }

    /**
     * Enable the blood drip effect
     */
    enable() {
        this.isEnabled = true;
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
        if (editor) {
            this.decorationTypes.forEach(type => {
                editor.setDecorations(type, []);
            });
        }
    }

    /**
     * Dispose of all resources
     */
    dispose() {
        this.clearDecorations();
        this.decorationTypes.forEach(type => type.dispose());
        this.decorationTypes.clear();
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];

        ErrorHandler.logInfo('Blood Drip Controller disposed');
    }
}

module.exports = BloodDripController;
