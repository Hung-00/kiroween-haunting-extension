# 🩸 Blood Drip Code - Haunted VS Code Extension

> Transform your editor into a haunted coding experience for **Kiroween 2025** 🎃

[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Kiroween](https://img.shields.io/badge/Kiroween-2025-orange)](https://kiroween.devpost.com/)

**Blood Drip Code** brings supernatural effects to your coding experience. Watch as errors bleed across your screen, ghost cursors trail your movements, and candlelight illuminates your focus.

## ✨ Features

### 🩸 Blood Drip on Errors
Animated blood drips from error lines with pulsing animations. The more critical the error, the more blood drips!
- **Errors**: Heavy blood drips with red highlights
- **Warnings**: Light blood drops with orange tints
- **Info**: Ghostly markers

### 👻 Ghost Cursor Trails
See your coding history as ethereal cursor trails that fade over time. Every movement leaves a ghostly trace that disappears after 5 seconds.

### 🕯️ Candlelight Focus Mode
Dims everything except the lines around your cursor, creating a candlelit coding atmosphere. Perfect for late-night debugging sessions.

### 💀 Skeleton Comment Decorations
Special markers automatically appear next to TODO, FIXME, HACK, BUG, and other important comments. Never miss a critical note again!

## 🚀 Installation

### Method 1: From VSIX (Recommended)
1. Download `blood-drip-code-1.0.0.vsix` from the releases
2. Open VS Code
3. Go to Extensions (`Ctrl+Shift+X`)
4. Click the "..." menu (top right)
5. Select "Install from VSIX..."
6. Choose the downloaded file
7. Reload VS Code when prompted

### Method 2: Build from Source
```bash
# Clone or extract the project
cd blood-drip-code

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Press F5 in VS Code to run in Extension Development Host
```

## 🎮 Usage

### Commands
Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and search:

- **🩸 Enable Blood Drip on Errors** - Toggle blood drip effects
- **👻 Enable Ghost Cursor Trails** - Toggle ghost cursor tracking
- **🕯️ Enable Candlelight Focus Mode** - Toggle focus lighting
- **🎃 Toggle All Haunting Effects** - Toggle everything at once

### Keyboard Shortcuts
You can set custom keyboard shortcuts in VS Code:
1. Open Keyboard Shortcuts (`Ctrl+K Ctrl+S`)
2. Search for "blood-drip-code"
3. Assign your preferred shortcuts

### Settings
Configure the extension in VS Code Settings (`Ctrl+,`):

```json
{
  "bloodDripCode.bloodDripEnabled": true,
  "bloodDripCode.ghostCursorEnabled": true,
  "bloodDripCode.candlelightEnabled": false,
  "bloodDripCode.dripIntensity": "medium",
  "bloodDripCode.dripSpeed": 200
}
```

#### Available Settings:
- `bloodDripCode.bloodDripEnabled` - Enable/disable blood drip effects
- `bloodDripCode.ghostCursorEnabled` - Enable/disable ghost cursor trails
- `bloodDripCode.candlelightEnabled` - Enable/disable candlelight mode
- `bloodDripCode.dripIntensity` - Blood drip intensity: `light`, `medium`, or `heavy`
- `bloodDripCode.dripSpeed` - Animation speed in milliseconds (50-1000)

## 🎨 Screenshots

### Blood Drip on Errors
![Blood Drip](media/blood-drip-preview.png)
*Errors bleed across your screen with animated drips*

### Ghost Cursor Trails
![Ghost Cursor](media/ghost-cursor-preview.png)
*See where you've been with fading ghost trails*

### Candlelight Focus Mode
![Candlelight](media/candlelight-preview.png)
*Code by candlelight - focus on what matters*

## 🛠️ Development

### Build Commands
```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Run tests
npm test

# Lint code
npm run lint
```

### Project Structure
```
blood-drip-code/
├── src/
│   ├── extension.ts              # Main entry point
│   ├── decorations/
│   │   ├── bloodDrip.ts          # Blood drip effects
│   │   ├── ghostCursor.ts        # Ghost cursor trails
│   │   ├── candlelight.ts        # Focus mode lighting
│   │   └── skeletonComments.ts   # Comment decorations
│   └── utils/
├── media/                         # Assets and images
├── package.json                   # Extension manifest
└── tsconfig.json                  # TypeScript config
```

## 🎃 Kiroween 2025

This extension was built for the **Kiroween Halloween Hackathon** - Costume Contest category.

**Theme**: Build any app but show a haunting user interface that's polished and unforgettable.

**How it fits**: Blood Drip Code transforms the familiar VS Code interface into a spooky, atmospheric coding environment where every error bleeds and every cursor movement leaves ghostly traces. The haunting UI elements actually enhance functionality by making errors more visible and creating better focus.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new haunting features
- Submit pull requests
- Share your spooky coding screenshots

## 📝 License

MIT License - Code freely, debug fearlessly

## 🙏 Acknowledgments

- Built with [Kiro AI](https://kiro.dev) - Spec-driven development
- Inspired by Halloween horror aesthetics
- Made with ❤️ (and 🩸) for Kiroween 2025

## 📧 Contact

Have questions or suggestions? Open an issue on GitHub or share your haunted coding experience!

---

**Warning**: This extension may cause an increased desire to code in dark mode at midnight. Side effects include enhanced focus, better error visibility, and an appreciation for the supernatural. 👻🩸🕯️

**Dare to code in the darkness?** Install Blood Drip Code today!
