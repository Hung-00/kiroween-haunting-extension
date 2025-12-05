const vscode = require("vscode");
const { debounce } = require("../utils/animationUtils");
const ErrorHandler = require("../utils/errorHandler");

const DEBOUNCE_DELAY = 100;
// 5 drops reducing to 1, then repeat
const DRIP_FRAMES = ["🩸🩸🩸🩸🩸", "🩸🩸🩸🩸", "🩸🩸🩸", "🩸🩸", "🩸"];
const ANIMATION_SPEED = 300; // ms per frame

/**
 * Controller for blood drip animations on error lines
 * Uses pooled decorations and single animation interval per line
 */
class BloodDripController {
  constructor() {
    /** @type {vscode.ExtensionContext|null} */
    this.context = null;
    /** @type {Map<string, vscode.TextEditorDecorationType>} */
    this.decorationTypes = new Map();
    /** @type {vscode.TextEditorDecorationType[]} */
    this.dripFrameTypes = [];
    /** @type {Map<number, NodeJS.Timeout>} */
    this.lineAnimations = new Map(); // line -> intervalId
    /** @type {vscode.Disposable[]} */
    this.disposables = [];
    /** @type {boolean} */
    this.isEnabled = true;
    /** @type {boolean} */
    this.isPaused = false;
    /** @type {number} */
    this.currentFrame = 0;
    /** @type {NodeJS.Timeout|null} */
    this.globalAnimationInterval = null;
    /** @type {vscode.Range[]} */
    this.currentErrorRanges = [];
    /** @type {Function} */
    this.debouncedUpdate = debounce(
      this.handleDiagnosticsChange.bind(this),
      DEBOUNCE_DELAY
    );
  }

  /**
   * Initialize the blood drip controller
   * @param {vscode.ExtensionContext} context
   */
  initialize(context) {
    this.context = context;
    this.createDecorationPool();

    // Listen for diagnostic changes
    const diagnosticDisposable = vscode.languages.onDidChangeDiagnostics(
      (e) => {
        if (this.isEnabled && !this.isPaused) {
          this.debouncedUpdate(e.uris);
        }
      }
    );
    this.disposables.push(diagnosticDisposable);

    // Listen for active editor changes
    const editorDisposable = vscode.window.onDidChangeActiveTextEditor(
      (editor) => {
        if (this.isEnabled && !this.isPaused && editor) {
          const diagnostics = vscode.languages.getDiagnostics(
            editor.document.uri
          );
          this.applyDecorationsToEditor(editor, diagnostics);
        }
      }
    );
    this.disposables.push(editorDisposable);

    // Initial check for active editor
    if (vscode.window.activeTextEditor) {
      this.handleDiagnosticsChange([
        vscode.window.activeTextEditor.document.uri,
      ]);
    }

    // Start global animation loop
    this.startAnimationLoop();

    ErrorHandler.logInfo("Blood Drip Controller initialized");
  }

  /**
   * Create pooled decoration types (created once, reused)
   */
  createDecorationPool() {
    // Dispose existing types
    this.decorationTypes.forEach((type) => type.dispose());
    this.decorationTypes.clear();
    this.dripFrameTypes.forEach((type) => type.dispose());
    this.dripFrameTypes = [];

    // Base error decoration - red left border and background
    this.decorationTypes.set(
      "error",
      vscode.window.createTextEditorDecorationType({
        isWholeLine: true,
        backgroundColor: "rgba(139, 0, 0, 0.15)",
        borderColor: "rgba(139, 0, 0, 0.8)",
        borderWidth: "0 0 0 4px",
        borderStyle: "solid",
        overviewRulerColor: "#8B0000",
        overviewRulerLane: vscode.OverviewRulerLane.Right,
      })
    );

    // Warning decoration
    this.decorationTypes.set(
      "warning",
      vscode.window.createTextEditorDecorationType({
        isWholeLine: true,
        backgroundColor: "rgba(139, 0, 0, 0.08)",
        borderColor: "rgba(139, 0, 0, 0.4)",
        borderWidth: "0 0 0 2px",
        borderStyle: "solid",
        after: {
          contentText: " ⚠️",
          margin: "0 0 0 1em",
          color: "#CD5C5C",
        },
      })
    );

    // Info decoration
    this.decorationTypes.set(
      "info",
      vscode.window.createTextEditorDecorationType({
        isWholeLine: true,
        backgroundColor: "rgba(100, 100, 100, 0.05)",
        after: {
          contentText: " 👻",
          margin: "0 0 0 1em",
          color: "#888888",
        },
      })
    );

    // Pre-create drip animation frame decorations (pooled)
    // 5 drops reducing to 1 pattern
    DRIP_FRAMES.forEach((frame) => {
      const frameType = vscode.window.createTextEditorDecorationType({
        after: {
          contentText: ` ${frame}`,
          margin: "0 0 0 1em",
          color: "#8B0000",
          fontWeight: "bold",
        },
      });
      this.dripFrameTypes.push(frameType);
    });
  }

  /**
   * Start the global animation loop for drip effect
   */
  startAnimationLoop() {
    if (this.globalAnimationInterval) return;

    this.globalAnimationInterval = setInterval(() => {
      if (this.isPaused || !this.isEnabled) return;

      const editor = vscode.window.activeTextEditor;
      if (!editor || this.currentErrorRanges.length === 0) return;

      // Cycle to next frame
      this.currentFrame = (this.currentFrame + 1) % this.dripFrameTypes.length;

      // Clear all drip frames first
      this.dripFrameTypes.forEach((type) => {
        editor.setDecorations(type, []);
      });

      // Apply current frame to all error lines
      const currentFrameType = this.dripFrameTypes[this.currentFrame];
      if (currentFrameType) {
        editor.setDecorations(currentFrameType, this.currentErrorRanges);
      }
    }, ANIMATION_SPEED);
  }

  /**
   * Stop the global animation loop
   */
  stopAnimationLoop() {
    if (this.globalAnimationInterval) {
      clearInterval(this.globalAnimationInterval);
      this.globalAnimationInterval = null;
    }
  }

  /**
   * Handle diagnostic changes
   * @param {vscode.Uri[]} uris - URIs that changed
   */
  handleDiagnosticsChange(uris) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const documentUri = editor.document.uri.toString();
    const affectsCurrentDocument = uris.some(
      (uri) => uri.toString() === documentUri
    );

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

      diagnostics.forEach((diagnostic) => {
        if (diagnostic.range.start.line >= editor.document.lineCount) return;

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

      // Store error ranges for animation
      this.currentErrorRanges = errorRanges;

      // Apply base decorations
      const errorType = this.decorationTypes.get("error");
      const warningType = this.decorationTypes.get("warning");
      const infoType = this.decorationTypes.get("info");

      if (errorType) editor.setDecorations(errorType, errorRanges);
      if (warningType) editor.setDecorations(warningType, warningRanges);
      if (infoType) editor.setDecorations(infoType, infoRanges);

      // If no errors, clear drip animations
      if (errorRanges.length === 0) {
        this.dripFrameTypes.forEach((type) => {
          editor.setDecorations(type, []);
        });
      }
    } catch (error) {
      ErrorHandler.handleError(error, "Blood drip decoration update");
    }
  }

  /**
   * Enable the blood drip effect
   */
  enable() {
    this.isEnabled = true;
    this.startAnimationLoop();
    if (vscode.window.activeTextEditor) {
      this.handleDiagnosticsChange([
        vscode.window.activeTextEditor.document.uri,
      ]);
    }
  }

  /**
   * Disable the blood drip effect
   */
  disable() {
    this.isEnabled = false;
    this.stopAnimationLoop();
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
    if (vscode.window.activeTextEditor) {
      this.handleDiagnosticsChange([
        vscode.window.activeTextEditor.document.uri,
      ]);
    }
  }

  /**
   * Clear all decorations
   */
  clearDecorations() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      this.decorationTypes.forEach((type) => {
        editor.setDecorations(type, []);
      });
      this.dripFrameTypes.forEach((type) => {
        editor.setDecorations(type, []);
      });
    }
    this.currentErrorRanges = [];
  }

  /**
   * Dispose of all resources
   */
  dispose() {
    this.stopAnimationLoop();
    this.clearDecorations();

    this.decorationTypes.forEach((type) => type.dispose());
    this.decorationTypes.clear();

    this.dripFrameTypes.forEach((type) => type.dispose());
    this.dripFrameTypes = [];

    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];

    ErrorHandler.logInfo("Blood Drip Controller disposed");
  }
}

module.exports = BloodDripController;
