const vscode = require('vscode');
const EffectManager = require('./effectManager');
const ErrorHandler = require('./utils/errorHandler');

/** @type {EffectManager|null} */
let effectManager = null;

/**
 * Activates the Blood Drip extension
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    ErrorHandler.logInfo('Blood Drip extension is activating...');

    try {
        effectManager = new EffectManager();
        effectManager.initialize(context);

        context.subscriptions.push({
            dispose: () => {
                if (effectManager) {
                    effectManager.dispose();
                    effectManager = null;
                }
            }
        });

        ErrorHandler.logInfo('Blood Drip extension activated successfully!');
    } catch (error) {
        ErrorHandler.handleError(error, 'Extension activation');
    }
}

/**
 * Deactivates the Blood Drip extension
 */
function deactivate() {
    ErrorHandler.logInfo('Blood Drip extension is deactivating...');

    if (effectManager) {
        effectManager.dispose();
        effectManager = null;
    }

    ErrorHandler.logInfo('Blood Drip extension deactivated.');
}

module.exports = {
    activate,
    deactivate
};
