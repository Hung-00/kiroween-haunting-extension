const vscode = require("vscode");
const ConfigurationManager = require("./services/configurationManager");
const BloodDripController = require("./controllers/bloodDripController");
const TodoIconController = require("./controllers/todoIconController");
const CandlelightController = require("./controllers/candlelightController");
const GhostCursorController = require("./controllers/ghostCursorController");
const ErrorHandler = require("./utils/errorHandler");
const { EffectType } = require("./models/types");

/**
 * Central manager for all Blood Drip visual effects
 */
class EffectManager {
  constructor() {
    /** @type {ConfigurationManager|null} */
    this.configManager = null;
    /** @type {BloodDripController|null} */
    this.bloodDripController = null;
    /** @type {TodoIconController|null} */
    this.todoIconController = null;
    /** @type {CandlelightController|null} */
    this.candlelightController = null;
    /** @type {GhostCursorController|null} */
    this.ghostCursorController = null;
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
    this.configManager = new ConfigurationManager();
    this.configManager.initialize();

    const config = this.configManager.getFullConfig();

    this.bloodDripController = new BloodDripController();
    this.todoIconController = new TodoIconController();
    this.candlelightController = new CandlelightController();
    this.ghostCursorController = new GhostCursorController();

    this.bloodDripController.initialize(context);
    this.todoIconController.initialize(context);
    this.candlelightController.initialize(context);
    this.ghostCursorController.initialize(context);

    this.applyConfiguration(config);
    this.registerCommands(context);

    const configDisposable = this.configManager.onConfigChange((newConfig) => {
      this.applyConfiguration(newConfig);
    });
    this.disposables.push(configDisposable);

    const focusDisposable = vscode.window.onDidChangeWindowState((state) => {
      if (state.focused) {
        this.resumeAllEffects();
      } else {
        this.pauseAllEffects();
      }
    });
    this.disposables.push(focusDisposable);

    this.showHauntedWelcome();
    ErrorHandler.logInfo("Effect Manager initialized");
  }

  showHauntedWelcome() {
    const message =
      "🎃 Welcome to the Haunted Editor... Your code bleeds tonight... 🩸";
    vscode.window
      .showInformationMessage(message, "Open Settings")
      .then((selection) => {
        if (selection === "Open Settings") {
          vscode.commands.executeCommand(
            "workbench.action.openSettings",
            "bloodDrip"
          );
        }
      });
  }

  registerCommands(context) {
    context.subscriptions.push(
      vscode.commands.registerCommand("bloodDrip.toggleBloodDrip", () => {
        if (this.bloodDripController) {
          if (this.bloodDripController.isEnabled) {
            this.bloodDripController.disable();
          } else {
            this.bloodDripController.enable();
          }
          vscode.window.showInformationMessage("🩸 Blood drip effect toggled!");
        }
      })
    );

    context.subscriptions.push(
      vscode.commands.registerCommand("bloodDrip.toggleTodoIcons", () => {
        if (this.todoIconController) {
          if (this.todoIconController.isEnabled) {
            this.todoIconController.disable();
          } else {
            this.todoIconController.enable();
          }
          vscode.window.showInformationMessage("💀 Spooky TODO icons toggled!");
        }
      })
    );

    context.subscriptions.push(
      vscode.commands.registerCommand("bloodDrip.toggleCandlelight", () => {
        if (this.candlelightController) {
          const enabled = this.candlelightController.toggle();
          vscode.window.showInformationMessage(
            `🕯️ Candlelight mode ${enabled ? "enabled" : "disabled"}!`
          );
        }
      })
    );

    context.subscriptions.push(
      vscode.commands.registerCommand("bloodDrip.toggleGhostCursor", () => {
        if (this.ghostCursorController) {
          const enabled = this.ghostCursorController.toggle();
          vscode.window.showInformationMessage(
            `👻 Ghost cursor ${enabled ? "enabled" : "disabled"}!`
          );
        }
      })
    );

    context.subscriptions.push(
      vscode.commands.registerCommand("bloodDrip.toggleAllEffects", () => {
        if (this.bloodDripController) {
          if (this.bloodDripController.isEnabled) {
            this.bloodDripController.disable();
          } else {
            this.bloodDripController.enable();
          }
        }
        if (this.todoIconController) {
          if (this.todoIconController.isEnabled) {
            this.todoIconController.disable();
          } else {
            this.todoIconController.enable();
          }
        }
        if (this.candlelightController) {
          this.candlelightController.toggle();
        }
        if (this.ghostCursorController) {
          this.ghostCursorController.toggle();
        }
        vscode.window.showInformationMessage(
          "🎃 All haunting effects toggled!"
        );
      })
    );
  }

  applyConfiguration(config) {
    if (config.bloodDripEnabled) {
      this.enableEffect(EffectType.BloodDrip);
    } else {
      this.disableEffect(EffectType.BloodDrip);
    }

    if (config.todoIconEnabled) {
      this.enableEffect(EffectType.TodoIcon);
    } else {
      this.disableEffect(EffectType.TodoIcon);
    }

    if (config.candlelightEnabled) {
      if (this.candlelightController) this.candlelightController.enable();
    } else {
      if (this.candlelightController) this.candlelightController.disable();
    }

    if (config.ghostCursorEnabled) {
      if (this.ghostCursorController) this.ghostCursorController.enable();
    } else {
      if (this.ghostCursorController) this.ghostCursorController.disable();
    }

    if (this.todoIconController) {
      this.todoIconController.setIconVariant(config.todoIconVariant);
    }
  }

  enableEffect(effectType) {
    switch (effectType) {
      case EffectType.BloodDrip:
        if (this.bloodDripController) this.bloodDripController.enable();
        break;
      case EffectType.TodoIcon:
        if (this.todoIconController) this.todoIconController.enable();
        break;
    }
  }

  disableEffect(effectType) {
    switch (effectType) {
      case EffectType.BloodDrip:
        if (this.bloodDripController) this.bloodDripController.disable();
        break;
      case EffectType.TodoIcon:
        if (this.todoIconController) this.todoIconController.disable();
        break;
    }
  }

  pauseAllEffects() {
    if (this.isPaused) return;
    this.isPaused = true;
    if (this.bloodDripController) this.bloodDripController.pause();
    ErrorHandler.logInfo("Effects paused");
  }

  resumeAllEffects() {
    if (!this.isPaused) return;
    this.isPaused = false;
    if (this.bloodDripController) this.bloodDripController.resume();
    ErrorHandler.logInfo("Effects resumed");
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];

    if (this.bloodDripController) {
      this.bloodDripController.dispose();
      this.bloodDripController = null;
    }
    if (this.todoIconController) {
      this.todoIconController.dispose();
      this.todoIconController = null;
    }
    if (this.candlelightController) {
      this.candlelightController.dispose();
      this.candlelightController = null;
    }
    if (this.ghostCursorController) {
      this.ghostCursorController.dispose();
      this.ghostCursorController = null;
    }
    if (this.configManager) {
      this.configManager.dispose();
      this.configManager = null;
    }

    ErrorHandler.logInfo("Effect Manager disposed");
  }
}

module.exports = EffectManager;
