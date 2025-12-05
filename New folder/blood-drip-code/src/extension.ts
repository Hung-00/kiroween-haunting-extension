import * as vscode from 'vscode';
import { BloodDripDecorator } from './decorations/bloodDrip';
import { GhostCursorTracker } from './decorations/ghostCursor';
import { CandlelightMode } from './decorations/candlelight';
import { SkeletonComments } from './decorations/skeletonComments';

let bloodDripDecorator: BloodDripDecorator;
let ghostCursorTracker: GhostCursorTracker;
let candlelightMode: CandlelightMode;
let skeletonComments: SkeletonComments;

export function activate(context: vscode.ExtensionContext) {
    console.log('🎃 Blood Drip Code extension is now active!');

    // Initialize decorators
    bloodDripDecorator = new BloodDripDecorator(context);
    ghostCursorTracker = new GhostCursorTracker(context);
    candlelightMode = new CandlelightMode(context);
    skeletonComments = new SkeletonComments(context);

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('blood-drip-code.enableBloodDrip', () => {
            bloodDripDecorator.toggle();
            vscode.window.showInformationMessage('🩸 Blood drip effect toggled!');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('blood-drip-code.enableGhostCursor', () => {
            ghostCursorTracker.toggle();
            vscode.window.showInformationMessage('👻 Ghost cursor toggled!');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('blood-drip-code.enableCandlelight', () => {
            candlelightMode.toggle();
            vscode.window.showInformationMessage('🕯️ Candlelight mode toggled!');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('blood-drip-code.toggleAllEffects', () => {
            bloodDripDecorator.toggle();
            ghostCursorTracker.toggle();
            candlelightMode.toggle();
            vscode.window.showInformationMessage('🎃 All haunting effects toggled!');
        })
    );

    // Show welcome message
    showHauntedWelcome();

    // Listen for configuration changes
    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('bloodDripCode')) {
            reloadDecorators();
        }
    });

    // Monitor diagnostics (errors/warnings)
    vscode.languages.onDidChangeDiagnostics(e => {
        bloodDripDecorator.updateDiagnostics(e);
    });

    // Monitor cursor position
    vscode.window.onDidChangeTextEditorSelection(e => {
        ghostCursorTracker.trackCursor(e);
        candlelightMode.updateFocus(e);
    });

    // Monitor active editor changes
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
            bloodDripDecorator.applyDecorationsToEditor(editor, diagnostics);
            skeletonComments.scanForSpecialComments();
        }
    });
}

function showHauntedWelcome() {
    const message = '🎃 Welcome to the Haunted Editor... Your code bleeds tonight... 🩸';
    vscode.window.showInformationMessage(message, 'Open Settings').then(selection => {
        if (selection === 'Open Settings') {
            vscode.commands.executeCommand('workbench.action.openSettings', 'bloodDripCode');
        }
    });
}

function reloadDecorators() {
    bloodDripDecorator.reload();
    ghostCursorTracker.reload();
    candlelightMode.reload();
}

export function deactivate() {
    bloodDripDecorator?.dispose();
    ghostCursorTracker?.dispose();
    candlelightMode?.dispose();
    skeletonComments?.dispose();
}
