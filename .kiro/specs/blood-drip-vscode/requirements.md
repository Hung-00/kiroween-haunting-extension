# Requirements Document

## Introduction

Blood Drip is a VS Code extension that adds horror-themed visual effects to the editor. The extension creates an immersive spooky coding experience through animated blood drips from error lines, screaming brackets on syntax errors, and themed icons for TODO comments. This extension is designed for developers who want to add a unique, atmospheric aesthetic to their coding environment.

## Glossary

- **Blood_Drip_Extension**: The VS Code extension system that manages all horror-themed visual effects
- **Error_Line**: A line of code flagged by VS Code diagnostics as containing an error
- **Blood_Drip_Animation**: An animated visual effect depicting blood dripping downward from a source point
- **Screaming_Bracket**: A visual effect that highlights mismatched or error-causing brackets with shaking animation and red glow
- **TODO_Icon**: A decorative icon displayed in the gutter next to lines containing TODO comments
- **Gutter**: The vertical area in VS Code between line numbers and the editor content
- **Decoration**: A VS Code API feature for adding visual elements to the editor

## Requirements

### Requirement 1: Blood Drip Animation on Error Lines

**User Story:** As a developer, I want to see animated blood drips from lines with errors, so that errors are visually striking and fit the horror theme.

#### Acceptance Criteria

1. WHEN the Blood_Drip_Extension detects an Error_Line, THE Blood_Drip_Extension SHALL display a Blood_Drip_Animation originating from that line within 500 milliseconds.
2. WHILE an Error_Line remains in the editor, THE Blood_Drip_Extension SHALL continue the Blood_Drip_Animation until the error is resolved.
3. WHEN an error is resolved on a line, THE Blood_Drip_Extension SHALL remove the Blood_Drip_Animation from that line within 500 milliseconds.
4. THE Blood_Drip_Extension SHALL animate the blood drip effect by cycling through drip emoji frames (🩸💧🔴) using a pooled decoration approach that reuses decoration types instead of creating and disposing them rapidly.
5. THE Blood_Drip_Extension SHALL render the Blood_Drip_Animation using a red color palette (#8B0000 to #FF0000) with a visible left border and background tint on error lines.
6. THE Blood_Drip_Extension SHALL use a single animation interval per error line rather than creating multiple overlapping animation loops.

### Requirement 2: Screaming Brackets Effect

**User Story:** As a developer, I want to see brackets that "scream" with visual effects when there are syntax errors, so that bracket-related errors are immediately obvious and fit the horror theme.

#### Acceptance Criteria

1. WHEN the Blood_Drip_Extension detects a syntax error involving brackets (parentheses, curly braces, square brackets), THE Blood_Drip_Extension SHALL apply a Screaming_Bracket effect to the problematic bracket.
2. THE Blood_Drip_Extension SHALL render the Screaming_Bracket with a pulsing red glow effect using CSS animation or decoration updates at 30 frames per second.
3. THE Blood_Drip_Extension SHALL display a small "scream" emoji (😱) or skull (💀) adjacent to the screaming bracket.
4. WHEN the bracket error is resolved, THE Blood_Drip_Extension SHALL remove the Screaming_Bracket effect within 300 milliseconds.
5. THE Blood_Drip_Extension SHALL highlight the matching bracket (if found) with a dimmer glow to show the pairing relationship.

### Requirement 3: Spooky TODO Icons

**User Story:** As a developer, I want to see spooky themed icons next to my TODO comments, so that task markers match the horror aesthetic.

#### Acceptance Criteria

1. WHEN the Blood_Drip_Extension detects a line containing "TODO" text, THE Blood_Drip_Extension SHALL display a TODO_Icon in the Gutter adjacent to that line.
2. THE Blood_Drip_Extension SHALL provide at least 3 different spooky icon variants (skull, ghost, tombstone) for TODO markers.
3. WHEN a TODO comment is removed from a line, THE Blood_Drip_Extension SHALL remove the corresponding TODO_Icon within 200 milliseconds.
4. THE Blood_Drip_Extension SHALL render TODO_Icons at a size of 16x16 pixels to match standard VS Code gutter icon dimensions.
5. WHERE the user has configured a preferred TODO_Icon style, THE Blood_Drip_Extension SHALL use the configured icon variant.

### Requirement 4: Extension Configuration

**User Story:** As a developer, I want to configure the visual effects, so that I can customize the horror experience to my preferences.

#### Acceptance Criteria

1. THE Blood_Drip_Extension SHALL provide a configuration option to enable or disable Blood_Drip_Animation with a default value of enabled.
2. THE Blood_Drip_Extension SHALL provide a configuration option to enable or disable Screaming_Bracket effect with a default value of enabled.
3. THE Blood_Drip_Extension SHALL provide a configuration option to enable or disable TODO_Icon display with a default value of enabled.
4. THE Blood_Drip_Extension SHALL provide a configuration option to select the TODO_Icon variant from available options.
5. WHEN a configuration value changes, THE Blood_Drip_Extension SHALL apply the new setting within 1 second without requiring an editor restart.

### Requirement 5: Performance and Resource Management

**User Story:** As a developer, I want the extension to run efficiently, so that it does not impact my coding performance.

#### Acceptance Criteria

1. THE Blood_Drip_Extension SHALL consume no more than 50 MB of memory during normal operation.
2. THE Blood_Drip_Extension SHALL limit CPU usage to no more than 5% during active animations.
3. WHEN the editor is not in focus, THE Blood_Drip_Extension SHALL pause all animations to conserve resources.
4. THE Blood_Drip_Extension SHALL debounce diagnostic change events with a 100 millisecond delay to prevent excessive updates.
5. THE Blood_Drip_Extension SHALL dispose of all animation resources when the extension is deactivated.

### Requirement 6: Floating Ghost Animation

**User Story:** As a developer, I want to see a ghost that smoothly flies across my editor, so that the effect feels natural and immersive rather than choppy.

#### Acceptance Criteria

1. WHEN the Floating_Ghost spawns, THE Blood_Drip_Extension SHALL animate the ghost along a smooth flight path using CSS transitions or requestAnimationFrame at a minimum of 30 frames per second.
2. THE Blood_Drip_Extension SHALL move the Floating_Ghost using bezier curve or sinusoidal paths to simulate natural floating motion with a subtle bobbing effect.
3. THE Blood_Drip_Extension SHALL create a transparent WebView overlay positioned over the active editor to render the ghost freely without text position constraints.
4. THE Blood_Drip_Extension SHALL ensure the WebView overlay does not intercept mouse clicks or keyboard input from the user.
5. THE Blood_Drip_Extension SHALL render the Floating_Ghost with a semi-transparent appearance (opacity 0.5-0.9) and apply a subtle glow effect using CSS box-shadow.
6. WHEN the Floating_Ghost spawns, THE Blood_Drip_Extension SHALL fade in the ghost over 300 milliseconds, and WHEN despawning, SHALL fade out over 500 milliseconds.
7. THE Blood_Drip_Extension SHALL spawn the Floating_Ghost at random intervals between 5 and 15 seconds from a random edge of the visible editor area.
8. THE Blood_Drip_Extension SHALL calculate a flight path that crosses through the visible editor area to a despawn point on the opposite or adjacent edge.
9. WHEN the VS Code window loses focus, THE Blood_Drip_Extension SHALL pause the Floating_Ghost animation to conserve resources.
10. THE Blood_Drip_Extension SHALL use CSS transforms for animation instead of layout-triggering properties to ensure GPU acceleration.
