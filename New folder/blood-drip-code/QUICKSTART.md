# 🚀 Quick Start Guide

Get up and running with Blood Drip Code in under 5 minutes!

## Step 1: Install (2 minutes)

### Extract the zip file
```bash
unzip blood-drip-code.zip
cd blood-drip-code
```

### Install dependencies
```bash
npm install
```

### Compile the extension
```bash
npm run compile
```

## Step 2: Run (1 minute)

### Option A: Development Mode
1. Open the project folder in VS Code
2. Press `F5`
3. A new VS Code window opens with the extension loaded

### Option B: Package and Install
```bash
# Install packaging tool
npm install -g @vscode/vsce

# Create VSIX package
vsce package

# Install the VSIX in VS Code
# Extensions → ... → Install from VSIX → Select blood-drip-code-1.0.0.vsix
```

## Step 3: Test (2 minutes)

### Test Blood Drip Effect
1. Create a new JavaScript file
2. Add some errors:
   ```javascript
   const x = 10  // Missing semicolon
   console.log(y)  // Undefined variable
   ```
3. Save the file
4. Watch the blood drip! 🩸

### Test Ghost Cursor
1. Open any file
2. Move your cursor around
3. See the ghost trails! 👻

### Test Candlelight Mode
1. Press `Ctrl+Shift+P`
2. Type "candlelight"
3. Select "🕯️ Enable Candlelight Focus Mode"
4. Move your cursor to see the effect

## Step 4: Customize (Optional)

Open Settings (`Ctrl+,`) and search for "blood drip" to customize:

```json
{
  "bloodDripCode.dripSpeed": 200,        // Animation speed
  "bloodDripCode.dripIntensity": "heavy", // light/medium/heavy
  "bloodDripCode.ghostCursorEnabled": true,
  "bloodDripCode.candlelightEnabled": false
}
```

## Commands Reference

Open Command Palette (`Ctrl+Shift+P`):
- `🩸 Enable Blood Drip on Errors`
- `👻 Enable Ghost Cursor Trails`
- `🕯️ Enable Candlelight Focus Mode`
- `🎃 Toggle All Haunting Effects`

## That's It! 🎃

You're now ready to code in the haunted editor!

For more details, see:
- [README.md](README.md) - Full documentation
- [INSTALLATION.md](INSTALLATION.md) - Detailed installation guide
- [CHANGELOG.md](CHANGELOG.md) - Version history

**Happy Haunted Coding!** 🩸👻🕯️
