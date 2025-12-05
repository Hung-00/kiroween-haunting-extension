import * as vscode from 'vscode';

export class CandlelightMode {
    private enabled: boolean = false;
    private decorationType: vscode.TextEditorDecorationType;
    private dimDecorationType: vscode.TextEditorDecorationType;
    private focusRange: number = 3; // Lines above and below cursor

    constructor(private context: vscode.ExtensionContext) {
        this.enabled = vscode.workspace.getConfiguration('bloodDripCode').get('candlelightEnabled', false);
        
        this.decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 250, 205, 0.05)', // Warm candlelight
            isWholeLine: true
        });

        this.dimDecorationType = vscode.window.createTextEditorDecorationType({
            opacity: '0.3',
            isWholeLine: true
        });
    }

    updateFocus(event: vscode.TextEditorSelectionChangeEvent) {
        if (!this.enabled) {
            return;
        }

        const editor = event.textEditor;
        const cursorLine = event.selections[0].active.line;
        
        this.applyCandlelightEffect(editor, cursorLine);
    }

    private applyCandlelightEffect(editor: vscode.TextEditor, cursorLine: number) {
        const totalLines = editor.document.lineCount;
        const focusRanges: vscode.Range[] = [];
        const dimRanges: vscode.Range[] = [];

        // Calculate focus area (lines near cursor)
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

        editor.setDecorations(this.decorationType, focusRanges);
        editor.setDecorations(this.dimDecorationType, dimRanges);
    }

    toggle() {
        this.enabled = !this.enabled;
        
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        if (!this.enabled) {
            // Clear all decorations
            editor.setDecorations(this.decorationType, []);
            editor.setDecorations(this.dimDecorationType, []);
        } else {
            // Apply candlelight effect
            const cursorLine = editor.selection.active.line;
            this.applyCandlelightEffect(editor, cursorLine);
        }
    }

    reload() {
        if (this.enabled) {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const cursorLine = editor.selection.active.line;
                this.applyCandlelightEffect(editor, cursorLine);
            }
        }
    }

    dispose() {
        this.decorationType.dispose();
        this.dimDecorationType.dispose();
    }
}
