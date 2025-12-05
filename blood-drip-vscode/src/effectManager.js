const vscode = require('vscode');
const ConfigurationManager = require('./services/configurationManager');
const BloodDripController = require('./controllers/bloodDripController');
const CursorTrailController = require('./controllers/cursorTrailController');
const TodoIconController = require('./controllers/todoIconController');
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

        this.bloodDripController.initialize(context);
        this.cursorTrailController.initialize(context);
        this.todoIconController.initialize(context);

        // Apply initial configuration
        this.applyConfiguration(config);

        // Listen for configuration changes
        const configDisposable = this.configManager.onConfigChange((newConfig) => {
            this.applyConfiguration(newConfig);
        });
        this.disposables.push(configDisposable);

        // Listen for window focus changes to pause/resume animations
        const focusDisposable = vscode.window.onDidChangeWindowState((state) => {
            if (state.focused) {
                this.resumeAllEffects();
            } else {
                this.pauseAllEffects();
            }
        });
        this.disposables.push(focusDisposable);

        ErrorHandler.logInfo('Effect Manager initialized');
    }


    /**
     * Apply configuration to all controllers
     * @param {Object} config - Configuration object
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

        if (this.todoIconController) {
            this.todoIconController.setIconVariant(config.todoIconVariant);
        }
    }

    /**
     * Enable a specific effect
     * @param {string} effectType - Type of effect to enable
     */
    enableEffect(effectType) {
        switch (effectType) {
            case EffectType.BloodDrip:
                if (this.bloodDripController) {
                    this.bloodDripController.enable();
                }
                break;
            case EffectType.CursorTrail:
                if (this.cursorTrailController) {
                    this.cursorTrailController.enable();
                }
                break;
            case EffectType.TodoIcon:
                if (this.todoIconController) {
                    this.todoIconController.enable();
                }
                break;
        }
    }

    /**
     * Disable a specific effect
     * @param {string} effectType - Type of effect to disable
     */
    disableEffect(effectType) {
        switch (effectType) {
            case EffectType.BloodDrip:
                if (this.bloodDripController) {
                    this.bloodDripController.disable();
                }
                break;
            case EffectType.CursorTrail:
                if (this.cursorTrailController) {
                    this.cursorTrailController.disable();
                }
                break;
            case EffectType.TodoIcon:
                if (this.todoIconController) {
                    this.todoIconController.disable();
                }
                break;
        }
    }

    /**
     * Pause all effects (when editor loses focus)
     */
    pauseAllEffects() {
        if (this.isPaused) return;
        this.isPaused = true;

        if (this.bloodDripController) {
            this.bloodDripController.pause();
        }
        if (this.cursorTrailController) {
            this.cursorTrailController.pause();
        }

        ErrorHandler.logInfo('Effects paused');
    }

    /**
     * Resume all effects (when editor gains focus)
     */
    resumeAllEffects() {
        if (!this.isPaused) return;
        this.isPaused = false;

        if (this.bloodDripController) {
            this.bloodDripController.resume();
        }
        if (this.cursorTrailController) {
            this.cursorTrailController.resume();
        }

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
        if (this.configManager) {
            this.configManager.dispose();
            this.configManager = null;
        }

        ErrorHandler.logInfo('Effect Manager disposed');
    }
}

module.exports = EffectManager;
