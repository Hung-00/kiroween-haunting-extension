# 🔨 Build Instructions

Complete guide to building and packaging the Blood Drip Code extension.

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Visual Studio Code 1.85.0 or higher

## Quick Build

```bash
# 1. Install dependencies
npm install

# 2. Compile TypeScript
npm run compile

# 3. Run in development mode
# Open project in VS Code and press F5
```

## Detailed Build Steps

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- TypeScript compiler
- VS Code types
- ESLint and plugins
- Type definitions

### Step 2: Compile TypeScript

```bash
# One-time compilation
npm run compile

# Watch mode (auto-compile on changes)
npm run watch
```

Output goes to `/out` directory.

### Step 3: Run Extension

#### Option A: Debug Mode (F5)
1. Open project in VS Code
2. Press `F5`
3. Extension Development Host window opens
4. Test your changes

#### Option B: Manual Testing
```bash
# Compile first
npm run compile

# Then press F5 in VS Code
```

### Step 4: Test

```bash
# Run tests (if you add them)
npm test

# Lint code
npm run lint
```

## Building VSIX Package

### Install VSCE

```bash
npm install -g @vscode/vsce
```

### Package Extension

```bash
# Create VSIX package
vsce package

# This creates: blood-drip-code-1.0.0.vsix
```

### Install VSIX Locally

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Click "..." menu
4. Select "Install from VSIX..."
5. Choose `blood-drip-code-1.0.0.vsix`

## Publishing to Marketplace (Optional)

### Prerequisites
- Create publisher account at https://marketplace.visualstudio.com/
- Get Personal Access Token from Azure DevOps

### Publish

```bash
# Login (one time)
vsce login your-publisher-name

# Publish
vsce publish

# Or publish specific version
vsce publish 1.0.1
```

## Development Workflow

### Recommended Workflow

1. **Make changes** in `/src`
2. **Compile** with `npm run watch` (auto-compiles)
3. **Test** with F5 in VS Code
4. **Debug** using VS Code debugger
5. **Iterate** until perfect

### File Structure

```
blood-drip-code/
├── src/                    # TypeScript source
│   ├── extension.ts        # Entry point
│   └── decorations/        # Feature modules
├── out/                    # Compiled JavaScript (gitignored)
├── node_modules/           # Dependencies (gitignored)
├── .vscode/                # VS Code config
├── media/                  # Assets
├── package.json            # Extension manifest
├── tsconfig.json           # TypeScript config
└── *.md                    # Documentation
```

## Troubleshooting

### TypeScript Errors

```bash
# Clean and rebuild
rm -rf out/
npm run compile
```

### Extension Not Loading

1. Check VS Code version (must be >= 1.85.0)
2. Reload window (`Ctrl+R`)
3. Check Developer Tools console (Help → Toggle Developer Tools)

### Compilation Errors

```bash
# Ensure all dependencies installed
npm install

# Check TypeScript version
npx tsc --version

# Should be 5.3.2 or higher
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules/
npm install
```

## Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| compile | `npm run compile` | Compile TypeScript once |
| watch | `npm run watch` | Compile on file changes |
| test | `npm test` | Run tests |
| lint | `npm run lint` | Check code style |
| package | `vsce package` | Create VSIX |
| publish | `vsce publish` | Publish to marketplace |

## Build Output

After compilation:
```
out/
├── extension.js              # Main entry
├── extension.js.map          # Source map
└── decorations/
    ├── bloodDrip.js
    ├── ghostCursor.js
    ├── candlelight.js
    └── skeletonComments.js
```

## Clean Build

```bash
# Remove compiled files
rm -rf out/

# Remove dependencies
rm -rf node_modules/

# Remove package
rm *.vsix

# Reinstall and rebuild
npm install
npm run compile
```

## Performance Testing

### Check Extension Size

```bash
# After packaging
ls -lh *.vsix

# Should be under 1MB
```

### Check Activation Time

1. Open VS Code
2. Help → Toggle Developer Tools
3. Console tab
4. Look for: "Blood Drip Code extension is now active!"
5. Should be < 100ms

### Memory Usage

1. Run extension
2. Open several files
3. Check Task Manager/Activity Monitor
4. VS Code should not use excessive memory

## CI/CD (Future)

For automated builds:

```yaml
# .github/workflows/build.yml
name: Build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run compile
      - run: npm test
```

## Version Management

### Updating Version

```bash
# Update version in package.json
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# Then rebuild
npm run compile
vsce package
```

## Distribution

### For Hackathon Submission

1. Build VSIX: `vsce package`
2. Test VSIX locally
3. Upload to Devpost
4. Include in GitHub release

### For Public Release

1. Update CHANGELOG.md
2. Update version in package.json
3. Test thoroughly
4. Create VSIX
5. Publish to marketplace
6. Create GitHub release with VSIX attached

## Support

If you encounter build issues:
1. Check Node.js version: `node --version`
2. Check npm version: `npm --version`
3. Check VS Code version
4. Review error messages in terminal
5. Check VS Code Developer Tools console

---

**Need Help?** Check CONTRIBUTING.md or open an issue!

**Happy Building!** 🔨🩸
