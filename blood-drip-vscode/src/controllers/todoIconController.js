const vscode = require('vscode');
const path = require('path');
const { TodoIconVariant } = require('../models/types');
const ErrorHandler = require('../utils/errorHandler');

const TODO_PATTERN = /\bTODO\b/i;

/**
 * Controller for spooky TODO icons in the gutter
 */
class TodoIconController {
    constructor() {
        /** @type {vscode.ExtensionContext|null} */
        this.context = null;
        /** @type {vscode.TextEditorDecorationType|null} */
        this.decorationType = null;
        /** @type {string} */
        this.iconVariant = TodoIconVariant.Skull;
        /** @type {vscode.Disposable[]} */
        this.disposables = [];
        /** @type {boolean} */
        this.isEnabled = true;
    }

    /**
     * Initialize the TODO icon controller
     * @param {vscode.ExtensionContext} context
     */
    initialize(context) {
        this.context = context;
        this.createDecorationType();

        // Listen for document changes
        const changeDisposable = vscode.workspace.onDidChangeTextDocument((e) => {
            if (this.isEnabled) {
                const editor = vscode.window.activeTextEditor;
                if (editor && editor.document === e.document) {
                    this.updateDecorations(editor);
                }
            }
        });
        this.disposables.push(changeDisposable);

        // Listen for active editor changes
        const editorDisposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (this.isEnabled && editor) {
                this.updateDecorations(editor);
            }
        });
        this.disposables.push(editorDisposable);

        // Initial decoration for active editor
        if (vscode.window.activeTextEditor) {
            this.updateDecorations(vscode.window.activeTextEditor);
        }

        ErrorHandler.logInfo('TODO Icon Controller initialized');
    }


    /**
     * Create decoration type with current icon variant
     */
    createDecorationType() {
        if (this.decorationType) {
            this.decorationType.dispose();
        }

        const iconPath = path.join(
            this.context.extensionPath,
            'resources',
            'icons',
            `${this.iconVariant}.svg`
        );

        this.decorationType = vscode.window.createTextEditorDecorationType({
            gutterIconPath: vscode.Uri.file(iconPath),
            gutterIconSize: '16px'
        });
    }

    /**
     * Scan document for TODO comments
     * @param {vscode.TextDocument} document
     * @returns {vscode.Range[]} Array of ranges containing TODOs
     */
    scanDocument(document) {
        const todoRanges = [];
        const text = document.getText();
        const lines = text.split('\n');

        for (let i = 0; i < lines.length; i++) {
            if (TODO_PATTERN.test(lines[i])) {
                const range = new vscode.Range(i, 0, i, 0);
                todoRanges.push(range);
            }
        }

        return todoRanges;
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
            const todoRanges = this.scanDocument(editor.document);
            editor.setDecorations(this.decorationType, todoRanges);
        } catch (error) {
            ErrorHandler.handleError(error, 'TODO Icon decoration update');
        }
    }

    /**
     * Set the icon variant
     * @param {string} variant - Icon variant (skull, ghost, tombstone)
     */
    setIconVariant(variant) {
        if (this.iconVariant !== variant) {
            this.iconVariant = variant;
            this.createDecorationType();

            // Refresh decorations
            if (vscode.window.activeTextEditor) {
                this.updateDecorations(vscode.window.activeTextEditor);
            }
        }
    }

    /**
     * Enable the TODO icon effect
     */
    enable() {
        this.isEnabled = true;
        if (vscode.window.activeTextEditor) {
            this.updateDecorations(vscode.window.activeTextEditor);
        }
    }

    /**
     * Disable the TODO icon effect
     */
    disable() {
        this.isEnabled = false;
        if (this.decorationType && vscode.window.activeTextEditor) {
            vscode.window.activeTextEditor.setDecorations(this.decorationType, []);
        }
    }

    /**
     * Dispose of all resources
     */
    dispose() {
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];

        if (this.decorationType) {
            this.decorationType.dispose();
            this.decorationType = null;
        }

        ErrorHandler.logInfo('TODO Icon Controller disposed');
    }
}

module.exports = TodoIconController;
