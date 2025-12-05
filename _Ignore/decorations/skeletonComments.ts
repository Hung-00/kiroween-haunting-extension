import * as vscode from 'vscode';

export class SkeletonComments {
    private decorationType: vscode.TextEditorDecorationType;
    private updateTimeout: NodeJS.Timeout | undefined;

    constructor(private context: vscode.ExtensionContext) {
        this.decorationType = vscode.window.createTextEditorDecorationType({
            before: {
                contentText: '💀 ',
                color: '#FFD700',
                fontWeight: 'bold'
            },
            backgroundColor: 'rgba(255, 215, 0, 0.1)'
        });

        this.scanForSpecialComments();
        
        // Re-scan when document changes
        vscode.workspace.onDidChangeTextDocument(() => {
            this.debouncedScan();
        });

        // Re-scan when active editor changes
        vscode.window.onDidChangeActiveTextEditor(() => {
            this.scanForSpecialComments();
        });
    }

    private debouncedScan() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }

        this.updateTimeout = setTimeout(() => {
            this.scanForSpecialComments();
        }, 500);
    }

    scanForSpecialComments() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const document = editor.document;
        const text = document.getText();
        const ranges: vscode.Range[] = [];

        // Find TODO, FIXME, HACK, etc.
        const keywords = ['TODO', 'FIXME', 'HACK', 'XXX', 'BUG', 'DEPRECATED', 'WARNING'];
        
        for (const keyword of keywords) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            let match;
            
            while ((match = regex.exec(text)) !== null) {
                const position = document.positionAt(match.index);
                const range = new vscode.Range(position, position);
                ranges.push(range);
            }
        }

        editor.setDecorations(this.decorationType, ranges);
    }

    dispose() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        this.decorationType.dispose();
    }
}
