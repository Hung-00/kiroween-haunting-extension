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
    - Define bloodDrip.enabled, cursorTrail.enabled, todoIcon.enabled boolean settings



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
  - [ ]* 4.5 Write unit tests for TODO Icon Controller
    - Test TODO pattern matching with various formats
    - Test decoration creation and removal


    - Test icon variant switching
    - _Requirements: 3.1, 3.2, 3.3_


- [ ] 5. Implement Cursor Trail Controller
  - [ ] 5.1 Create trail segment data model
    - Define TrailSegment interface in src/models/types.ts
    - Include position, opacity, timestamp, and decorationType properties

    - _Requirements: 2.1, 2.2_
  - [ ] 5.2 Implement cursor position tracking
    - Create src/controllers/cursorTrailController.ts
    - Listen to window.onDidChangeTextEditorSelection events
    - Track previous cursor positions for trail generation
    - _Requirements: 2.1_
  - [ ] 5.3 Implement trail rendering with fade effect
    - Create decoration styles with semi-transparent background (opacity 0.1-0.5)
    - Use pale color #E8E8E8 with decreasing opacity

    - Implement updateTrails() to refresh trail decorations

    - _Requirements: 2.2, 2.5_
  - [ ] 5.4 Implement trail fade-out animation
    - Calculate opacity based on segment age (800ms fade duration)
    - Remove segments after full fade-out

    - Limit to maximum 10 trail segments
    - _Requirements: 2.3, 2.4_
  - [ ]* 5.5 Write unit tests for Cursor Trail Controller
    - Test trail segment creation on cursor move


    - Test opacity calculation over time


    - Test maximum segment limit enforcement
    - _Requirements: 2.1, 2.3, 2.4_

- [x] 6. Implement Blood Drip Controller

  - [ ] 6.1 Create blood drip decoration styles
    - Define decoration styles in src/models/decorationStyles.ts
    - Use red color palette (#8B0000 to #FF0000 gradient)

    - Configure overview ruler indicator

    - _Requirements: 1.5_
  - [ ] 6.2 Implement diagnostics listener
    - Create src/controllers/bloodDripController.ts
    - Listen to languages.onDidChangeDiagnostics events
    - Debounce diagnostic changes with 100ms delay
    - _Requirements: 1.1, 5.4_
  - [ ] 6.3 Implement error line detection and decoration
    - Filter diagnostics for error severity only
    - Create decorations for error lines within 500ms
    - Remove decorations when errors are resolved within 500ms
    - _Requirements: 1.1, 1.2, 1.3_
  - [ ] 6.4 Implement blood drip animation effect
    - Create CSS-based animation for dripping effect
    - Target 30 frames per second animation rate
    - Use requestAnimationFrame or setInterval for animation loop
    - _Requirements: 1.4_
  - [ ]* 6.5 Write unit tests for Blood Drip Controller
    - Test decoration creation on diagnostic events
    - Test decoration removal on error resolution
    - Test debounce behavior
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 7. Implement utility modules and error handling
  - [ ] 7.1 Create animation utilities
    - Create src/utils/animationUtils.ts
    - Implement frame rate limiting functions
    - Add opacity calculation helpers
    - _Requirements: 1.4, 2.3_
  - [ ] 7.2 Implement error handler
    - Create src/utils/errorHandler.ts
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
  - [ ]* 8.4 Write integration tests
    - Test full extension activation and deactivation
    - Test configuration change propagation
    - Test resource cleanup on deactivation
    - _Requirements: 5.5_
