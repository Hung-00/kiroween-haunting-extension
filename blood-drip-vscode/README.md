# Blood Drip 🩸

A horror-themed VS Code extension that adds spooky visual effects to your coding experience.

## Features

### 🩸 Blood Drip Animation on Error Lines
When your code has errors, watch as blood drips from those lines! The effect uses a red gradient (#8B0000 to #FF0000) and animates at 30 FPS.

### 👻 Ethereal Cursor Trails
As you move your cursor through the code, ghostly trails follow behind, fading away over 800ms. The pale, semi-transparent effect creates an atmospheric coding experience.

### 💀 Spooky TODO Icons
Your TODO comments get a horror makeover with spooky gutter icons. Choose from:
- 💀 Skull (default)
- 👻 Ghost
- 🪦 Tombstone

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Blood Drip"
4. Click Install

## Run Locally (Development)

To test and develop the extension locally:

1. **Clone or navigate to the extension folder:**
   ```bash
   cd blood-drip-vscode
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Open in VS Code:**
   ```bash
   code .
   ```

4. **Launch the Extension Development Host:**
   - Press `F5` or go to Run > Start Debugging
   - This opens a new VS Code window with the extension loaded

5. **Test the features:**
   - Open any code file with syntax errors to see blood drips
   - Move your cursor around to see ethereal trails
   - Add a `// TODO: something` comment to see spooky icons

6. **Make changes:**
   - Edit the source files in `src/`
   - Press `Ctrl+Shift+F5` to reload the Extension Development Host

### Package for Distribution

To create a `.vsix` file for sharing:

```bash
npm install -g @vscode/vsce
vsce package
```

This creates a `blood-drip-0.0.1.vsix` file you can share or install manually.

## Configuration

Open Settings (Ctrl+,) and search for "Blood Drip" to customize:

| Setting | Description | Default |
|---------|-------------|---------|
| `bloodDrip.bloodDripEnabled` | Enable blood drip animation on error lines | `true` |
| `bloodDrip.cursorTrailEnabled` | Enable ethereal cursor movement trails | `true` |
| `bloodDrip.todoIconEnabled` | Enable spooky TODO icons in the gutter | `true` |
| `bloodDrip.todoIconVariant` | Select icon variant: skull, ghost, or tombstone | `skull` |

## Performance

The extension is designed to be lightweight:
- Animations pause when the editor loses focus
- Diagnostic changes are debounced (100ms) to prevent excessive updates
- Trail segments are limited to 10 at a time
- All resources are properly disposed when the extension deactivates

## Requirements

- VS Code 1.74.0 or higher

## License

MIT
