# Capybara Dash - Development Prompt Summary

## Game Concept Development
**Initial Requirements Gathering:**
- User (11 years old) wanted to create first web browser game
- Side-scrolling platform game similar to Chrome dinosaur game and Geometry Dash
- Player controls capybara running through forest, jumping over obstacles
- Survival-based scoring (no win condition, play until death)
- Progressive difficulty (more obstacles, increased speed)

**Art & Visual Requirements:**
- Pixel art style with Amazon forest color scheme
- Capybara: brown/tan realistic colors with distinctive face
- Walking animation (4 frames), jumping (multiple frames), crawling when crouching
- Obstacles: pixel art fallen logs with bark, leafy branches with spikes, rivers with crocodiles
- Environment: grass texture, forest with trees, daytime setting
- Modern pixel art resolution, parallax scrolling background

**Technical Requirements:**
- Deployable as web application, iPad compatible
- Single directory structure for easy deployment
- Git repository for version control
- Modern frontend technologies (TypeScript, React initially, then simplified to pure Phaser 3)
- Touch controls for iPad: tap to jump, swipe down to crouch
- Desktop controls: 'A' to jump (with double jump), 'S' to crouch

## Development Evolution

### Phase 1: Basic Setup & Planning
```
- Project structure creation
- Package.json setup with Phaser 3, TypeScript, Vite
- Git repository initialization
- Configuration files (tsconfig, vite.config)
- HTML page setup
```

### Phase 2: Core Game Mechanics
```
- Player physics and controls implementation
- Ground collision system
- Obstacle spawning and movement system
- Score tracking (survival time based)
- Game over and restart functionality
```

### Phase 3: Control System Fixes
```
- Double jump implementation and debugging
- Touch control system for iPad
- Crouch physics corrections
- Jump count reset logic improvements
- Diagnostic display for debugging
```

### Phase 4: Bug Fixes & Optimization
```
- Obstacle movement physics corrections
- Collision detection improvements
- Frame resize issue resolution
- Play Again button fixes
- Obstacle spawn frequency adjustments
```

### Phase 5: Art & Scaling
```
- 200% entity size scaling
- Game width expansion (800px → 1200px)
- Pixel art sprite creation for capybara, logs, rivers, branches
- Side profile capybara redesign
- River graphics extension to screen bottom
- Hitbox alignment corrections
```

### Phase 6: Polish & Debugging
```
- Texture recreation error fixes for restart functionality
- Collision debugging and console logging
- Visual improvements and art refinements
```

## Key Technical Solutions

### Game Physics
- Phaser 3 arcade physics with custom gravity (1200)
- Jump velocity: -500 for proper feel with larger sprites
- Obstacle movement via velocity (-gameSpeed) rather than position manipulation
- Static physics groups for obstacles to prevent gravity conflicts

### Pixel Art Generation
- HTML5 Canvas with 2D context for procedural sprite generation
- Texture existence checking to prevent restart errors
- Color palette consistency across all sprites
- Proper sprite scaling and positioning

### Responsive Design
- Game scales to fit container while maintaining aspect ratio
- Touch controls optimized for iPad interaction
- Diagnostic overlay for development debugging

## Art Assets Created

### Capybara Sprite (60x80px)
- Side profile facing right
- Distinctive blunt snout and barrel-shaped body
- Realistic brown/tan Amazon color palette
- Short stubby legs characteristic of capybaras

### Obstacles
- **Fallen Logs (80x60px):** Tree rings, bark texture, branch stubs
- **River (120x80px):** Multi-layer water with 3 crocodiles, surface ripples, mud bottom
- **Spiky Branches (80x40px):** Leafy clusters with dangerous thorns pointing down

### Environment
- Ground texture with proper collision
- Extended game width for better gameplay
- Diagnostic overlay for development

## Control Schemes Implemented

### Desktop Controls
- 'A' key: Jump/Double jump
- 'S' key: Crouch/Duck
- Space/Enter: Restart game

### Touch Controls (iPad)
- Single tap: Jump
- Double tap: Double jump
- Swipe down: Crouch
- Button tap: Restart game

## Performance Optimizations
- Reduced obstacle spawn frequency for larger sprites
- Efficient sprite cleanup when off-screen
- Velocity-based movement for smooth physics
- Texture caching with proper cleanup on restart