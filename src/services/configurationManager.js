const vscode = require("vscode");
const { TodoIconVariant } = require("../models/types");

const CONFIG_SECTION = "bloodDrip";

/**
 * Configuration Manager for Blood Drip extension
 * Handles reading and watching configuration changes
 */
class ConfigurationManager {
  constructor() {
    /** @type {vscode.Disposable[]} */
    this.disposables = [];
    /** @type {Function[]} */
    this.changeListeners = [];
  }

  /**
   * Initialize the configuration manager
   */
  initialize() {
    const configWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(CONFIG_SECTION)) {
        const config = this.getFullConfig();
        this.changeListeners.forEach((listener) => listener(config));
      }
    });
    this.disposables.push(configWatcher);
  }

  /**
   * Get a configuration value
   * @template T
   * @param {string} key - Configuration key
   * @returns {T} Configuration value
   */
  getConfig(key) {
    const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
    return config.get(key);
  }

  /**
   * Get full configuration object
   * @returns {Object} Full configuration
   */
  getFullConfig() {
    return {
      bloodDripEnabled: this.getConfig("bloodDripEnabled") ?? true,
      todoIconEnabled: this.getConfig("todoIconEnabled") ?? true,
      todoIconVariant:
        this.getConfig("todoIconVariant") ?? TodoIconVariant.Skull,
      candlelightEnabled: this.getConfig("candlelightEnabled") ?? false,
      ghostCursorEnabled: this.getConfig("ghostCursorEnabled") ?? true,
      codeKillerEnabled: this.getConfig("codeKillerEnabled") ?? true,
    };
  }

  /**
   * Register a configuration change listener
   * @param {Function} callback - Callback function
   * @returns {vscode.Disposable} Disposable to unregister
   */
  onConfigChange(callback) {
    this.changeListeners.push(callback);
    return {
      dispose: () => {
        const index = this.changeListeners.indexOf(callback);
        if (index > -1) {
          this.changeListeners.splice(index, 1);
        }
      },
    };
  }

  /**
   * Dispose of all resources
   */
  dispose() {
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
    this.changeListeners = [];
  }
}

module.exports = ConfigurationManager;
