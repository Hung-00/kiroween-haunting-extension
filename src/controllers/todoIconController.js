const vscode = require('vscode');
const path = require('path');
const { TodoIconVariant } = require('../models/types');
const ErrorHandler = require('../utils/errorHandler');

// Extended keywords like the reference implementation
const SPECIAL_KEYWORDS = ['TODO', 'FIXME', 'HACK', 'XXX', 'BUG', 'DEPRECATED', 'WARNING'];
const KEYWORD_PATTERN = new RegExp(`\\b(${SPECIAL_KEYWORDS.join('|')})\\b`, 'gi');

/**
 * Controller for spooky TODO/special comment icons in the gutter
 */
class TodoIconController {
    constructor() {
        /** @type {vscode.ExtensionContext|null} */
        this.context = null;
        /** @type {vscode.TextEditorDecorationType|null} */
        this.gutterDecorationType = null;
        /** @type {vscode.TextEditorDecorationType|null} */
        this.textDecorationType = null;
        /** @type {string} */
        this.iconVariant = TodoIconVariant.Skull;
        /** @type {vscode.Disposable[]} */
        this.disposables = [];
        /** @type {boolean} */
        this.isEnabled = true;
        /** @type {NodeJS.Timeout|null} */
        this.updateTimeout = null;
    }

    /**
     * Initialize the TODO icon controller
     * @param {vscode.ExtensionContext} context
     */
    initialize(context) {
        this.context = context;
        this.createDecorationTypes();

        // Listen for document changes with debounce
        const changeDisposable = vscode.workspace.onDidChangeTextDocument((e) => {
            if (this.isEnabled) {
                this.debouncedScan();
            }
        });
        this.disposables.push(changeDisposable);

        // Listen for active editor changes
        const editorDisposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (this.isEnabled && editor) {
                this.scanForSpecialComments(editor);
            }
        });
        this.disposables.push(editorDisposable);

        // Initial scan for active editor
        if (vscode.window.activeTextEditor) {
            this.scanForSpecialComments(vscode.window.activeTextEditor);
        }

        ErrorHandler.logInfo('TODO Icon Controller initialized');
    }

    /**
     * Create decoration types
     */
    createDecorationTypes() {
        if (this.gutterDecorationType) {
            this.gutterDecorationType.dispose();
        }
        if (this.textDecorationType) {
            this.textDecorationType.dispose();
        }

        const iconPath = path.join(
            this.context.extensionPath,
            'resources',
            'icons',
            `${this.iconVariant}.svg`
        );

        // Gutter icon decoration
        this.gutterDecorationType = vscode.window.createTextEditorDecorationType({
            gutterIconPath: vscode.Uri.file(iconPath),
            gutterIconSize: '16px'
        });

        // Text decoration with skull prefix (like reference)
        this.textDecorationType = vscode.window.createTextEditorDecorationType({
            before: {
                contentText: '💀 ',
                color: '#FFD700',
                fontWeight: 'bold'
            },
            backgroundColor: 'rgba(255, 215, 0, 0.1)'
        });
    }


    /**
     * Debounced scan for special comments
     */
    debouncedScan() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }

        this.updateTimeout = setTimeout(() => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                this.scanForSpecialComments(editor);
            }
        }, 500);
    }

    /**
     * Scan document for special comments (TODO, FIXME, etc.)
     * @param {vscode.TextEditor} editor
     */
    scanForSpecialComments(editor) {
        if (!this.isEnabled) return;

        try {
            const document = editor.document;
            const text = document.getText();
            const gutterRanges = [];
            const textRanges = [];

            let match;
            while ((match = KEYWORD_PATTERN.exec(text)) !== null) {
                const position = document.positionAt(match.index);
                const line = position.line;

                // Gutter icon at line start
                const gutterRange = new vscode.Range(line, 0, line, 0);
                gutterRanges.push(gutterRange);

                // Text decoration at keyword position
                const keywordEnd = document.positionAt(match.index + match[0].length);
                const textRange = new vscode.Range(position, keywordEnd);
                textRanges.push(textRange);
            }

            if (this.gutterDecorationType) {
                editor.setDecorations(this.gutterDecorationType, gutterRanges);
            }
            if (this.textDecorationType) {
                editor.setDecorations(this.textDecorationType, textRanges);
            }
        } catch (error) {
            ErrorHandler.handleError(error, 'TODO icon scan');
        }
    }

    /**
     * Set the icon variant
     * @param {string} variant - Icon variant (skull, ghost, tombstone)
     */
    setIconVariant(variant) {
        if (this.iconVariant !== variant) {
            this.iconVariant = variant;
            this.createDecorationTypes();

            // Refresh decorations
            if (vscode.window.activeTextEditor) {
                this.scanForSpecialComments(vscode.window.activeTextEditor);
            }
        }
    }

    /**
     * Enable the TODO icon effect
     */
    enable() {
        this.isEnabled = true;
        if (vscode.window.activeTextEditor) {
            this.scanForSpecialComments(vscode.window.activeTextEditor);
        }
    }

    /**
     * Disable the TODO icon effect
     */
    disable() {
        this.isEnabled = false;
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            if (this.gutterDecorationType) {
                editor.setDecorations(this.gutterDecorationType, []);
            }
            if (this.textDecorationType) {
                editor.setDecorations(this.textDecorationType, []);
            }
        }
    }

    /**
     * Dispose of all resources
     */
    dispose() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }

        this.disposables.forEach(d => d.dispose());
        this.disposables = [];

        if (this.gutterDecorationType) {
            this.gutterDecorationType.dispose();
            this.gutterDecorationType = null;
        }
        if (this.textDecorationType) {
            this.textDecorationType.dispose();
            this.textDecorationType = null;
        }

        ErrorHandler.logInfo('TODO Icon Controller disposed');
    }
}

module.exports = TodoIconController;
