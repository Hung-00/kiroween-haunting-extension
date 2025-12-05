const vscode = require('vscode');
const ConfigurationManager = require('./services/configurationManager');
const BloodDripController = require('./controllers/bloodDripController');
const CursorTrailController = require('./controllers/cursorTrailController');
const TodoIconController = require('./controllers/todoIconController');
const CandlelightController = require('./controllers/candlelightController');
const FloatingGhostController = require('./controllers/floatingGhostController');
const ErrorHandler = require('./utils/errorHandler');
const { EffectType } = require('./models/types');

/**
 * Central manager for all Blood Drip visual effects
 */
class EffectManager {
    constructor() {
        /** @type {ConfigurationManager|null} */
        this.configManager = null;
        /** @type {BloodDripController|null} */
        this.bloodDripController = null;
        /** @type {CursorTrailController|null} */
        this.cursorTrailController = null;
        /** @type {TodoIconController|null} */
        this.todoIconController = null;
        /** @type {CandlelightController|null} */
        this.candlelightController = null;
        /** @type {FloatingGhostController|null} */
        this.floatingGhostController = null;
        /** @type {vscode.Disposable[]} */
        this.disposables = [];
        /** @type {boolean} */
        this.isPaused = false;
    }

    /**
     * Initialize all effect controllers
     * @param {vscode.ExtensionContext} context
     */
    initialize(context) {
        // Initialize configuration manager
        this.configManager = new ConfigurationManager();
        this.configManager.initialize();

        const config = this.configManager.getFullConfig();

        // Initialize controllers
        this.bloodDripController = new BloodDripController();
        this.cursorTrailController = new CursorTrailController();
        this.todoIconController = new TodoIconController();
        this.candlelightController = new CandlelightController();
        this.floatingGhostController = new FloatingGhostController();

        this.bloodDripController.initialize(context);
        this.cursorTrailController.initialize(context);
        this.todoIconController.initialize(context);
        this.candlelightController.initialize(context);
        this.floatingGhostController.initialize(context);

        // Apply initial configuration
        this.applyConfiguration(config);

        // Register commands
        this.registerCommands(context);

        // Listen for configuration changes
        const configDisposable = this.configManager.onConfigChange((newConfig) => {
            this.applyConfiguration(newConfig);
        });
        this.disposables.push(configDisposable);

        // Listen for window focus changes
        const focusDisposable = vscode.window.onDidChangeWindowState((state) => {
            if (state.focused) {
                this.resumeAllEffects();
            } else {
                this.pauseAllEffects();
            }
        });
        this.disposables.push(focusDisposable);

        // Show welcome message
        this.showHauntedWelcome();

        ErrorHandler.logInfo('Effect Manager initialized');
    }


    /**
     * Show haunted welcome message
     */
    showHauntedWelcome() {
        const message = '🎃 Welcome to the Haunted Editor... Your code bleeds tonight... 🩸';
        vscode.window.showInformationMessage(message, 'Open Settings').then(selection => {
            if (selection === 'Open Settings') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'bloodDrip');
            }
        });
    }

    /**
     * Register toggle commands
     * @param {vscode.ExtensionContext} context
     */
    registerCommands(context) {
        // Toggle Blood Drip
        context.subscriptions.push(
            vscode.commands.registerCommand('bloodDrip.toggleBloodDrip', () => {
                if (this.bloodDripController) {
                    if (this.bloodDripController.isEnabled) {
                        this.bloodDripController.disable();
                    } else {
                        this.bloodDripController.enable();
                    }
                    vscode.window.showInformationMessage('🩸 Blood drip effect toggled!');
                }
            })
        );

        // Toggle Ghost Cursor
        context.subscriptions.push(
            vscode.commands.registerCommand('bloodDrip.toggleGhostCursor', () => {
                if (this.cursorTrailController) {
                    if (this.cursorTrailController.isEnabled) {
                        this.cursorTrailController.disable();
                    } else {
                        this.cursorTrailController.enable();
                    }
                    vscode.window.showInformationMessage('👻 Ghost cursor toggled!');
                }
            })
        );

        // Toggle TODO Icons
        context.subscriptions.push(
            vscode.commands.registerCommand('bloodDrip.toggleTodoIcons', () => {
                if (this.todoIconController) {
                    if (this.todoIconController.isEnabled) {
                        this.todoIconController.disable();
                    } else {
                        this.todoIconController.enable();
                    }
                    vscode.window.showInformationMessage('💀 Spooky TODO icons toggled!');
                }
            })
        );

        // Toggle Candlelight
        context.subscriptions.push(
            vscode.commands.registerCommand('bloodDrip.toggleCandlelight', () => {
                if (this.candlelightController) {
                    const enabled = this.candlelightController.toggle();
                    vscode.window.showInformationMessage(`🕯️ Candlelight mode ${enabled ? 'enabled' : 'disabled'}!`);
                }
            })
        );

        // Toggle Floating Ghost
        context.subscriptions.push(
            vscode.commands.registerCommand('bloodDrip.toggleFloatingGhost', () => {
                if (this.floatingGhostController) {
                    const enabled = this.floatingGhostController.toggle();
                    vscode.window.showInformationMessage(`👻 Floating ghost ${enabled ? 'enabled' : 'disabled'}!`);
                }
            })
        );

        // Toggle All Effects
        context.subscriptions.push(
            vscode.commands.registerCommand('bloodDrip.toggleAllEffects', () => {
                if (this.bloodDripController) {
                    if (this.bloodDripController.isEnabled) {
                        this.bloodDripController.disable();
                    } else {
                        this.bloodDripController.enable();
                    }
                }
                if (this.cursorTrailController) {
                    if (this.cursorTrailController.isEnabled) {
                        this.cursorTrailController.disable();
                    } else {
                        this.cursorTrailController.enable();
                    }
                }
                if (this.todoIconController) {
                    if (this.todoIconController.isEnabled) {
                        this.todoIconController.disable();
                    } else {
                        this.todoIconController.enable();
                    }
                }
                if (this.floatingGhostController) {
                    this.floatingGhostController.toggle();
                }
                vscode.window.showInformationMessage('🎃 All haunting effects toggled!');
            })
        );
    }

    /**
     * Apply configuration to all controllers
     * @param {Object} config
     */
    applyConfiguration(config) {
        if (config.bloodDripEnabled) {
            this.enableEffect(EffectType.BloodDrip);
        } else {
            this.disableEffect(EffectType.BloodDrip);
        }

        if (config.cursorTrailEnabled) {
            this.enableEffect(EffectType.CursorTrail);
        } else {
            this.disableEffect(EffectType.CursorTrail);
        }

        if (config.todoIconEnabled) {
            this.enableEffect(EffectType.TodoIcon);
        } else {
            this.disableEffect(EffectType.TodoIcon);
        }

        if (config.candlelightEnabled) {
            if (this.candlelightController) {
                this.candlelightController.enable();
            }
        } else {
            if (this.candlelightController) {
                this.candlelightController.disable();
            }
        }

        if (config.floatingGhostEnabled) {
            if (this.floatingGhostController) {
                this.floatingGhostController.enable();
            }
        } else {
            if (this.floatingGhostController) {
                this.floatingGhostController.disable();
            }
        }

        if (this.todoIconController) {
            this.todoIconController.setIconVariant(config.todoIconVariant);
        }
    }

    /**
     * Enable a specific effect
     * @param {string} effectType
     */
    enableEffect(effectType) {
        switch (effectType) {
            case EffectType.BloodDrip:
                if (this.bloodDripController) this.bloodDripController.enable();
                break;
            case EffectType.CursorTrail:
                if (this.cursorTrailController) this.cursorTrailController.enable();
                break;
            case EffectType.TodoIcon:
                if (this.todoIconController) this.todoIconController.enable();
                break;
        }
    }

    /**
     * Disable a specific effect
     * @param {string} effectType
     */
    disableEffect(effectType) {
        switch (effectType) {
            case EffectType.BloodDrip:
                if (this.bloodDripController) this.bloodDripController.disable();
                break;
            case EffectType.CursorTrail:
                if (this.cursorTrailController) this.cursorTrailController.disable();
                break;
            case EffectType.TodoIcon:
                if (this.todoIconController) this.todoIconController.disable();
                break;
        }
    }

    /**
     * Pause all effects
     */
    pauseAllEffects() {
        if (this.isPaused) return;
        this.isPaused = true;

        if (this.bloodDripController) this.bloodDripController.pause();
        if (this.cursorTrailController) this.cursorTrailController.pause();

        ErrorHandler.logInfo('Effects paused');
    }

    /**
     * Resume all effects
     */
    resumeAllEffects() {
        if (!this.isPaused) return;
        this.isPaused = false;

        if (this.bloodDripController) this.bloodDripController.resume();
        if (this.cursorTrailController) this.cursorTrailController.resume();

        ErrorHandler.logInfo('Effects resumed');
    }

    /**
     * Dispose of all resources
     */
    dispose() {
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];

        if (this.bloodDripController) {
            this.bloodDripController.dispose();
            this.bloodDripController = null;
        }
        if (this.cursorTrailController) {
            this.cursorTrailController.dispose();
            this.cursorTrailController = null;
        }
        if (this.todoIconController) {
            this.todoIconController.dispose();
            this.todoIconController = null;
        }
        if (this.candlelightController) {
            this.candlelightController.dispose();
            this.candlelightController = null;
        }
        if (this.floatingGhostController) {
            this.floatingGhostController.dispose();
            this.floatingGhostController = null;
        }
        if (this.configManager) {
            this.configManager.dispose();
            this.configManager = null;
        }

        ErrorHandler.logInfo('Effect Manager disposed');
    }
}

module.exports = EffectManager;
