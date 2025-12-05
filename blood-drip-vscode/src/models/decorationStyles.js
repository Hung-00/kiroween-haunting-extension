const vscode = require("vscode");
const path = require("path");

/**
 * Creates blood drip decoration style
 * @param {number} opacity - Opacity value (0-1)
 * @returns {vscode.DecorationRenderOptions}
 */
function createBloodDripStyle(opacity = 1) {
  return {
    isWholeLine: true,
    backgroundColor: `rgba(139, 0, 0, ${opacity * 0.3})`,
    overviewRulerColor: "#8B0000",
    overviewRulerLane: vscode.OverviewRulerLane.Right,
    after: {
      contentText: "💧",
      color: `rgba(255, 0, 0, ${opacity})`,
    },
  };
}

/**
 * Creates TODO icon decoration style
 * @param {string} extensionPath - Path to extension directory
 * @param {string} variant - Icon variant (skull, ghost, tombstone)
 * @returns {vscode.DecorationRenderOptions}
 */
function createTodoIconStyle(extensionPath, variant) {
  return {
    gutterIconPath: path.join(
      extensionPath,
      "resources",
      "icons",
      `${variant}.svg`
    ),
    gutterIconSize: "16px",
  };
}

module.exports = {
  createBloodDripStyle,
  createTodoIconStyle,
};
