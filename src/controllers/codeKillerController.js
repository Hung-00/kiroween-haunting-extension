const vscode = require("vscode");
const ErrorHandler = require("../utils/errorHandler");

// Murder emojis shown when deleting large code blocks
const MURDER_EMOJIS = ["🪓", "💀", "⚰️", "🗡️", "☠️", "🔪"];

// Minimum lines deleted to trigger murder animation
const MIN_LINES_FOR_MURDER = 3;

// Duration to show murder animation (ms)
const ANIMATION_DURATION = 1500;

/**
 * Controller for "Code Killer" effect
 * Shows murder animation when deleting large blocks of code
 */
class CodeKillerController {
  constructor() {
    /** @type {vscode.ExtensionContext|null} */
    this.context = null;
    /** @type {vscode.TextEditorDecorationType|null} */
    this.murderDecorationType = null;
    /** @type {vscode.Disposable[]} */
    this.disposables = [];
    /** @type {boolean} */
    this.isEnabled = true;
    /** @type {Map<string, number>} */
    this.documentLineCounts = new Map(); // uri -> lineCount
    /** @type {NodeJS.Timeout|null} */
    this.animationTimeout = null;
  }

  /**
   * Initialize the code killer controller
   * @param {vscode.ExtensionContext} context
   */
  initialize(context) {
    this.context = context;

    // Track initial line counts for all open documents
    vscode.workspace.textDocuments.forEach((doc) => {
      this.documentLineCounts.set(doc.uri.toString(), doc.lineCount);
    });

    // Listen for document changes
    const docChangeDisposable = vscode.workspace.onDidChangeTextDocument(
      (e) => {
        if (this.isEnabled) {
          this.checkForMassDelete(e);
        }
      }
    );
    this.disposables.push(docChangeDisposable);

    // Track new documents
    const docOpenDisposable = vscode.workspace.onDidOpenTextDocument((doc) => {
      this.documentLineCounts.set(doc.uri.toString(), doc.lineCount);
    });
    this.disposables.push(docOpenDisposable);

    // Clean up closed documents
    const docCloseDisposable = vscode.workspace.onDidCloseTextDocument(
      (doc) => {
        this.documentLineCounts.delete(doc.uri.toString());
      }
    );
    this.disposables.push(docCloseDisposable);

    ErrorHandler.logInfo("Code Killer Controller initialized");
  }

  /**
   * Get a random murder emoji
   * @returns {string} Random emoji
   */
  getRandomMurderEmoji() {
    const index = Math.floor(Math.random() * MURDER_EMOJIS.length);
    return MURDER_EMOJIS[index];
  }

  /**
   * Check if a mass delete occurred and trigger animation
   * @param {vscode.TextDocumentChangeEvent} event
   */
  checkForMassDelete(event) {
    const uri = event.document.uri.toString();
    const previousLineCount = this.documentLineCounts.get(uri) || 0;
    const currentLineCount = event.document.lineCount;
    const linesDeleted = previousLineCount - currentLineCount;

    // Update stored line count
    this.documentLineCounts.set(uri, currentLineCount);

    // Check if enough lines were deleted
    if (linesDeleted >= MIN_LINES_FOR_MURDER) {
      this.triggerMurderAnimation(linesDeleted);
    }
  }

  /**
   * Trigger the murder animation
   * @param {number} linesKilled - Number of lines deleted
   */
  triggerMurderAnimation(linesKilled) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    try {
      // Clear any existing animation
      if (this.animationTimeout) {
        clearTimeout(this.animationTimeout);
        this.clearDecorations();
      }

      // Create murder decoration
      const emoji = this.getRandomMurderEmoji();
      const message = this.getMurderMessage(linesKilled, emoji);

      // Dispose previous decoration type
      if (this.murderDecorationType) {
        this.murderDecorationType.dispose();
      }

      // Create new decoration type with murder message
      this.murderDecorationType = vscode.window.createTextEditorDecorationType({
        after: {
          contentText: ` ${message}`,
          color: "#FF4444",
          fontWeight: "bold",
          fontStyle: "italic",
        },
        backgroundColor: "rgba(139, 0, 0, 0.2)",
        isWholeLine: true,
      });

      // Apply decoration at cursor line
      const cursorLine = editor.selection.active.line;
      const range = new vscode.Range(cursorLine, 0, cursorLine, 0);
      editor.setDecorations(this.murderDecorationType, [range]);

      // Show notification for big kills
      if (linesKilled >= 10) {
        vscode.window.showInformationMessage(
          `${emoji} MASSACRE! ${linesKilled} lines of code eliminated! ${emoji}`
        );
      }

      // Clear animation after duration
      this.animationTimeout = setTimeout(() => {
        this.clearDecorations();
        this.animationTimeout = null;
      }, ANIMATION_DURATION);
    } catch (error) {
      ErrorHandler.handleError(error, "Code killer animation");
    }
  }

  /**
   * Get murder message based on lines killed
   * @param {number} linesKilled
   * @param {string} emoji
   * @returns {string} Murder message
   */
  getMurderMessage(linesKilled, emoji) {
    if (linesKilled >= 50) {
      return `${emoji} GENOCIDE! ${linesKilled} lines obliterated! ${emoji}`;
    } else if (linesKilled >= 20) {
      return `${emoji} MASSACRE! ${linesKilled} lines slaughtered! ${emoji}`;
    } else if (linesKilled >= 10) {
      return `${emoji} CARNAGE! ${linesKilled} lines destroyed! ${emoji}`;
    } else if (linesKilled >= 5) {
      return `${emoji} MURDER! ${linesKilled} lines killed! ${emoji}`;
    } else {
      return `${emoji} ${linesKilled} lines eliminated ${emoji}`;
    }
  }

  /**
   * Enable the code killer effect
   */
  enable() {
    this.isEnabled = true;
  }

  /**
   * Disable the code killer effect
   */
  disable() {
    this.isEnabled = false;
    this.clearDecorations();
  }

  /**
   * Toggle the code killer effect
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
   * Clear all murder decorations
   */
  clearDecorations() {
    const editor = vscode.window.activeTextEditor;
    if (editor && this.murderDecorationType) {
      editor.setDecorations(this.murderDecorationType, []);
    }
  }

  /**
   * Dispose of all resources
   */
  dispose() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }

    this.clearDecorations();

    if (this.murderDecorationType) {
      this.murderDecorationType.dispose();
      this.murderDecorationType = null;
    }

    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
    this.documentLineCounts.clear();

    ErrorHandler.logInfo("Code Killer Controller disposed");
  }
}

module.exports = CodeKillerController;
