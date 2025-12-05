import * as vscode from 'vscode';

export class BloodDripDecorator {
    private decorationTypes: Map<string, vscode.TextEditorDecorationType> = new Map();
    private enabled: boolean = true;
    private context: vscode.ExtensionContext;
    private updateTimeout: NodeJS.Timeout | undefined;
    private animationFrames = ['🩸', '💉', '🔴', '⚫'];

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.createDecorationTypes();
        this.enabled = vscode.workspace.getConfiguration('bloodDripCode').get('bloodDripEnabled', true);
    }

    private createDecorationTypes() {
        // Critical Error - Heavy blood drip
        this.decorationTypes.set('error', vscode.window.createTextEditorDecorationType({
            isWholeLine: true,
            backgroundColor: 'rgba(139, 0, 0, 0.1)',
            borderColor: 'rgba(139, 0, 0, 0.5)',
            borderWidth: '0 0 0 4px',
            borderStyle: 'solid',
            after: {
                contentText: ' 🩸',
                margin: '0 0 0 1em',
                color: '#8B0000',
            },
            gutterIconPath: this.createBloodGutterIcon('heavy')
        }));

        // Warning - Light blood drip
        this.decorationTypes.set('warning', vscode.window.createTextEditorDecorationType({
            isWholeLine: true,
            backgroundColor: 'rgba(139, 0, 0, 0.05)',
            borderColor: 'rgba(139, 0, 0, 0.3)',
            borderWidth: '0 0 0 2px',
            borderStyle: 'solid',
            after: {
                contentText: ' 💧',
                margin: '0 0 0 1em',
                color: '#CD5C5C',
            }
        }));

        // Info - Ghost mark
        this.decorationTypes.set('info', vscode.window.createTextEditorDecorationType({
            isWholeLine: true,
            backgroundColor: 'rgba(211, 211, 211, 0.05)',
            after: {
                contentText: ' 👻',
                margin: '0 0 0 1em',
                color: '#D3D3D3',
            }
        }));
    }

    private createBloodGutterIcon(intensity: string): vscode.Uri {
        // Create SVG blood drip icon
        const svg = `
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bloodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#8B0000;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#8B0000;stop-opacity:0.7" />
                        <stop offset="100%" style="stop-color:#8B0000;stop-opacity:0.3" />
                    </linearGradient>
                </defs>
                <ellipse cx="8" cy="4" rx="3" ry="4" fill="url(#bloodGradient)"/>
                <path d="M 8 8 L 8 14 Q 8 16 6 16 Q 8 16 8 14 Q 8 16 10 16 Q 8 16 8 14 Z" 
                      fill="url(#bloodGradient)"/>
            </svg>
        `;
        
        const uri = vscode.Uri.parse(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
        return uri;
    }

    updateDiagnostics(event: vscode.DiagnosticChangeEvent) {
        if (!this.enabled) {
            return;
        }

        // Debounce updates
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }

        this.updateTimeout = setTimeout(() => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }

            const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
            this.applyDecorationsToEditor(editor, diagnostics);
        }, 100);
    }

    applyDecorationsToEditor(editor: vscode.TextEditor, diagnostics: vscode.Diagnostic[]) {
        if (!this.enabled) {
            return;
        }

        const errorRanges: vscode.Range[] = [];
        const warningRanges: vscode.Range[] = [];
        const infoRanges: vscode.Range[] = [];

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
                    infoRanges.push(range);
                    break;
            }
        });

        editor.setDecorations(this.decorationTypes.get('error')!, errorRanges);
        editor.setDecorations(this.decorationTypes.get('warning')!, warningRanges);
        editor.setDecorations(this.decorationTypes.get('info')!, infoRanges);
    }

    private animateBloodDrip(editor: vscode.TextEditor, range: vscode.Range) {
        // Get animation speed from settings
        const speed = vscode.workspace.getConfiguration('bloodDripCode').get('dripSpeed', 200);
        
        let frameIndex = 0;

        const animate = () => {
            if (frameIndex >= this.animationFrames.length) {
                return;
            }

            const decorationType = vscode.window.createTextEditorDecorationType({
                after: {
                    contentText: ` ${this.animationFrames[frameIndex]}`,
                    margin: '0 0 0 1em',
                    color: '#8B0000'
                }
            });

            editor.setDecorations(decorationType, [range]);

            setTimeout(() => {
                decorationType.dispose();
                frameIndex++;
                animate();
            }, speed as number);
        };

        // Start animation after a brief delay
        setTimeout(() => animate(), 500);
    }

    toggle() {
        this.enabled = !this.enabled;
        
        if (!this.enabled) {
            // Clear all decorations
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                this.decorationTypes.forEach(type => {
                    editor.setDecorations(type, []);
                });
            }
        } else {
            // Reapply decorations
            this.reload();
        }
    }

    reload() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
            this.applyDecorationsToEditor(editor, diagnostics);
        }
    }

    dispose() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        this.decorationTypes.forEach(type => type.dispose());
        this.decorationTypes.clear();
    }
}
