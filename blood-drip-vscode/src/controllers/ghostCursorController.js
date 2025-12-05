const vscode = require("vscode");
const ErrorHandler = require("../utils/errorHandler");

/**
 * Controller for ghost emoji that follows the cursor
 * Shows 👻 at cursor position, removes when cursor moves
 */
class GhostCursorController {
  constructor() {
    /** @type {vscode.ExtensionContext|null} */
    this.context = null;
    /** @type {vscode.TextEditorDecorationType|null} */
    this.ghostDecorationType = null;
    /** @type {vscode.Disposable[]} */
    this.disposables = [];
    /** @type {boolean} */
    this.isEnabled = true;
    /** @type {vscode.Position|null} */
    this.lastCursorPosition = null;
  }

  /**
   * Initialize the ghost cursor controller
   * @param {vscode.ExtensionContext} context
   */
  initialize(context) {
    this.context = context;
    this.createDecorationType();

    // Listen for cursor position changes
    const cursorDisposable = vscode.window.onDidChangeTextEditorSelection(
      (e) => {
        if (this.isEnabled && e.textEditor === vscode.window.activeTextEditor) {
          this.updateGhostPosition(e.textEditor, e.selections[0]?.active);
        }
      }
    );
    this.disposables.push(cursorDisposable);

    // Listen for active editor changes
    const editorDisposable = vscode.window.onDidChangeActiveTextEditor(
      (editor) => {
        if (this.isEnabled && editor) {
          this.updateGhostPosition(editor, editor.selection.active);
        }
      }
    );
    this.disposables.push(editorDisposable);

    // Initial ghost placement
    if (vscode.window.activeTextEditor) {
      const editor = vscode.window.activeTextEditor;
      this.updateGhostPosition(editor, editor.selection.active);
    }

    ErrorHandler.logInfo("Ghost Cursor Controller initialized");
  }

  /**
   * Create the ghost decoration type (pooled, created once)
   */
  createDecorationType() {
    if (this.ghostDecorationType) {
      this.ghostDecorationType.dispose();
    }

    this.ghostDecorationType = vscode.window.createTextEditorDecorationType({
      after: {
        contentText: "👻",
        margin: "0 0 0 0.2em",
        color: "rgba(255, 255, 255, 0.8)",
        fontWeight: "normal",
      },
    });
  }

  /**
   * Update ghost position to current cursor location
   * @param {vscode.TextEditor} editor
   * @param {vscode.Position} position
   */
  updateGhostPosition(editor, position) {
    if (!this.isEnabled || !this.ghostDecorationType || !position) return;

    try {
      // Create range at cursor position
      const range = new vscode.Range(position, position);

      // Apply ghost decoration at cursor
      editor.setDecorations(this.ghostDecorationType, [range]);

      this.lastCursorPosition = position;
    } catch (error) {
      ErrorHandler.handleError(error, "Ghost cursor update");
    }
  }

  /**
   * Enable the ghost cursor effect
   */
  enable() {
    this.isEnabled = true;
    if (vscode.window.activeTextEditor) {
      const editor = vscode.window.activeTextEditor;
      this.updateGhostPosition(editor, editor.selection.active);
    }
  }

  /**
   * Disable the ghost cursor effect
   */
  disable() {
    this.isEnabled = false;
    this.clearDecorations();
  }

  /**
   * Toggle the ghost cursor effect
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
   * Clear all ghost decorations
   */
  clearDecorations() {
    const editor = vscode.window.activeTextEditor;
    if (editor && this.ghostDecorationType) {
      editor.setDecorations(this.ghostDecorationType, []);
    }
  }

  /**
   * Dispose of all resources
   */
  dispose() {
    this.clearDecorations();

    if (this.ghostDecorationType) {
      this.ghostDecorationType.dispose();
      this.ghostDecorationType = null;
    }

    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];

    ErrorHandler.logInfo("Ghost Cursor Controller disposed");
  }
}

module.exports = GhostCursorController;
