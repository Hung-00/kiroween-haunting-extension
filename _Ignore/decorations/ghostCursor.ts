import * as vscode from 'vscode';

interface CursorPosition {
    line: number;
    character: number;
    timestamp: number;
}

export class GhostCursorTracker {
    private enabled: boolean = true;
    private cursorHistory: CursorPosition[] = [];
    private maxHistoryLength: number = 20;
    private decorationType: vscode.TextEditorDecorationType;
    private ghostDecorationType: vscode.TextEditorDecorationType;

    constructor(private context: vscode.ExtensionContext) {
        this.enabled = vscode.workspace.getConfiguration('bloodDripCode').get('ghostCursorEnabled', true);
        
        this.decorationType = vscode.window.createTextEditorDecorationType({
            after: {
                contentText: '👻',
                color: 'rgba(255, 255, 255, 0.3)',
                margin: '0 0 0 0.5em'
            }
        });

        this.ghostDecorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(128, 128, 128, 0.1)',
            border: '1px dashed rgba(128, 128, 128, 0.3)'
        });
    }

    trackCursor(event: vscode.TextEditorSelectionChangeEvent) {
        if (!this.enabled) {
            return;
        }

        const editor = event.textEditor;
        const position = event.selections[0].active;

        // Add to history
        this.cursorHistory.push({
            line: position.line,
            character: position.character,
            timestamp: Date.now()
        });

        // Keep only recent positions
        if (this.cursorHistory.length > this.maxHistoryLength) {
            this.cursorHistory.shift();
        }

        // Remove old ghosts (older than 5 seconds)
        const now = Date.now();
        this.cursorHistory = this.cursorHistory.filter(pos => 
            now - pos.timestamp < 5000
        );

        this.renderGhostTrail(editor);
    }

    private renderGhostTrail(editor: vscode.TextEditor) {
        const ghostRanges: vscode.DecorationOptions[] = [];

        // Show ghost marks at previous cursor positions
        this.cursorHistory.forEach((pos, index) => {
            // Skip the most recent position (current cursor)
            if (index === this.cursorHistory.length - 1) {
                return;
            }

            const opacity = 0.1 + (index / this.cursorHistory.length) * 0.3;
            const age = Date.now() - pos.timestamp;
            const fadeOpacity = Math.max(0, 1 - (age / 5000));

            // Check if line exists
            if (pos.line >= editor.document.lineCount) {
                return;
            }

            const lineText = editor.document.lineAt(pos.line).text;
            const character = Math.min(pos.character, lineText.length);

            const range = new vscode.Range(
                pos.line, 
                character, 
                pos.line, 
                character
            );

            ghostRanges.push({
                range,
                renderOptions: {
                    after: {
                        contentText: '.',
                        color: `rgba(200, 200, 200, ${opacity * fadeOpacity})`,
                        margin: '0'
                    }
                }
            });
        });

        editor.setDecorations(this.decorationType, ghostRanges);
    }

    toggle() {
        this.enabled = !this.enabled;
        
        if (!this.enabled) {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                editor.setDecorations(this.decorationType, []);
                editor.setDecorations(this.ghostDecorationType, []);
            }
            this.cursorHistory = [];
        }
    }

    reload() {
        if (this.enabled) {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                this.renderGhostTrail(editor);
            }
        }
    }

    dispose() {
        this.decorationType.dispose();
        this.ghostDecorationType.dispose();
        this.cursorHistory = [];
    }
}
