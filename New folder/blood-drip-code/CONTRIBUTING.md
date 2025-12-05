# 🎃 Contributing to Blood Drip Code

Thank you for your interest in contributing to Blood Drip Code! This document provides guidelines for contributing to the project.

## 🌟 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new haunting features
- 📝 Improve documentation
- 🎨 Create themes or visual enhancements
- 🔧 Fix issues
- ✨ Add new spooky effects

## 🚀 Getting Started

### 1. Set Up Development Environment

```bash
# Clone or extract the project
cd blood-drip-code

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes during development
npm run watch
```

### 2. Run the Extension

Press `F5` in VS Code to launch the Extension Development Host with your changes.

### 3. Make Changes

The codebase is organized as follows:
```
src/
├── extension.ts              # Main entry point
├── decorations/
│   ├── bloodDrip.ts          # Blood drip logic
│   ├── ghostCursor.ts        # Ghost cursor tracking
│   ├── candlelight.ts        # Focus mode
│   └── skeletonComments.ts   # Comment decorations
└── utils/                    # Utility functions
```

## 📋 Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow existing code formatting
- Add comments for complex logic
- Use meaningful variable names

### Naming Conventions

- Classes: `PascalCase` (e.g., `BloodDripDecorator`)
- Functions: `camelCase` (e.g., `updateDiagnostics`)
- Constants: `UPPER_CASE` (e.g., `MAX_HISTORY_LENGTH`)
- Files: `camelCase.ts` (e.g., `bloodDrip.ts`)

### Adding New Features

1. **Create a new decorator** in `src/decorations/`
2. **Register it** in `src/extension.ts`
3. **Add commands** in `package.json`
4. **Add settings** in `package.json` configuration
5. **Update documentation** in README.md
6. **Test thoroughly**

### Example: Adding a New Effect

```typescript
// src/decorations/newEffect.ts
import * as vscode from 'vscode';

export class NewEffect {
    private enabled: boolean = true;
    private decorationType: vscode.TextEditorDecorationType;

    constructor(private context: vscode.ExtensionContext) {
        this.decorationType = vscode.window.createTextEditorDecorationType({
            // Your decoration styles
        });
    }

    toggle() {
        this.enabled = !this.enabled;
        // Toggle logic
    }

    reload() {
        // Reload logic
    }

    dispose() {
        this.decorationType.dispose();
    }
}
```

Then register in `extension.ts`:
```typescript
import { NewEffect } from './decorations/newEffect';

let newEffect: NewEffect;

export function activate(context: vscode.ExtensionContext) {
    newEffect = new NewEffect(context);
    // Add to subscriptions...
}
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**:
   - VS Code version
   - Operating system
   - Extension version
6. **Screenshots**: If applicable

### Bug Report Template

```markdown
## Bug Description
[Clear description]

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- VS Code version: 
- OS: 
- Extension version: 

## Screenshots
[If applicable]
```

## 💡 Feature Requests

We love new ideas! When suggesting features:

1. **Describe the feature** clearly
2. **Explain the use case**
3. **Provide examples** if possible
4. **Consider the "haunted" theme** - how does it fit?

### Feature Request Template

```markdown
## Feature Description
[Clear description of the feature]

## Use Case
[Why is this needed? What problem does it solve?]

## Examples
[Visual examples or mockups if possible]

## Haunted Theme Fit
[How does this fit the spooky aesthetic?]
```

## 🎨 Design Guidelines

When adding visual effects:

### Color Palette
- **Blood Red**: `#8B0000` (dark red)
- **Ghost White**: `rgba(255, 255, 255, 0.3)` (transparent white)
- **Candlelight**: `rgba(255, 250, 205, 0.05)` (warm yellow)
- **Skeleton Gold**: `#FFD700` (gold)

### Animation Principles
- **Smooth**: Use easing functions
- **Performance**: Keep animations under 60fps
- **Subtle**: Don't distract from coding
- **Purposeful**: Each effect should enhance functionality

### Accessibility
- Ensure sufficient contrast
- Provide options to disable effects
- Don't rely solely on color
- Test with different themes

## ✅ Pull Request Process

1. **Fork** the repository
2. **Create a branch**: `feature/your-feature-name`
3. **Make changes** following the guidelines
4. **Test thoroughly**
5. **Update documentation**
6. **Commit** with clear messages
7. **Submit pull request**

### Commit Message Format

```
type: Short description

Longer description if needed

- Bullet points for changes
- Additional details
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

### Example Commits

```
feat: Add pulsing animation to blood drips

Implemented pulsing effect using CSS animations.
Blood drips now pulse before dripping down.

- Added pulse keyframes
- Updated decoration types
- Added setting for pulse speed
```

## 🧪 Testing

Before submitting:

1. **Test all features** manually
2. **Test with different file types**
3. **Test with different VS Code themes**
4. **Test performance** with large files
5. **Check for console errors**

### Testing Checklist

- [ ] Blood drip appears on errors
- [ ] Ghost cursor trails work
- [ ] Candlelight mode functions
- [ ] Skeleton decorations appear
- [ ] All commands work
- [ ] Settings sync properly
- [ ] No console errors
- [ ] Performance is acceptable

## 📚 Documentation

When adding features:

1. **Update README.md** with feature description
2. **Update CHANGELOG.md** with changes
3. **Add inline comments** for complex code
4. **Update settings documentation**
5. **Add examples** where helpful

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the project
- Keep it spooky but professional! 👻

## 🎃 Kiroween Spirit

Remember: This project was built for the Kiroween hackathon! Keep the Halloween spirit alive:
- Embrace creativity
- Think outside the coffin
- Make coding fun and spooky
- Enhance functionality with aesthetics

## 📧 Questions?

If you have questions about contributing:
- Open an issue with the "question" label
- Check existing documentation
- Look at similar implementations in the code

## 🙏 Thank You!

Every contribution makes Blood Drip Code better for the community. Whether you're fixing a typo or adding a major feature, your work is appreciated!

**Happy Haunted Contributing!** 🩸👻🕯️
