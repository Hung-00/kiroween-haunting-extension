# Blood Drip 🩸

A horror-themed VS Code extension that adds spooky visual effects to your coding experience.

## Features

### 🩸 Blood Drip Animation on Error Lines
When your code has errors, watch as blood drips from those lines! The effect uses a red gradient (#8B0000 to #FF0000) and animates at 30 FPS.

### 👻 Ethereal Cursor Trails
As you move your cursor through the code, ghostly trails follow behind, fading away over 800ms. The pale, semi-transparent effect creates an atmospheric coding experience.

### 💀 Spooky TODO Icons
Your TODO comments get a horror makeover with spooky gutter icons. Detects multiple keywords:
- TODO, FIXME, HACK, XXX, BUG, DEPRECATED, WARNING

Choose your icon variant:
- 💀 Skull (default)
- 👻 Ghost
- 🪦 Tombstone

### 🕯️ Candlelight Mode
Focus on your code with a candlelight effect that dims lines away from your cursor. Creates an atmospheric, focused coding experience.

### 👻 Floating Ghost
A spooky ghost randomly appears and floats around your editor! It shows up every 5-15 seconds, moves around for 2 seconds, then vanishes. Features different spooky emojis: 👻 💀 🦇 🕷️ 👁️

## Commands

Open Command Palette (`Ctrl+Shift+P`) and search for:

| Command | Description |
|---------|-------------|
| `Blood Drip: Toggle Blood Drip Effect` | Turn blood drips on/off |
| `Blood Drip: Toggle Ghost Cursor Trail` | Turn cursor trails on/off |
| `Blood Drip: Toggle Spooky TODO Icons` | Turn TODO icons on/off |
| `Blood Drip: Toggle Candlelight Mode` | Turn candlelight focus on/off |
| `Blood Drip: Toggle Floating Ghost` | Turn floating ghost on/off |
| `Blood Drip: Toggle All Haunting Effects` | Toggle all effects at once |

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Blood Drip"
4. Click Install

## Run Locally (Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [VS Code](https://code.visualstudio.com/) (v1.74.0 or higher)

### Step-by-Step Setup

**Step 1: Open Terminal and Navigate to Extension Folder**
```bash
cd blood-drip-vscode
```

**Step 2: Install Dependencies**
```bash
npm install
```
This installs the VS Code extension development dependencies.

**Step 3: Open the Project in VS Code**

IMPORTANT: You must open the `blood-drip-vscode` folder directly as the workspace root.

```bash
code .
```
Or manually: File > Open Folder > select the `blood-drip-vscode` folder.

**Step 4: Start Debugging**

The project includes a `.vscode/launch.json` file that configures the debugger.

Option A - Using Keyboard:
- Press `F5`

Option B - Using Menu:
- Go to `Run` menu > `Start Debugging`

Option C - Using Run and Debug Panel:
- Click the Run and Debug icon in the sidebar (or `Ctrl+Shift+D`)
- Select "Run Extension" from the dropdown
- Click the green play button

**What happens:** A new VS Code window opens called "[Extension Development Host]" with your extension loaded. You'll see this in the window title bar.

**Step 5: Test the Extension**

In the Extension Development Host window:

| Feature | How to Test |
|---------|-------------|
| Blood Drips | Open a `.js` or `.ts` file and write invalid code (e.g., `const x =`) to trigger an error |
| Cursor Trails | Move your cursor around the editor - ghostly trails follow |
| TODO Icons | Type `// TODO: fix this` or `// FIXME: bug here` - spooky icons appear |
| Candlelight | Run command "Blood Drip: Toggle Candlelight Mode" to enable focus effect |
| Floating Ghost | Wait 5-15 seconds and watch for a ghost to appear and float around! |

**Step 6: Reload After Changes**

After editing source files in `src/`:
- Press `Ctrl+Shift+F5` (Windows/Linux) or `Cmd+Shift+F5` (Mac)
- Or click the green restart button in the debug toolbar

### Package for Distribution

To create a `.vsix` file you can share or install manually:

```bash
# Install the packaging tool (one-time)
npm install -g @vscode/vsce

# Create the package
vsce package
```

This creates `blood-drip-0.0.1.vsix`. To install it:
- Open VS Code
- Go to Extensions (`Ctrl+Shift+X`)
- Click the `...` menu > "Install from VSIX..."
- Select the `.vsix` file

## Configuration

Open Settings (Ctrl+,) and search for "Blood Drip" to customize:

| Setting | Description | Default |
|---------|-------------|---------|
| `bloodDrip.bloodDripEnabled` | Enable blood drip animation on error lines | `true` |
| `bloodDrip.cursorTrailEnabled` | Enable ethereal cursor movement trails | `true` |
| `bloodDrip.todoIconEnabled` | Enable spooky TODO icons in the gutter | `true` |
| `bloodDrip.todoIconVariant` | Select icon variant: skull, ghost, or tombstone | `skull` |
| `bloodDrip.candlelightEnabled` | Enable candlelight mode (dims lines away from cursor) | `false` |
| `bloodDrip.floatingGhostEnabled` | Enable floating ghost that randomly appears | `true` |

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
