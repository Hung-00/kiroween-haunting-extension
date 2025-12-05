# 🩸 Blood Drip Code - Installation Guide

## Quick Start (5 minutes)

### Prerequisites
- Visual Studio Code version 1.85.0 or higher
- No other dependencies required!

---

## 📦 Installation Methods

### Method 1: Install from VSIX (Easiest)

1. **Download the Extension**
   - Get `blood-drip-code-1.0.0.vsix` from the releases or build folder

2. **Open VS Code**
   - Launch Visual Studio Code

3. **Open Extensions Panel**
   - Click the Extensions icon in the sidebar (or press `Ctrl+Shift+X`)

4. **Install from VSIX**
   - Click the "..." menu button at the top of the Extensions panel
   - Select "Install from VSIX..."
   - Navigate to and select `blood-drip-code-1.0.0.vsix`

5. **Reload VS Code**
   - Click "Reload" when prompted
   - Or press `Ctrl+R` to reload the window

6. **Verify Installation**
   - You should see a welcome message: "🎃 Welcome to the Haunted Editor..."
   - Open Command Palette (`Ctrl+Shift+P`) and type "blood" to see available commands

### Method 2: Build from Source

1. **Extract the Project**
   ```bash
   unzip blood-drip-code.zip
   cd blood-drip-code
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Compile TypeScript**
   ```bash
   npm run compile
   ```

4. **Run in Development Mode**
   - Open the project folder in VS Code
   - Press `F5` to launch Extension Development Host
   - A new VS Code window will open with the extension loaded

5. **Package as VSIX (Optional)**
   ```bash
   # Install vsce if you haven't already
   npm install -g @vscode/vsce
   
   # Package the extension
   vsce package
   
   # This creates: blood-drip-code-1.0.0.vsix
   ```

---

## ⚙️ First-Time Setup

### 1. Configure Your Preferences

Open VS Code Settings (`Ctrl+,` or `Cmd+,`) and search for "blood drip":

```json
{
  "bloodDripCode.bloodDripEnabled": true,
  "bloodDripCode.ghostCursorEnabled": true,
  "bloodDripCode.candlelightEnabled": false,
  "bloodDripCode.dripIntensity": "medium",
  "bloodDripCode.dripSpeed": 200
}
```

### 2. Test the Features

#### Test Blood Drip:
1. Create a new file with an intentional error:
   ```javascript
   // Missing semicolon
   const x = 10
   console.log(x)
   ```
2. Save the file - watch the blood drip! 🩸

#### Test Ghost Cursor:
1. Open any file
2. Move your cursor around rapidly
3. Watch the ghostly trails appear 👻

#### Test Candlelight Mode:
1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "Enable Candlelight"
3. Move your cursor - only nearby lines stay visible 🕯️

### 3. Set Up Keyboard Shortcuts (Optional)

1. Open Keyboard Shortcuts (`Ctrl+K Ctrl+S`)
2. Search for "blood-drip-code"
3. Assign shortcuts, for example:
   - `Ctrl+Alt+B` for Blood Drip toggle
   - `Ctrl+Alt+G` for Ghost Cursor toggle
   - `Ctrl+Alt+C` for Candlelight toggle
   - `Ctrl+Alt+H` for Toggle All Effects

---

## 🐛 Troubleshooting

### Extension Not Showing Commands

**Problem**: Can't find Blood Drip commands in Command Palette

**Solution**:
1. Check that extension is enabled: Go to Extensions, search "Blood Drip Code"
2. Reload VS Code: `Ctrl+R` or `Cmd+R`
3. Check VS Code version: Must be 1.85.0 or higher

### Blood Drips Not Appearing

**Problem**: Errors exist but no blood drips show

**Solution**:
1. Check setting: `bloodDripCode.bloodDripEnabled` should be `true`
2. Toggle the feature: Run "🩸 Enable Blood Drip on Errors" command twice
3. Check file language: Extension works best with languages that have diagnostics

### Performance Issues

**Problem**: Editor feels slow with extension enabled

**Solution**:
1. Increase animation speed: Set `bloodDripCode.dripSpeed` to higher value (e.g., 500)
2. Disable ghost cursor: Set `bloodDripCode.ghostCursorEnabled` to `false`
3. Use lighter drip intensity: Set `bloodDripCode.dripIntensity` to `"light"`

### Ghost Trails Too Intense

**Problem**: Too many ghost cursor marks

**Solution**:
1. Reduce sensitivity: Ghost trails fade after 5 seconds automatically
2. Toggle off temporarily: Run "👻 Enable Ghost Cursor Trails" command
3. Or disable in settings: `bloodDripCode.ghostCursorEnabled` to `false`

---

## 🔄 Updating the Extension

### Manual Update:
1. Download the new VSIX file
2. Uninstall the old version (Extensions → Blood Drip Code → Uninstall)
3. Install the new VSIX following Method 1 above
4. Reload VS Code

### Settings Persistence:
Your settings will be preserved across updates!

---

## ❌ Uninstallation

### Remove Extension:
1. Open Extensions panel (`Ctrl+Shift+X`)
2. Search for "Blood Drip Code"
3. Click the gear icon
4. Select "Uninstall"
5. Reload VS Code

### Clean Settings (Optional):
If you want to remove all settings:
1. Open Settings (`Ctrl+,`)
2. Search for "bloodDripCode"
3. Click "Reset Setting" for each option
4. Or manually remove from `settings.json`

---

## 🆘 Getting Help

### Issues or Questions?
- Check the README.md for detailed feature documentation
- Review CHANGELOG.md for version-specific information
- Open an issue on GitHub with:
  - Your VS Code version
  - Operating system
  - Steps to reproduce any problems
  - Screenshots if applicable

### Share Your Experience!
- Post screenshots with #Kiroween2025
- Share on social media with @kirodotdev
- Write about your spooky coding experience!

---

## 🎃 Enjoy Your Haunted Coding Experience!

Remember: The extension is designed to enhance your coding, not haunt it! 
Adjust settings to find the perfect balance of spooky and productive.

**Happy Haunted Coding!** 🩸👻🕯️
