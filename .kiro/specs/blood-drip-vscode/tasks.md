# Implementation Plan

- [x] 1. Set up project structure and core infrastructure

  - [ ] 1.1 Initialize VS Code extension project with TypeScript

    - Run `yo code` generator or manually create package.json with extension manifest
    - Configure tsconfig.json for VS Code extension development

    - Set up ESLint and Prettier for code quality
    - _Requirements: 5.5_

  - [x] 1.2 Create directory structure and base files

    - Create src/controllers/, src/services/, src/models/, src/utils/ directories
    - Create resources/icons/ and resources/styles/ directories
    - Add placeholder files for all modules

    - _Requirements: 5.5_

  - [ ] 1.3 Implement extension entry point

    - Create src/extension.ts with activate() and deactivate() functions

    - Register extension activation events in package.json
    - Set up disposable management for cleanup
    - _Requirements: 5.5_

- [ ] 2. Implement Configuration Manager

  - [ ] 2.1 Create types and configuration interface

    - Define BloodDripConfig interface in src/models/types.ts
    - Define EffectType enum and TodoIconVariant enum

    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 2.2 Implement ConfigurationManager service

    - Create src/services/configurationManager.ts

    - Implement getConfig() method to read VS Code settings
    - Implement onConfigChange() with workspace.onDidChangeConfiguration listener
    - Apply configuration changes within 1 second without restart
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 2.3 Register configuration schema in package.json
    - Add contributes.configuration section with all settings
    - Define bloodDrip.enabled, screamingBracket.enabled, todoIcon.enabled boolean settings
    - Define todoIcon.variant enum setting with skull/ghost/tombstone options
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 3. Implement Effect Manager

  - [ ] 3.1 Create Effect Manager class

    - Create src/effectManager.ts with singleton pattern
    - Implement initialize() to set up all controllers

    - Implement enableEffect() and disableEffect() methods
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 3.2 Implement pause/resume functionality

    - Add pauseAllEffects() for when editor loses focus

    - Add resumeAllEffects() for when editor gains focus
    - Listen to window.onDidChangeWindowState events
    - _Requirements: 5.3_

  - [ ] 3.3 Implement resource disposal
    - Create dispose() method to clean up all controllers
    - Ensure all decorations and listeners are properly disposed
    - _Requirements: 5.5_

- [ ] 4. Implement TODO Icon Controller

  - [ ] 4.1 Create spooky icon SVG assets

    - Create resources/icons/skull.svg (16x16 pixels)

    - Create resources/icons/ghost.svg (16x16 pixels)
    - Create resources/icons/tombstone.svg (16x16 pixels)
    - _Requirements: 3.2, 3.4_

  - [ ] 4.2 Implement TODO pattern detection

    - Create src/controllers/todoIconController.ts
    - Implement scanDocument() with regex pattern for TODO comments
    - Support various TODO formats (TODO, TODO:, // TODO, # TODO)

    - _Requirements: 3.1_

  - [ ] 4.3 Implement gutter icon decorations
    - Create TextEditorDecorationType with gutterIconPath
    - Implement updateDecorations() to apply icons to detected lines
    - Remove icons within 200ms when TODO is deleted
    - _Requirements: 3.1, 3.3, 3.4_
  - [ ] 4.4 Implement icon variant selection

    - Add setIconVariant() method to switch between icon styles
    - Listen to configuration changes for todoIcon.variant

    - _Requirements: 3.5_

  - [ ] 4.5 Write unit tests for TODO Icon Controller
    - Test TODO pattern matching with various formats
    - Test decoration creation and removal
    - Test icon variant switching
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 5. Implement Screaming Bracket Controller

  - [ ] 5.1 Create bracket error detection module
    - Create src/controllers/screamingBracketController.js
    - Implement regex patterns to detect bracket-related error messages
    - Support parentheses (), curly braces {}, and square brackets []
    - _Requirements: 2.1_
  - [ ] 5.2 Create decoration pool for screaming brackets
    - Pre-create decoration types for pulse animation frames
    - Create decoration type for matching bracket (dimmer glow)
    - Store in pool for reuse (no rapid create/dispose)
    - _Requirements: 2.2_
  - [ ] 5.3 Write property test for bracket error detection
    - **Property 7: Bracket Error Detection**
    - Test that diagnostic messages with bracket keywords are correctly identified
    - Use fast-check to generate various diagnostic messages
    - **Validates: Requirements 2.1**
  - [ ] 5.4 Implement pulsing glow animation
    - Create animation loop that cycles through pulse frames
    - Apply red glow effect (rgba 255,0,0 with varying opacity 0.1-0.3)
    - Display 😱 or 💀 emoji adjacent to screaming bracket
    - _Requirements: 2.2, 2.3_
  - [ ] 5.5 Write property test for matching bracket opacity
    - **Property 10: Matching Bracket Opacity**
    - Test that matching bracket glow is always dimmer than screaming bracket
    - **Validates: Requirements 2.5**
  - [ ] 5.6 Implement matching bracket highlighting
    - Find matching bracket position when available
    - Apply dimmer glow decoration to matching bracket
    - Remove decorations within 300ms when error is resolved
    - _Requirements: 2.4, 2.5_
  - [ ] 5.7 Integrate with Effect Manager
    - Add screamingBracketEnabled config option
    - Wire up enable/disable/toggle commands
    - Register with Effect Manager initialization
    - _Requirements: 4.2_

- [ ] 6. Fix Blood Drip Controller Animation

  - [ ] 6.1 Refactor to use decoration pooling
    - Pre-create all decoration types at initialization (error, warning, drip frames)
    - Store decoration types in a pool object for reuse
    - Remove rapid create/dispose pattern from animation loop
    - _Requirements: 1.4, 1.5_
  - [ ] 6.2 Write property test for decoration pool reuse
    - **Property 9: Decoration Pool Reuse**
    - Test that no new decoration types are created during animation cycles
    - Verify pool contains fixed set of pre-created types
    - **Validates: Requirements 1.4**
  - [ ] 6.3 Implement single animation interval per line
    - Track active animation intervals in a Map (line -> intervalId)
    - Clear existing interval before starting new animation on same line
    - Prevent overlapping animation loops on the same error line
    - _Requirements: 1.6_
  - [ ] 6.4 Write property test for single animation interval
    - **Property 8: Single Animation Interval Per Line**
    - Test that each error line has exactly one active animation interval
    - Verify starting new animation clears existing interval
    - **Validates: Requirements 1.6**
  - [ ] 6.5 Fix animation frame cycling
    - Cycle through drip emoji frames (🩸💧🔴) using pooled decorations
    - Clear previous frame decoration before applying next frame
    - Maintain consistent 200ms frame duration
    - _Requirements: 1.4_
  - [ ] 6.6 Update error line styling
    - Apply visible left border (4px solid rgba(139,0,0,0.7))
    - Add subtle background tint (rgba(139,0,0,0.15))
    - Show in overview ruler with #8B0000 color
    - _Requirements: 1.5_

- [ ] 7. Implement utility modules and error handling

  - [ ] 7.1 Create animation utilities
    - Create src/utils/animationUtils.js
    - Implement frame rate limiting functions
    - Add pulse opacity calculation for screaming brackets
    - _Requirements: 1.4, 2.2_
  - [ ] 7.2 Implement error handler
    - Create src/utils/errorHandler.js
    - Handle resource errors with user notifications
    - Handle performance errors with silent quality reduction
    - _Requirements: 5.1, 5.2_

- [ ] 8. Wire up components and finalize extension

  - [ ] 8.1 Integrate all controllers with Effect Manager
    - Initialize all controllers in effectManager.initialize()
    - Wire configuration changes to controller updates
    - Connect window focus events to pause/resume
    - _Requirements: 4.5, 5.3_
  - [ ] 8.2 Complete extension activation flow
    - Update extension.ts to create and initialize EffectManager
    - Register all disposables with extension context
    - Add activation event for onStartupFinished
    - _Requirements: 5.5_
  - [ ] 8.3 Add extension metadata and README
    - Complete package.json with extension metadata, icon, and categories
    - Create README.md with feature descriptions and screenshots placeholder
    - Add CHANGELOG.md for version tracking
    - _Requirements: All_
  - [ ] 8.4 Write integration tests
    - Test full extension activation and deactivation
    - Test configuration change propagation
    - Test resource cleanup on deactivation
    - _Requirements: 5.5_

- [ ] 9. Checkpoint - Verify blood drip fix and screaming brackets

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Enhance Floating Ghost with Smooth Flight Animation

  - [ ] 10.1 Create flight path calculation module
    - Create src/utils/flightPath.js with bezier curve calculation functions
    - Implement calculateFlightPath() to generate paths from edge to edge
    - Implement getPositionAtTime() for smooth position interpolation
    - Add sinusoidal bobbing effect calculation
    - _Requirements: 6.1, 6.2, 6.8_
  - [ ] 10.2 Write property test for spawn interval range
    - **Property 1: Spawn Interval Range**
    - Test that generated spawn intervals are always between 5000ms and 15000ms
    - Use fast-check to generate random spawn events
    - **Validates: Requirements 6.7**
  - [ ] 10.3 Write property test for flight path edge crossing
    - **Property 2: Flight Path Edge Crossing**
    - Test that flight paths always start and end on different edges
    - Verify path crosses through visible editor area
    - **Validates: Requirements 6.8**
  - [ ] 10.4 Write property test for bezier position continuity
    - **Property 3: Bezier Position Continuity**
    - Test that adjacent time values produce positions within 15% of path length
    - Verify smooth continuous motion along the path
    - **Validates: Requirements 6.1, 6.2**
  - [ ] 10.5 Create WebView HTML template for ghost animation
    - Create resources/ghost-webview.html with transparent background
    - Add CSS for ghost element with transform animations
    - Implement message handler for move/spawn/despawn commands
    - Add glow effect using CSS filter/box-shadow
    - _Requirements: 6.3, 6.5, 6.6_
  - [ ] 10.6 Write property test for opacity range
    - **Property 4: Opacity Range Constraint**
    - Test that ghost opacity values are always between 0.5 and 0.9
    - **Validates: Requirements 6.5**
  - [ ] 10.7 Write property test for CSS transform usage
    - **Property 5: CSS Transform Usage**
    - Test that animation styles use transform properties only
    - Verify no layout-triggering properties (top, left, width, height)
    - **Validates: Requirements 6.10**
  - [ ] 10.8 Write property test for bobbing effect bounds
    - **Property 6: Bobbing Effect Bounded**
    - Test that bobbing offset is within ±15 pixels of base position
    - **Validates: Requirements 6.2**
  - [ ] 10.9 Refactor FloatingGhostController to use WebView
    - Replace decoration-based approach with WebView overlay
    - Create WebView panel with transparent background
    - Implement postMessage communication for animation control
    - Add pointer-events: none to prevent input interception
    - _Requirements: 6.3, 6.4_
  - [ ] 10.10 Implement smooth animation loop
    - Use requestAnimationFrame for 30+ FPS animation
    - Calculate position along bezier path each frame
    - Send position updates to WebView via postMessage
    - Implement fade in (300ms) and fade out (500ms) transitions
    - _Requirements: 6.1, 6.6_
  - [ ] 10.11 Implement edge spawn and despawn logic
    - Generate random spawn points along editor edges
    - Calculate despawn point on opposite or adjacent edge
    - Implement random spawn interval timer (5-15 seconds)
    - _Requirements: 6.7, 6.8_
  - [ ] 10.12 Add pause/resume support for window focus
    - Pause animation loop when window loses focus
    - Resume animation when window regains focus
    - Clear any pending spawn timers on pause
    - _Requirements: 6.9_

- [ ] 11. Checkpoint - Verify floating ghost enhancement

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Update package.json and documentation
  - [ ] 12.1 Update package.json configuration
    - Add bloodDrip.screamingBracketEnabled setting
    - Add command for screaming brackets toggle
    - _Requirements: 4.2_
  - [ ] 12.2 Update README.md
    - Add screaming brackets feature description
    - Update configuration table with new settings
    - _Requirements: N/A (documentation)_
